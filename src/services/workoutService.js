import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

// Nombre único de la colección en Cloud Firestore solicitado en la consigna
export const COLLECTION_NAME = 'scanfit_entrenamientos';

// Días de entrenamiento oficiales del plan ScanFit (basados en el documento de ideación)
export const DIAS_ENTRENAMIENTO = [
  'Día 1: Pecho y Tríceps',
  'Día 2: Pierna y Hombro',
  'Día 3: Espalda y Bíceps',
  'Día 4: Pierna y Hombro',
];

// Grupos musculares disponibles en ScanFit
export const GRUPOS_MUSCULARES = [
  'Pecho',
  'Tríceps',
  'Pierna (Cuádriceps / Aductores)',
  'Pierna (Cuádriceps / Isquios)',
  'Hombro',
  'Espalda',
  'Bíceps',
  'Core / Abdominales',
];

// Rutina inicial sugerida de ScanFit (basada en la rutina de 4 días del TP de Diseño de Interacción I)
export const RUTINA_BASE_SCANFIT = [
  {
    nombre: 'Press banca (con barra)',
    dia: 'Día 1: Pecho y Tríceps',
    grupoMuscular: 'Pecho',
    series: 3,
    repeticiones: 8,
    pesoKg: 40,
    notaTecnica: 'Mantener las escápulas retraídas y apoyar los pies firmes en el suelo.',
    estado: 'Pendiente',
  },
  {
    nombre: 'Peck-Deck (máquina)',
    dia: 'Día 1: Pecho y Tríceps',
    grupoMuscular: 'Pecho',
    series: 4,
    repeticiones: 12,
    pesoKg: 35,
    notaTecnica: 'Ajustar el asiento para que los agarres queden a la altura del pecho.',
    estado: 'Pendiente',
  },
  {
    nombre: 'Extensión de tríceps (polea)',
    dia: 'Día 1: Pecho y Tríceps',
    grupoMuscular: 'Tríceps',
    series: 3,
    repeticiones: 12,
    pesoKg: 20,
    notaTecnica: 'Dejar los codos fijos pegados al torso durante todo el recorrido.',
    estado: 'Pendiente',
  },
  {
    nombre: 'Extensión de cuádriceps (máquina)',
    dia: 'Día 2: Pierna y Hombro',
    grupoMuscular: 'Pierna (Cuádriceps / Aductores)',
    series: 3,
    repeticiones: 12,
    pesoKg: 45,
    notaTecnica: 'Alinear la rodilla con el eje de giro de la máquina y controlar la bajada.',
    estado: 'Pendiente',
  },
  {
    nombre: 'Press militar (máquina)',
    dia: 'Día 2: Pierna y Hombro',
    grupoMuscular: 'Hombro',
    series: 4,
    repeticiones: 10,
    pesoKg: 25,
    notaTecnica: 'Evitar arquear la zona lumbar al empujar hacia arriba.',
    estado: 'Pendiente',
  },
  {
    nombre: 'Jalón al pecho (máquina)',
    dia: 'Día 3: Espalda y Bíceps',
    grupoMuscular: 'Espalda',
    series: 4,
    repeticiones: 10,
    pesoKg: 40,
    notaTecnica: 'Llevar la barra hacia la parte superior del pecho inclinando levemente el torso.',
    estado: 'Pendiente',
  },
  {
    nombre: 'Curl martillo (mancuernas)',
    dia: 'Día 3: Espalda y Bíceps',
    grupoMuscular: 'Bíceps',
    series: 4,
    repeticiones: 12,
    pesoKg: 10,
    notaTecnica: 'Agarre neutro sin balancear los hombros.',
    estado: 'Pendiente',
  },
  {
    nombre: 'Prensa de piernas (máquina)',
    dia: 'Día 4: Pierna y Hombro',
    grupoMuscular: 'Pierna (Cuádriceps / Isquios)',
    series: 3,
    repeticiones: 8,
    pesoKg: 80,
    notaTecnica: 'No bloquear las rodillas por completo al extender las piernas.',
    estado: 'Pendiente',
  },
];

const checkDatabaseReady = () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error(
      'Firebase no está configurado correctamente. Verificá tu archivo .env.'
    );
  }
};

/**
 * CONSULTAR (getDocs): Obtiene todos los ejercicios de la colección scanfit_entrenamientos
 */
export const obtenerEjercicios = async () => {
  checkDatabaseReady();
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);

  const lista = snapshot.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }));

  // Ordenar por día asignado y luego por fecha de creación o nombre
  return lista.sort((a, b) => {
    const indexDiaA = DIAS_ENTRENAMIENTO.indexOf(a.dia);
    const indexDiaB = DIAS_ENTRENAMIENTO.indexOf(b.dia);
    if (indexDiaA !== indexDiaB) {
      return indexDiaA - indexDiaB;
    }
    const timeA = a.creadoEn?.seconds || 0;
    const timeB = b.creadoEn?.seconds || 0;
    return timeB - timeA;
  });
};

/**
 * AGREGAR (addDoc): Registra un nuevo ejercicio o máquina en scanfit_entrenamientos
 */
export const agregarEjercicio = async (datosEjercicio, uidUsuario = null) => {
  checkDatabaseReady();
  const colRef = collection(db, COLLECTION_NAME);

  const nuevoDocumento = {
    nombre: datosEjercicio.nombre.trim(),
    dia: datosEjercicio.dia,
    grupoMuscular: datosEjercicio.grupoMuscular,
    series: Number(datosEjercicio.series),
    repeticiones: Number(datosEjercicio.repeticiones),
    pesoKg: Number(datosEjercicio.pesoKg),
    notaTecnica: datosEjercicio.notaTecnica ? datosEjercicio.notaTecnica.trim() : '',
    estado: 'Pendiente',
    uid: uidUsuario || 'anonimo',
    creadoEn: serverTimestamp(),
  };

  const docRef = await addDoc(colRef, nuevoDocumento);

  return {
    id: docRef.id,
    ...nuevoDocumento,
    creadoEn: { seconds: Math.floor(Date.now() / 1000) },
  };
};

/**
 * MODIFICAR ESTADO (updateDoc): Alterna entre 'Pendiente' y 'Completado'
 */
export const cambiarEstadoEjercicio = async (id, estadoActual) => {
  checkDatabaseReady();
  const nuevoEstado = estadoActual === 'Completado' ? 'Pendiente' : 'Completado';
  const docRef = doc(db, COLLECTION_NAME, id);

  await updateDoc(docRef, {
    estado: nuevoEstado,
    actualizadoEn: serverTimestamp(),
  });

  return nuevoEstado;
};

/**
 * MODIFICAR DATOS (updateDoc): Actualiza nombre, día, grupo muscular, series, repeticiones, peso y nota
 */
export const editarDatosEjercicio = async (id, datosActualizados) => {
  checkDatabaseReady();
  const docRef = doc(db, COLLECTION_NAME, id);

  const payload = {
    nombre: datosActualizados.nombre.trim(),
    dia: datosActualizados.dia,
    grupoMuscular: datosActualizados.grupoMuscular,
    series: Number(datosActualizados.series),
    repeticiones: Number(datosActualizados.repeticiones),
    pesoKg: Number(datosActualizados.pesoKg),
    notaTecnica: datosActualizados.notaTecnica ? datosActualizados.notaTecnica.trim() : '',
    estado: datosActualizados.estado || 'Pendiente',
    actualizadoEn: serverTimestamp(),
  };

  await updateDoc(docRef, payload);

  return {
    id,
    ...payload,
  };
};

/**
 * ELIMINAR (deleteDoc): Borra un ejercicio de scanfit_entrenamientos
 */
export const eliminarEjercicio = async (id) => {
  checkDatabaseReady();
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  return id;
};

/**
 * CARGAR RUTINA BASE (addDoc múltiple): Permite poblar la colección con la rutina sugerida de ScanFit
 */
export const cargarRutinaInicialScanFit = async (uidUsuario = null) => {
  checkDatabaseReady();
  const colRef = collection(db, COLLECTION_NAME);
  const creados = [];

  for (const item of RUTINA_BASE_SCANFIT) {
    const docData = {
      ...item,
      uid: uidUsuario || 'anonimo',
      creadoEn: serverTimestamp(),
    };
    const docRef = await addDoc(colRef, docData);
    creados.push({
      id: docRef.id,
      ...item,
      uid: uidUsuario || 'anonimo',
      creadoEn: { seconds: Math.floor(Date.now() / 1000) },
    });
  }

  return creados;
};
