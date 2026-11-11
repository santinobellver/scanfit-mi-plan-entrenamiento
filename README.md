# ScanFit — Mi Plan de Entrenamiento

---

## 1. Sobre el Proyecto

**ScanFit** nació como un proyecto de investigación y prototipado en *Diseño de Interacción I* orientado a acompañar a usuarios principiantes e intermedios en el gimnasio que suelen sentirse desorientados con sus rutinas y el uso de las máquinas.

Siguiendo la consigna de desarrollar una propuesta acotada, enfocada y 100% funcional con persistencia real en la nube, esta aplicación implementa el módulo central **"Mi Plan de Entrenamiento"**. Permite gestionar de forma integral la rutina semanal del usuario mediante un flujo **CRUD completo en Cloud Firestore** sobre la colección `scanfit_entrenamientos`.

### Funcionalidades Principales
- **Consultar:** Visualización de los ejercicios y máquinas asignados a la rutina, filtrado dinámico por día de entrenamiento (*Todos*, *Día 1: Pecho y Tríceps*, *Día 2: Pierna y Hombro*, *Día 3: Espalda y Bíceps*, *Día 4: Pierna y Hombro*), panel de estadísticas y barra de progreso en tiempo real. Incluye además la opción de cargar la rutina base de 4 días de ScanFit con un clic cuando la base está vacía.
- **Agregar:** Formulario con validaciones de campos obligatorios y valores numéricos para registrar nuevos ejercicios o máquinas (nombre del ejercicio/máquina, día asignado, grupo muscular, series, repeticiones, peso en kg y nota técnica opcional).
- **Modificar:**
  - Cambio rápido de estado entre **Pendiente** y **Completado** con un clic.
  - Edición completa de los datos de cualquier ejercicio (nombre, día, grupo muscular, series, repeticiones, peso en kg y nota técnica) a través de un modal de edición validado.
- **Eliminar:** Borrado de ejercicios con confirmación y actualización inmediata tras confirmarse la operación en Firestore.
- **Experiencia de Uso y Seguridad:** Autenticación anónima automática, estados de carga, alertas claras de éxito o error real ante cada operación y diseño *responsive* adaptable a dispositivos móviles y escritorio.

---

## 2. Identidad Visual de ScanFit

- **Verde Principal:** `#7DAD3D`
- **Azul Oscuro:** `#141B34`
- **Gris:** `#324651`
- **Blanco:** `#FFFFFF`
- **Tipografía:** `Montserrat` (Google Fonts — pesos 400, 600, 700 y 800).

---

## 3. Estructura del Proyecto (100% JavaScript)

```text
scanfit-mi-plan-entrenamiento/
├── public/
│   └── scanfit-icon.svg
├── src/
│   ├── components/
│   │   ├── EditExerciseModal.jsx   # Modal para editar datos de un ejercicio (updateDoc)
│   │   ├── ExerciseCard.jsx        # Tarjeta individual con toggle de estado, edición y borrado
│   │   ├── ExerciseForm.jsx        # Formulario validado para alta de ejercicios (addDoc)
│   │   ├── ExerciseList.jsx        # Listado filtrado por día y estado vacío
│   │   ├── FeedbackBanner.jsx      # Mensajes de éxito, error y estado de conexión
│   │   ├── Header.jsx              # Encabezado con identidad ScanFit y estado Auth
│   │   └── ProgressDashboard.jsx   # Progreso de la rutina y filtros por día
│   ├── firebase/
│   │   └── config.js               # Inicialización de Firebase, Firestore y Auth Anónimo
│   ├── services/
│   │   └── workoutService.js       # Operaciones CRUD contra 'scanfit_entrenamientos'
│   ├── App.css                     # Estilos responsive con la paleta oficial de ScanFit
│   ├── App.jsx                     # Componente principal y coordinación de estado
│   ├── index.css                   # Variables CSS globales y reset tipográfico (Montserrat)
│   └── main.jsx                    # Punto de entrada de React
├── .env.example                    # Plantilla de variables de entorno
├── .gitignore                      # Archivos excluidos de Git (.env, node_modules, dist)
├── firestore.rules                 # Reglas de seguridad para Cloud Firestore
├── index.html                      # HTML base con Google Fonts (Montserrat)
├── package.json                    # Dependencias y scripts de Vite
└── vite.config.js                  # Configuración de Vite
```

---