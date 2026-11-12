# ScanFit — Mi Plan de Entrenamiento Personalizado (Versión 2)

Aplicación web desarrollada para **Desarrollo Frontend II** basada en el proyecto **ScanFit** (*Diseño de Interacción I*).

## Mejoras implementadas en la Versión 2

1. **Encuesta Inicial de Personalización (sin rutinas predefinidas)**:
   - Al ingresar por primera vez, la aplicación no da por sentada ninguna rutina: presenta un cuestionario breve que releva **Género**, **Peso (KG)**, **Edad**, **Altura (CM)**, **Objetivo principal** (selección única entre *Resistencia*, *Ganar músculo (Hipertrofia)* o *Bajar de peso (Déficit)*) y **Frecuencia semanal** (selección única de *1 a 6 días por semana*).
   - En base a las respuestas, genera y almacena el plan de entrenamiento adaptado al usuario.
2. **Interfaz limpia para el usuario final**:
   - Se eliminaron todos los carteles e indicadores técnicos internos (como referencias visibles a *Firebase*, *Firestore* o *Vite*), manteniendo toda la sincronización y persistencia en segundo plano.
3. **Switch de Modo Oscuro y Modo Claro**:
   - Incorporación de un interruptor en el encabezado para alternar entre **Modo Oscuro** (`#141B34` / `#324651`) y **Modo Claro**, reduciendo la fatiga visual y guardando la preferencia del usuario.
