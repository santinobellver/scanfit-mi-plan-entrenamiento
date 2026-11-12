import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ensureUserSession } from './firebase/config';
import {
  fetchUserProfile,
  fetchExercises,
  saveProfileAndGenerateRoutine,
  createExercise,
  updateExercise,
  removeExercise,
} from './services/workoutService';
import Header from './components/Header';
import OnboardingQuestionnaire from './components/OnboardingQuestionnaire';
import ProgressDashboard from './components/ProgressDashboard';
import ExerciseForm from './components/ExerciseForm';
import ExerciseList from './components/ExerciseList';
import EditExerciseModal from './components/EditExerciseModal';
import FeedbackBanner from './components/FeedbackBanner';
import './App.css';

function App() {
  // Tema visual: por defecto Modo Claro o el elegido previamente por el usuario
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('scanfit_theme_mode') || 'dark';
  });

  const [uid, setUid] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const [activeDay, setActiveDay] = useState('Día 1');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [editingExercise, setEditingExercise] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('scanfit_theme_mode', theme);
  }, [theme]);

  const showNotice = useCallback((message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => {
      setFeedback((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  useEffect(() => {
    let mounted = true;

    const inicializarApp = async () => {
      setLoading(true);
      try {
        const user = await ensureUserSession();
        if (!mounted) return;
        setUid(user.uid);

        const perfilGuardado = await fetchUserProfile(user.uid);
        if (!mounted) return;

        // Si el usuario todavía no completó la encuesta de la Versión 2, mostramos únicamente el cuestionario sin rutinas predefinidas
        if (!perfilGuardado || !perfilGuardado.encuestaCompletada) {
          setUserProfile(null);
          setExercises([]);
          setShowQuestionnaire(true);
        } else {
          setUserProfile(perfilGuardado);
          const listaEjercicios = await fetchExercises(user.uid);
          if (!mounted) return;
          setExercises(listaEjercicios);
          setShowQuestionnaire(false);
        }
      } catch {
        if (mounted) {
          setShowQuestionnaire(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    inicializarApp();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleCompleteQuestionnaire = async (datosEncuesta) => {
    if (!uid) return;
    setSubmitting(true);
    try {
      const { perfil, ejercicios } = await saveProfileAndGenerateRoutine(uid, datosEncuesta);
      setUserProfile(perfil);
      setExercises(ejercicios);
      setActiveDay('Día 1');
      setShowQuestionnaire(false);
      showNotice(
        `¡Listo! Generamos tu plan de ${perfil.frecuenciaDias} ${
          perfil.frecuenciaDias === 1 ? 'día' : 'días'
        } enfocado en ${perfil.objetivo}.`
      );
    } catch {
      showNotice('No pudimos guardar tu rutina en este momento. Intentá nuevamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExercise = async (exerciseData) => {
    if (!uid) return;
    setSubmitting(true);
    try {
      const creado = await createExercise(uid, exerciseData);
      setExercises((prev) => [...prev, creado]);
      setActiveDay(creado.dia);
      showNotice(`"${creado.nombre}" fue agregado a tu ${creado.dia}.`);
    } catch {
      showNotice('Ocurrió un inconveniente al agregar el ejercicio.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (exercise) => {
    if (!uid) return;
    const nuevoEstado = exercise.estado === 'Completado' ? 'Pendiente' : 'Completado';
    try {
      await updateExercise(uid, exercise.id, {
        ...exercise,
        estado: nuevoEstado,
      });
      setExercises((prev) =>
        prev.map((item) =>
          item.id === exercise.id ? { ...item, estado: nuevoEstado } : item
        )
      );
      showNotice(
        nuevoEstado === 'Completado'
          ? `¡Excelente! Completaste "${exercise.nombre}".`
          : `"${exercise.nombre}" volvió a estado pendiente.`
      );
    } catch {
      showNotice('No se pudo actualizar el estado del ejercicio.', 'error');
    }
  };

  const handleSaveEdit = async (exerciseId, updatedData) => {
    if (!uid) return;
    try {
      await updateExercise(uid, exerciseId, updatedData);
      setExercises((prev) =>
        prev.map((item) => (item.id === exerciseId ? { ...item, ...updatedData } : item))
      );
      setEditingExercise(null);
      showNotice('Los cambios del ejercicio se guardaron correctamente.');
    } catch {
      showNotice('No se pudieron guardar los cambios.', 'error');
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!uid) return;
    try {
      await removeExercise(uid, exerciseId);
      setExercises((prev) => prev.filter((item) => item.id !== exerciseId));
      showNotice('El ejercicio fue quitado de tu plan.');
    } catch {
      showNotice('No se pudo quitar el ejercicio.', 'error');
    }
  };

  const availableDays = useMemo(() => {
    const numDias = Number(userProfile?.frecuenciaDias) || 3;
    const diasBase = Array.from({ length: numDias }, (_, i) => `Día ${i + 1}`);
    const diasConEjercicios = exercises.map((e) => e.dia).filter(Boolean);
    return Array.from(new Set([...diasBase, ...diasConEjercicios])).sort();
  }, [userProfile, exercises]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((item) => {
      const coincideDia = activeDay === 'Todos' || item.dia === activeDay;
      const coincideEstado = statusFilter === 'Todos' || item.estado === statusFilter;
      return coincideDia && coincideEstado;
    });
  }, [exercises, activeDay, statusFilter]);

  return (
    <div className="sf-app-shell">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        userProfile={userProfile}
        onOpenQuestionnaire={() => setShowQuestionnaire(true)}
      />

      <main className="sf-main-container">
        <FeedbackBanner feedback={feedback} onClose={() => setFeedback(null)} />

        {loading ? (
          <div className="sf-loading-box">
            <div className="sf-spinner" aria-hidden="true" />
            <p>Preparando tu espacio de entrenamiento ScanFit...</p>
          </div>
        ) : showQuestionnaire || !userProfile ? (
          <OnboardingQuestionnaire
            initialProfile={userProfile}
            onSubmit={handleCompleteQuestionnaire}
            onCancel={userProfile ? () => setShowQuestionnaire(false) : null}
            isSubmitting={submitting}
          />
        ) : (
          <>
            <ProgressDashboard
              exercises={exercises}
              userProfile={userProfile}
              onOpenQuestionnaire={() => setShowQuestionnaire(true)}
            />

            <ExerciseForm
              availableDays={availableDays}
              activeDay={activeDay}
              onAddExercise={handleAddExercise}
              isSubmitting={submitting}
            />

            <ExerciseList
              exercises={filteredExercises}
              availableDays={availableDays}
              activeDay={activeDay}
              onSelectDay={setActiveDay}
              statusFilter={statusFilter}
              onSelectStatusFilter={setStatusFilter}
              onToggleStatus={handleToggleStatus}
              onEdit={setEditingExercise}
              onDelete={handleDeleteExercise}
            />
          </>
        )}
      </main>

      <EditExerciseModal
        exercise={editingExercise}
        availableDays={availableDays}
        onClose={() => setEditingExercise(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default App;
