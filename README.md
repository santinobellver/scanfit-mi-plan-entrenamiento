# ScanFit — Mi Plan de Entrenamiento

**Materia:** Desarrollo Frontend II (Código: 581373) — UADE (FADi / DETEX)  
**Trabajo Práctico 2:** Aplicación en React con IA, Firebase y despliegue en Vercel  
**Docente:** Prof. Joaquín Cerviño  

---

## 1. Sobre el Proyecto

**ScanFit** nació como un proyecto de investigación y prototipado en *Diseño de Interacción I* orientado a acompañar a usuarios principiantes e intermedios en el gimnasio que suelen sentirse desorientados con sus rutinas y el uso de las máquinas.

Siguiendo la consigna del **Trabajo Práctico 2** de desarrollar una propuesta acotada, enfocada y 100% funcional con persistencia real en la nube, esta aplicación implementa el módulo central **"Mi Plan de Entrenamiento"**. Permite gestionar de forma integral la rutina semanal del usuario mediante un flujo **CRUD completo en Cloud Firestore** sobre la colección `scanfit_entrenamientos`.

### Funcionalidades Principales
- **Consultar (`getDocs`):** Visualización de los ejercicios y máquinas asignados a la rutina, filtrado dinámico por día de entrenamiento (*Todos*, *Día 1: Pecho y Tríceps*, *Día 2: Pierna y Hombro*, *Día 3: Espalda y Bíceps*, *Día 4: Pierna y Hombro*), panel de estadísticas y barra de progreso en tiempo real. Incluye además la opción de cargar la rutina base de 4 días de ScanFit con un clic cuando la base está vacía.
- **Agregar (`addDoc`):** Formulario con validaciones de campos obligatorios y valores numéricos para registrar nuevos ejercicios o máquinas (nombre del ejercicio/máquina, día asignado, grupo muscular, series, repeticiones, peso en kg y nota técnica opcional).
- **Modificar (`updateDoc`):**
  - Cambio rápido de estado entre **Pendiente** y **Completado** con un clic.
  - Edición completa de los datos de cualquier ejercicio (nombre, día, grupo muscular, series, repeticiones, peso en kg y nota técnica) a través de un modal de edición validado.
- **Eliminar (`deleteDoc`):** Borrado de ejercicios con confirmación y actualización inmediata tras confirmarse la operación en Firestore.
- **Experiencia de Uso y Seguridad:** Autenticación anónima automática con Firebase Authentication (`signInAnonymously`), estados de carga (`loading`), alertas claras de éxito o error real ante cada operación en Firestore y diseño *responsive* adaptable a dispositivos móviles y escritorio.

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

## 4. Requisitos e Instalación Local

1. **Clonar el repositorio o descomprimir el proyecto** y abrir la carpeta en Visual Studio Code.
2. **Instalar las dependencias:**
   ```bash
   npm install
   ```
3. **Configurar las variables de entorno:**
   Crear un archivo llamado `.env` en la raíz del proyecto (junto a `package.json`) tomando como base `.env.example`:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```
4. **Configurar Firebase Console:**
   - Habilitar **Authentication → Sign-in method → Anonymous (Anónimo)**.
   - Crear la base de datos **Cloud Firestore** y publicar las reglas incluidas en el archivo `firestore.rules`.
5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
6. Abrir la URL local indicada en la terminal (por defecto `http://localhost:5173`).

---

## 5. Despliegue en Vercel

1. Subir el proyecto a un repositorio en **GitHub** (verificando que `.env` no se incluya gracias a `.gitignore`).
2. Importar el repositorio en [Vercel](https://vercel.com/).
3. Verificar que el *Framework Preset* sea **Vite**, el comando de build `npm run build` y el directorio de salida `dist`.
4. En **Settings → Environment Variables**, cargar las 4 variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`).
5. Ejecutar **Deploy** (o **Redeploy** si se agregaron variables posteriormente).
