import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FeedbackBanner from './components/FeedbackBanner';
import ProgressDashboard from './components/ProgressDashboard';
import ExerciseForm from './components/ExerciseForm';
import ExerciseList from './components/ExerciseList';
import EditExerciseModal from './components/EditExerciseModal';
import { ensureAnonymousSession, isFirebaseConfigured } from './firebase/config';
import {
  obtenerEjercicios,
  agregarEjercicio,
  cambiarEstadoEjercicio,
  editarDatosEjercicio,
  eliminarEjercicio,
  cargarRutinaInicialScanFit,
} from './services/workoutService';
import './App.css';

function App() {
  const [usuarioAuth, setUsuarioAuth] = useState(null);
  const [ejercicios, setEjercicios] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState('Todos');
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [guardandoNuevo, setGuardandoNuevo] = useState(false);
  const [procesandoId, setProcesandoId] = useState(null);
  const [ejercicioEnEdicion, setEjercicioEnEdicion] = useState(null);
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const mostrarFeedback = (tipo, mensaje) => {
    setFeedback({ tipo, mensaje });
  };

  // Cargar documentos desde Cloud Firestore (getDocs)
  const cargarDatosFirestore = useCallback(async (silencioso = false) => {
    setCargandoInicial(true);
    try {
      const user = await ensureAnonymousSession();
      setUsuarioAuth(user);
      const datos = await obtenerEjercicios();
      setEjercicios(datos);
      if (silencioso) {
        mostrarFeedback(
          'success',
          'Rutina sincronizada correctamente con Cloud Firestore.'
        );
      }
    } catch (error) {
      console.error('Error al conectar con Firestore:', error);
      mostrarFeedback(
        'error',
        `Error al consultar Cloud Firestore: ${
          error.message || 'Verificá tu conexión, las reglas de Firestore y el archivo .env.'
        }`
      );
    } finally {
      setCargandoInicial(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosFirestore(false);
  }, [cargarDatosFirestore]);

  // AGREGAR (addDoc): Solo actualiza la interfaz si Firestore confirma la escritura
  const handleAgregarEjercicio = async (nuevoEjercicio) => {
    setGuardandoNuevo(true);
    setFeedback(null);
    try {
      const creado = await agregarEjercicio(nuevoEjercicio, usuarioAuth?.uid);
      setEjercicios((prev) => [creado, ...prev]);
      mostrarFeedback(
        'success',
        `¡"${creado.nombre}" fue registrado con éxito en tu plan (${creado.dia})!`
      );
      return true;
    } catch (error) {
      console.error('Error al agregar ejercicio:', error);
      mostrarFeedback(
        'error',
        `No se pudo guardar el ejercicio en Firestore: ${error.message}`
      );
      return false;
    } finally {
      setGuardandoNuevo(false);
    }
  };

  // MODIFICAR ESTADO (updateDoc): Cambia entre Pendiente y Completado
  const handleToggleEstado = async (ejercicio) => {
    setProcesandoId(ejercicio.id);
    setFeedback(null);
    try {
      const nuevoEstado = await cambiarEstadoEjercicio(
        ejercicio.id,
        ejercicio.estado
      );
      setEjercicios((prev) =>
        prev.map((item) =>
          item.id === ejercicio.id ? { ...item, estado: nuevoEstado } : item
        )
      );
      mostrarFeedback(
        'success',
        `Estado de "${ejercicio.nombre}" actualizado a ${nuevoEstado} en Firestore.`
      );
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      mostrarFeedback(
        'error',
        `Error al actualizar el estado en Firestore: ${error.message}`
      );
    } finally {
      setProcesandoId(null);
    }
  };

  // MODIFICAR DATOS (updateDoc): Edita nombre, series, repeticiones, peso, día y nota
  const handleGuardarEdicion = async (id, datosActualizados) => {
    setGuardandoEdicion(true);
    setFeedback(null);
    try {
      const actualizado = await editarDatosEjercicio(id, datosActualizados);
      setEjercicios((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...actualizado } : item))
      );
      setEjercicioEnEdicion(null);
      mostrarFeedback(
        'success',
        `Los datos de "${actualizado.nombre}" se actualizaron correctamente en Firestore.`
      );
    } catch (error) {
      console.error('Error al editar ejercicio:', error);
      mostrarFeedback(
        'error',
        `No se pudieron guardar los cambios en Firestore: ${error.message}`
      );
    } finally {
      setGuardandoEdicion(false);
    }
  };

  // ELIMINAR (deleteDoc): Borra el documento de Firestore y luego actualiza la lista
  const handleEliminarEjercicio = async (ejercicio) => {
    const confirmar = window.confirm(
      `¿Estás seguro de que querés eliminar "${ejercicio.nombre}" (${ejercicio.dia}) de tu plan?`
    );
    if (!confirmar) return;

    setProcesandoId(ejercicio.id);
    setFeedback(null);
    try {
      await eliminarEjercicio(ejercicio.id);
      setEjercicios((prev) => prev.filter((item) => item.id !== ejercicio.id));
      mostrarFeedback(
        'success',
        `"${ejercicio.nombre}" fue eliminado permanentemente de Cloud Firestore.`
      );
    } catch (error) {
      console.error('Error al eliminar ejercicio:', error);
      mostrarFeedback(
        'error',
        `No se pudo eliminar el ejercicio de Firestore: ${error.message}`
      );
    } finally {
      setProcesandoId(null);
    }
  };

  // CARGAR RUTINA INICIAL DE SCANFIT
  const handleCargarRutinaBase = async () => {
    setProcesandoId('seed');
    setFeedback(null);
    try {
      const creados = await cargarRutinaInicialScanFit(usuarioAuth?.uid);
      setEjercicios(creados);
      mostrarFeedback(
        'success',
        `Se cargaron los ${creados.length} ejercicios de la rutina base de ScanFit en Cloud Firestore.`
      );
    } catch (error) {
      console.error('Error al cargar rutina base:', error);
      mostrarFeedback(
        'error',
        `No se pudo cargar la rutina sugerida en Firestore: ${error.message}`
      );
    } finally {
      setProcesandoId(null);
    }
  };

  // Filtrado por día de entrenamiento
  const ejerciciosFiltrados =
    diaSeleccionado === 'Todos'
      ? ejercicios
      : ejercicios.filter((item) => item.dia === diaSeleccionado);

  return (
    <div className="sf-app">
      <Header
        usuarioAuth={usuarioAuth}
        onRecargar={() => cargarDatosFirestore(true)}
        cargando={cargandoInicial}
      />

      <main className="sf-container sf-main">
        {!isFirebaseConfigured && (
          <div className="sf-config-warning" role="alert">
            <h3>⚠️ Configuración de Firebase pendiente (.env)</h3>
            <p>
              Para conectar la aplicación con tu base de datos en tiempo real, creá un
              archivo <code>.env</code> en la raíz del proyecto con tus credenciales de
              Firebase (podés guiarte con <code>.env.example</code>) y reiniciá el
              servidor con <code>npm run dev</code>.
            </p>
          </div>
        )}

        <FeedbackBanner
          feedback={feedback}
          onClose={() => setFeedback(null)}
        />

        <ProgressDashboard
          ejercicios={ejercicios}
          diaSeleccionado={diaSeleccionado}
          onSelectDia={setDiaSeleccionado}
          ejerciciosFiltrados={ejerciciosFiltrados}
        />

        <div className="sf-workspace-grid">
          <ExerciseForm
            onAgregarEjercicio={handleAgregarEjercicio}
            guardando={guardandoNuevo}
          />

          <section className="sf-exercises-section" aria-label="Listado de ejercicios">
            <ExerciseList
              ejercicios={ejerciciosFiltrados}
              diaSeleccionado={diaSeleccionado}
              cargando={cargandoInicial}
              procesandoId={procesandoId}
              onToggleEstado={handleToggleEstado}
              onAbrirEdicion={(ejercicio) => setEjercicioEnEdicion(ejercicio)}
              onEliminar={handleEliminarEjercicio}
              onCargarRutinaBase={handleCargarRutinaBase}
              totalGlobal={ejercicios.length}
            />
          </section>
        </div>
      </main>

      <footer className="sf-footer">
        <div className="sf-container sf-footer-inner">
          <p>
            <strong>ScanFit</strong> — Módulo <em>Mi Plan de Entrenamiento</em> | UADE
            — Desarrollo Frontend II (TP2)
          </p>
          <p className="sf-footer-meta">
            React + Vite + Cloud Firestore (<code>scanfit_entrenamientos</code>)
          </p>
        </div>
      </footer>

      <EditExerciseModal
        ejercicio={ejercicioEnEdicion}
        onGuardarEdicion={handleGuardarEdicion}
        onCerrar={() => setEjercicioEnEdicion(null)}
        guardando={guardandoEdicion}
      />
    </div>
  );
}

export default App;
