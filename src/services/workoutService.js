import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const WORKOUTS_COLLECTION = 'scanfit_entrenamientos';
const PROFILES_COLLECTION = 'scanfit_perfiles';
const LOCAL_PROFILE_KEY = 'scanfit_v2_user_profile';
const LOCAL_WORKOUTS_KEY = 'scanfit_v2_workouts_backup';

/**
 * Catálogo base de ejercicios en máquinas guiadas de gimnasio para ScanFit.
 * Se adapta dinámicamente según el objetivo, peso corporal, edad, género y frecuencia semanal.
 */
const CATALOGO_MAQUINAS = {
  empuje: [
    {
      nombre: 'Press de Pecho en Máquina Convergente',
      maquina: 'Máquina Chest Press #04',
      grupoMuscular: 'Pecho',
      factorPeso: 0.45,
      instruccionBase: 'Ajustá el asiento para que los agarres queden a la altura media del pecho y empujá sin bloquear los codos.',
    },
    {
      nombre: 'Press de Hombros en Máquina Guiada',
      maquina: 'Máquina Shoulder Press #08',
      grupoMuscular: 'Hombros',
      factorPeso: 0.3,
      instruccionBase: 'Mantené la espalda apoyada contra el respaldo y subí de forma controlada.',
    },
    {
      nombre: 'Aperturas Pectorales en Peck Deck',
      maquina: 'Máquina Contractora #05',
      grupoMuscular: 'Pecho',
      factorPeso: 0.35,
      instruccionBase: 'Juntá los brazos al frente sintiendo la contracción pectoral con los codos levemente flexionados.',
    },
    {
      nombre: 'Extensión de Tríceps en Polea Alta',
      maquina: 'Torre de Poleas #02 (Cuerda)',
      grupoMuscular: 'Brazos',
      factorPeso: 0.25,
      instruccionBase: 'Dejá los codos fijos al costado del torso y extendé los antebrazos hacia abajo.',
    },
  ],
  tiron: [
    {
      nombre: 'Jalón al Pecho en Polea Alta',
      maquina: 'Máquina Lat Pulldown #01',
      grupoMuscular: 'Espalda',
      factorPeso: 0.5,
      instruccionBase: 'Llevá la barra hacia la parte superior del pecho inclinando levemente el torso hacia atrás.',
    },
    {
      nombre: 'Remo Sentado en Máquina con Apoyo',
      maquina: 'Máquina Seated Row #03',
      grupoMuscular: 'Espalda',
      factorPeso: 0.48,
      instruccionBase: 'Traccioná llevando los codos hacia atrás y juntando las escápulas al final del recorrido.',
    },
    {
      nombre: 'Curl de Bíceps en Banco Scott Guiado',
      maquina: 'Máquina Biceps Curl #11',
      grupoMuscular: 'Brazos',
      factorPeso: 0.25,
      instruccionBase: 'Apoyá bien los brazos en la almohadilla y subí sin despegar los codos.',
    },
    {
      nombre: 'Face Pull / Deltoides Posterior en Máquina',
      maquina: 'Máquina Rear Delt #06',
      grupoMuscular: 'Hombros',
      factorPeso: 0.28,
      instruccionBase: 'Abrí los brazos hacia atrás manteniendo los hombros bajos y relajados.',
    },
  ],
  piernas: [
    {
      nombre: 'Prensa de Piernas Inclinada 45°',
      maquina: 'Prensa Guiada #10',
      grupoMuscular: 'Piernas',
      factorPeso: 1.1,
      instruccionBase: 'Colocá los pies al ancho de hombros en la plataforma y bajá hasta formar 90 grados en las rodillas.',
    },
    {
      nombre: 'Extensión de Cuádriceps en Sillón',
      maquina: 'Sillón de Cuádriceps #12',
      grupoMuscular: 'Piernas',
      factorPeso: 0.45,
      instruccionBase: 'Alineá tu rodilla con el eje de giro de la máquina y sostené 1 segundo arriba.',
    },
    {
      nombre: 'Camilla de Isquiotibiales Acostado',
      maquina: 'Camilla Femoral #14',
      grupoMuscular: 'Piernas',
      factorPeso: 0.38,
      instruccionBase: 'Flexioná las piernas acercando el rodillo a los glúteos sin arquear la cintura.',
    },
    {
      nombre: 'Elevación de Gemelos en Máquina',
      maquina: 'Máquina Calf Raise #15',
      grupoMuscular: 'Piernas',
      factorPeso: 0.6,
      instruccionBase: 'Realizá el recorrido completo subiendo en puntas de pie y bajando los talones con control.',
    },
  ],
  coreCardio: [
    {
      nombre: 'Crunch Abdominal en Máquina Guiada',
      maquina: 'Máquina Abdominal #18',
      grupoMuscular: 'Core',
      factorPeso: 0.35,
      instruccionBase: 'Contraé el abdomen exhalando el aire al bajar el torso suavemente.',
    },
    {
      nombre: 'Cinta / Elíptico por Intervalos Guiados',
      maquina: 'Sector Cardio #20',
      grupoMuscular: 'Cardio',
      factorPeso: 0,
      instruccionBase: 'Alterná 2 minutos a ritmo moderado con 1 minuto a ritmo ágil manteniendo postura erguida.',
    },
  ],
};

/**
 * Calcula los parámetros de series, repeticiones, descanso y ajuste de carga según el objetivo elegido.
 */
const obtenerParametrosPorObjetivo = (objetivo) => {
  if (objetivo === 'Resistencia') {
    return {
      series: 3,
      repeticiones: '15 a 20 reps',
      descansoSeg: 45,
      multiplicadorCarga: 0.72,
      enfoqueNota: 'Enfoque Resistencia: ritmo fluido y pausas breves de 45s.',
    };
  }
  if (objetivo === 'Bajar de peso (Déficit)') {
    return {
      series: 4,
      repeticiones: '12 a 15 reps',
      descansoSeg: 50,
      multiplicadorCarga: 0.82,
      enfoqueNota: 'Enfoque Déficit Calórico: cadencia dinámica para maximizar el gasto energético.',
    };
  }
  // Por defecto: Ganar músculo (Hipertrofia)
  return {
    series: 4,
    repeticiones: '8 a 12 reps',
    descansoSeg: 90,
    multiplicadorCarga: 1.0,
    enfoqueNota: 'Enfoque Hipertrofia: controlá 2 segundos la bajada y buscá cercanía al fallo técnico.',
  };
};

/**
 * Calcula un peso inicial orientativo en KG en función del peso corporal, género, edad y objetivo.
 */
const calcularPesoSugerido = (factorBase, perfil, multiplicadorCarga) => {
  if (factorBase === 0) return 0;
  const pesoUsuario = Number(perfil.pesoKg) || 70;
  const edadUsuario = Number(perfil.edad) || 25;

  let factorGenero = 1.0;
  if (perfil.genero === 'Femenino') factorGenero = 0.78;
  else if (perfil.genero === 'Otro') factorGenero = 0.88;

  let factorEdad = 1.0;
  if (edadUsuario < 18 || edadUsuario > 55) factorEdad = 0.85;
  else if (edadUsuario > 40) factorEdad = 0.92;

  const pesoBruto = pesoUsuario * factorBase * factorGenero * factorEdad * multiplicadorCarga;
  // Redondear a múltiplos de 2.5 kg para que coincida con las placas reales del gimnasio
  const redondeado = Math.max(5, Math.round(pesoBruto / 2.5) * 2.5);
  return redondeado;
};

/**
 * Arma la distribución semanal exacta de 1 a 6 días según la respuesta del usuario.
 */
export const generarPlanSegunEncuesta = (perfil) => {
  const diasFrecuencia = Number(perfil.frecuenciaDias) || 3;
  const params = obtenerParametrosPorObjetivo(perfil.objetivo);

  const plantillasPorFrecuencia = {
    1: [
      {
        dia: 'Día 1',
        foco: 'Cuerpo Completo Integral',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[0],
          CATALOGO_MAQUINAS.empuje[0],
          CATALOGO_MAQUINAS.tiron[0],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.piernas[2],
          CATALOGO_MAQUINAS.coreCardio[0],
        ],
      },
    ],
    2: [
      {
        dia: 'Día 1',
        foco: 'Tren Superior y Core',
        seleccion: [
          CATALOGO_MAQUINAS.empuje[0],
          CATALOGO_MAQUINAS.tiron[0],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.tiron[1],
          CATALOGO_MAQUINAS.coreCardio[0],
        ],
      },
      {
        dia: 'Día 2',
        foco: 'Tren Inferior y Acondicionamiento',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[0],
          CATALOGO_MAQUINAS.piernas[1],
          CATALOGO_MAQUINAS.piernas[2],
          CATALOGO_MAQUINAS.piernas[3],
          CATALOGO_MAQUINAS.coreCardio[1],
        ],
      },
    ],
    3: [
      {
        dia: 'Día 1',
        foco: 'Empuje (Pecho, Hombros y Tríceps)',
        seleccion: [
          CATALOGO_MAQUINAS.empuje[0],
          CATALOGO_MAQUINAS.empuje[2],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.empuje[3],
        ],
      },
      {
        dia: 'Día 2',
        foco: 'Tirón (Espalda, Deltoides Posterior y Bíceps)',
        seleccion: [
          CATALOGO_MAQUINAS.tiron[0],
          CATALOGO_MAQUINAS.tiron[1],
          CATALOGO_MAQUINAS.tiron[3],
          CATALOGO_MAQUINAS.tiron[2],
        ],
      },
      {
        dia: 'Día 3',
        foco: 'Piernas Completas y Zona Media',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[0],
          CATALOGO_MAQUINAS.piernas[1],
          CATALOGO_MAQUINAS.piernas[2],
          CATALOGO_MAQUINAS.coreCardio[0],
        ],
      },
    ],
    4: [
      {
        dia: 'Día 1',
        foco: 'Torso A (Pecho y Espalda Principal)',
        seleccion: [
          CATALOGO_MAQUINAS.empuje[0],
          CATALOGO_MAQUINAS.tiron[0],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.tiron[2],
        ],
      },
      {
        dia: 'Día 2',
        foco: 'Piernas A (Foco Cuádriceps y Core)',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[0],
          CATALOGO_MAQUINAS.piernas[1],
          CATALOGO_MAQUINAS.piernas[3],
          CATALOGO_MAQUINAS.coreCardio[0],
        ],
      },
      {
        dia: 'Día 3',
        foco: 'Torso B (Hombros, Espalda Media y Tríceps)',
        seleccion: [
          CATALOGO_MAQUINAS.tiron[1],
          CATALOGO_MAQUINAS.empuje[2],
          CATALOGO_MAQUINAS.tiron[3],
          CATALOGO_MAQUINAS.empuje[3],
        ],
      },
      {
        dia: 'Día 4',
        foco: 'Piernas B (Foco Posterior y Metabólico)',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[2],
          CATALOGO_MAQUINAS.piernas[0],
          CATALOGO_MAQUINAS.coreCardio[0],
          CATALOGO_MAQUINAS.coreCardio[1],
        ],
      },
    ],
    5: [
      {
        dia: 'Día 1',
        foco: 'Empuje (Pecho, Hombros y Tríceps)',
        seleccion: [
          CATALOGO_MAQUINAS.empuje[0],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.empuje[2],
          CATALOGO_MAQUINAS.empuje[3],
        ],
      },
      {
        dia: 'Día 2',
        foco: 'Tirón (Espalda y Bíceps)',
        seleccion: [
          CATALOGO_MAQUINAS.tiron[0],
          CATALOGO_MAQUINAS.tiron[1],
          CATALOGO_MAQUINAS.tiron[3],
          CATALOGO_MAQUINAS.tiron[2],
        ],
      },
      {
        dia: 'Día 3',
        foco: 'Piernas Integral',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[0],
          CATALOGO_MAQUINAS.piernas[1],
          CATALOGO_MAQUINAS.piernas[2],
          CATALOGO_MAQUINAS.piernas[3],
        ],
      },
      {
        dia: 'Día 4',
        foco: 'Torso Complementario y Postura',
        seleccion: [
          CATALOGO_MAQUINAS.empuje[0],
          CATALOGO_MAQUINAS.tiron[1],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.coreCardio[0],
        ],
      },
      {
        dia: 'Día 5',
        foco: 'Tren Inferior y Acondicionamiento Activo',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[1],
          CATALOGO_MAQUINAS.piernas[2],
          CATALOGO_MAQUINAS.coreCardio[0],
          CATALOGO_MAQUINAS.coreCardio[1],
        ],
      },
    ],
    6: [
      {
        dia: 'Día 1',
        foco: 'Empuje A (Fuerza Pectoral y Hombro)',
        seleccion: [
          CATALOGO_MAQUINAS.empuje[0],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.empuje[3],
        ],
      },
      {
        dia: 'Día 2',
        foco: 'Tirón A (Amplitud Dorsal y Bíceps)',
        seleccion: [
          CATALOGO_MAQUINAS.tiron[0],
          CATALOGO_MAQUINAS.tiron[1],
          CATALOGO_MAQUINAS.tiron[2],
        ],
      },
      {
        dia: 'Día 3',
        foco: 'Piernas A (Dominante de Rodilla)',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[0],
          CATALOGO_MAQUINAS.piernas[1],
          CATALOGO_MAQUINAS.piernas[3],
        ],
      },
      {
        dia: 'Día 4',
        foco: 'Empuje B (Control y Aislamiento)',
        seleccion: [
          CATALOGO_MAQUINAS.empuje[2],
          CATALOGO_MAQUINAS.empuje[1],
          CATALOGO_MAQUINAS.empuje[3],
        ],
      },
      {
        dia: 'Día 5',
        foco: 'Tirón B (Densidad de Espalda y Postura)',
        seleccion: [
          CATALOGO_MAQUINAS.tiron[1],
          CATALOGO_MAQUINAS.tiron[3],
          CATALOGO_MAQUINAS.tiron[2],
        ],
      },
      {
        dia: 'Día 6',
        foco: 'Piernas B, Zona Media y Cardio',
        seleccion: [
          CATALOGO_MAQUINAS.piernas[2],
          CATALOGO_MAQUINAS.coreCardio[0],
          CATALOGO_MAQUINAS.coreCardio[1],
        ],
      },
    ],
  };

  const diasPlan = plantillasPorFrecuencia[diasFrecuencia] || plantillasPorFrecuencia[3];
  const ejerciciosGenerados = [];

  diasPlan.forEach((bloqueDia) => {
    const listaBase = [...bloqueDia.seleccion];
    // Si el objetivo es Bajar de peso o Resistencia y el día no incluye cardio, sumamos el bloque metabólico final
    if (
      (perfil.objetivo === 'Bajar de peso (Déficit)' || perfil.objetivo === 'Resistencia') &&
      !listaBase.some((item) => item.grupoMuscular === 'Cardio')
    ) {
      listaBase.push(CATALOGO_MAQUINAS.coreCardio[1]);
    }

    listaBase.forEach((item, index) => {
      const pesoSugerido = calcularPesoSugerido(
        item.factorPeso,
        perfil,
        params.multiplicadorCarga
      );

      ejerciciosGenerados.push({
        nombre: item.nombre,
        maquina: item.maquina,
        grupoMuscular: item.grupoMuscular,
        dia: bloqueDia.dia,
        focoDia: bloqueDia.foco,
        series: item.grupoMuscular === 'Cardio' ? 1 : params.series,
        repeticiones: item.grupoMuscular === 'Cardio' ? '15 minutos' : params.repeticiones,
        pesoKg: pesoSugerido,
        descansoSeg: item.grupoMuscular === 'Cardio' ? 30 : params.descansoSeg,
        notas: `${item.instruccionBase} (${params.enfoqueNota})`,
        estado: 'Pendiente',
        orden: index + 1,
      });
    });
  });

  return ejerciciosGenerados;
};

/**
 * Obtiene el perfil del cuestionario inicial del usuario.
 */
export const fetchUserProfile = async (uid) => {
  const localRaw = localStorage.getItem(`${LOCAL_PROFILE_KEY}_${uid}`) || localStorage.getItem(LOCAL_PROFILE_KEY);
  const localProfile = localRaw ? JSON.parse(localRaw) : null;

  if (db && uid) {
    try {
      const docRef = doc(db, PROFILES_COLLECTION, uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        localStorage.setItem(`${LOCAL_PROFILE_KEY}_${uid}`, JSON.stringify(data));
        return data;
      }
    } catch {
      // Si las reglas de scanfit_perfiles aún no fueron actualizadas en la consola, usamos el respaldo local sin mostrar errores técnicos
    }
  }

  return localProfile;
};

/**
 * Guarda las respuestas de la encuesta inicial y reemplaza cualquier rutina previa por el nuevo plan personalizado.
 */
export const saveProfileAndGenerateRoutine = async (uid, datosEncuesta) => {
  const ahora = new Date().toISOString();
  const perfilCompleto = {
    uid,
    genero: datosEncuesta.genero,
    pesoKg: Number(datosEncuesta.pesoKg),
    edad: Number(datosEncuesta.edad),
    alturaCm: Number(datosEncuesta.alturaCm),
    objetivo: datosEncuesta.objetivo,
    frecuenciaDias: Number(datosEncuesta.frecuenciaDias),
    encuestaCompletada: true,
    actualizadoEn: ahora,
  };

  localStorage.setItem(`${LOCAL_PROFILE_KEY}_${uid}`, JSON.stringify(perfilCompleto));
  localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(perfilCompleto));

  if (db && uid) {
    try {
      await setDoc(doc(db, PROFILES_COLLECTION, uid), perfilCompleto, { merge: true });
    } catch {
      // Continúa aunque la colección scanfit_perfiles no esté en las reglas antiguas
    }
  }

  const nuevosEjercicios = generarPlanSegunEncuesta(perfilCompleto);

  if (db && uid) {
    // 1. Limpiar ejercicios anteriores del usuario en la base de datos para no mezclar rutinas viejas
    const q = query(collection(db, WORKOUTS_COLLECTION), where('uid', '==', uid));
    const existentes = await getDocs(q);
    const promesasBorrado = existentes.docs.map((documento) =>
      deleteDoc(doc(db, WORKOUTS_COLLECTION, documento.id))
    );
    await Promise.all(promesasBorrado);

    // 2. Insertar cada ejercicio generado por la encuesta en la colección principal
    const creados = [];
    for (const ejercicio of nuevosEjercicios) {
      const payload = {
        ...ejercicio,
        uid,
        creadoEn: ahora,
        actualizadoEn: ahora,
      };
      const ref = await addDoc(collection(db, WORKOUTS_COLLECTION), payload);
      creados.push({ id: ref.id, ...payload });
    }

    localStorage.setItem(LOCAL_WORKOUTS_KEY, JSON.stringify(creados));
    return { perfil: perfilCompleto, ejercicios: creados };
  }

  const locales = nuevosEjercicios.map((ej, idx) => ({
    ...ej,
    id: `local-${Date.now()}-${idx}`,
    uid,
    creadoEn: ahora,
    actualizadoEn: ahora,
  }));
  localStorage.setItem(LOCAL_WORKOUTS_KEY, JSON.stringify(locales));
  return { perfil: perfilCompleto, ejercicios: locales };
};

/**
 * Consultar ejercicios del plan del usuario (READ - getDocs).
 * En la Versión 2 NO precarga ninguna rutina por defecto si el usuario no completó la encuesta.
 */
export const fetchExercises = async (uid) => {
  if (db && uid) {
    const q = query(collection(db, WORKOUTS_COLLECTION), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data(),
    }));

    return items.sort((a, b) => {
      if (a.dia !== b.dia) return (a.dia || '').localeCompare(b.dia || '');
      return (a.orden || 99) - (b.orden || 99);
    });
  }

  const raw = localStorage.getItem(LOCAL_WORKOUTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

/**
 * Agregar un nuevo ejercicio manual al plan (CREATE - addDoc).
 */
export const createExercise = async (uid, exerciseData) => {
  const ahora = new Date().toISOString();
  const nuevoEjercicio = {
    uid,
    nombre: exerciseData.nombre.trim(),
    maquina: exerciseData.maquina.trim(),
    grupoMuscular: exerciseData.grupoMuscular,
    dia: exerciseData.dia,
    series: Number(exerciseData.series),
    repeticiones: String(exerciseData.repeticiones).trim(),
    pesoKg: Number(exerciseData.pesoKg),
    descansoSeg: Number(exerciseData.descansoSeg || 60),
    notas: (exerciseData.notas || '').trim(),
    estado: 'Pendiente',
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  if (db && uid) {
    const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), nuevoEjercicio);
    return { id: docRef.id, ...nuevoEjercicio };
  }

  const creadoLocal = { id: `local-${Date.now()}`, ...nuevoEjercicio };
  const actuales = await fetchExercises(uid);
  const actualizados = [...actuales, creadoLocal];
  localStorage.setItem(LOCAL_WORKOUTS_KEY, JSON.stringify(actualizados));
  return creadoLocal;
};

/**
 * Actualizar un ejercicio existente o su estado Pendiente/Completado (UPDATE - updateDoc).
 */
export const updateExercise = async (uid, exerciseId, updatedFields) => {
  const ahora = new Date().toISOString();
  const payload = {
    ...updatedFields,
    uid,
    actualizadoEn: ahora,
  };

  if (db && uid && !String(exerciseId).startsWith('local-')) {
    const docRef = doc(db, WORKOUTS_COLLECTION, exerciseId);
    await updateDoc(docRef, payload);
    return { id: exerciseId, ...payload };
  }

  const actuales = await fetchExercises(uid);
  const actualizados = actuales.map((item) =>
    item.id === exerciseId ? { ...item, ...payload } : item
  );
  localStorage.setItem(LOCAL_WORKOUTS_KEY, JSON.stringify(actualizados));
  return { id: exerciseId, ...payload };
};

/**
 * Eliminar un ejercicio del plan (DELETE - deleteDoc).
 */
export const removeExercise = async (uid, exerciseId) => {
  if (db && uid && !String(exerciseId).startsWith('local-')) {
    const docRef = doc(db, WORKOUTS_COLLECTION, exerciseId);
    await deleteDoc(docRef);
    return true;
  }

  const actuales = await fetchExercises(uid);
  const filtrados = actuales.filter((item) => item.id !== exerciseId);
  localStorage.setItem(LOCAL_WORKOUTS_KEY, JSON.stringify(filtrados));
  return true;
};
