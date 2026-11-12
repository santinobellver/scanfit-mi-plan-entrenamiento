import React, { useState } from 'react';

const OBJETIVOS_OPCIONES = [
  {
    id: 'Resistencia',
    titulo: 'Resistencia',
    descripcion: 'Mejorar la capacidad aeróbica, energía sostenida y tonificación con series de 15 a 20 repeticiones.',
    icono: '⚡',
  },
  {
    id: 'Ganar músculo (Hipertrofia)',
    titulo: 'Ganar músculo (Hipertrofia)',
    descripcion: 'Aumentar masa muscular y fuerza en máquinas guiadas con series de 8 a 12 repeticiones y sobrecarga.',
    icono: '💪',
  },
  {
    id: 'Bajar de peso (Déficit)',
    titulo: 'Bajar de peso (Déficit)',
    descripcion: 'Maximizar el gasto calórico combinando ejercicios multiarticulares y bloques metabólicos dinámicos.',
    icono: '🔥',
  },
];

const FRECUENCIA_OPCIONES = [
  { dias: 1, etiqueta: '1 día por semana', detalle: 'Cuerpo completo integral' },
  { dias: 2, etiqueta: '2 días por semana', detalle: 'División Torso / Piernas' },
  { dias: 3, etiqueta: '3 días por semana', detalle: 'Empuje / Tirón / Piernas' },
  { dias: 4, etiqueta: '4 días por semana', detalle: 'Torso A-B / Piernas A-B' },
  { dias: 5, etiqueta: '5 días por semana', detalle: 'Frecuencia alta balanceada' },
  { dias: 6, etiqueta: '6 días por semana', detalle: 'Rutina avanzada completa' },
];

const GENERO_OPCIONES = ['Masculino', 'Femenino', 'Otro'];

const OnboardingQuestionnaire = ({ initialProfile, onSubmit, onCancel, isSubmitting }) => {
  const [genero, setGenero] = useState(initialProfile?.genero || '');
  const [pesoKg, setPesoKg] = useState(initialProfile?.pesoKg || '');
  const [edad, setEdad] = useState(initialProfile?.edad || '');
  const [alturaCm, setAlturaCm] = useState(initialProfile?.alturaCm || '');
  const [objetivo, setObjetivo] = useState(initialProfile?.objetivo || '');
  const [frecuenciaDias, setFrecuenciaDias] = useState(initialProfile?.frecuenciaDias || null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const pesoNum = Number(pesoKg);
    const edadNum = Number(edad);
    const alturaNum = Number(alturaCm);

    if (!genero) {
      setErrorMsg('Por favor seleccioná tu género para adecuar las cargas iniciales.');
      return;
    }
    if (!pesoKg || Number.isNaN(pesoNum) || pesoNum < 30 || pesoNum > 250) {
      setErrorMsg('Ingresá un peso válido entre 30 kg y 250 kg.');
      return;
    }
    if (!edad || Number.isNaN(edadNum) || edadNum < 12 || edadNum > 100) {
      setErrorMsg('Ingresá una edad válida entre 12 y 100 años.');
      return;
    }
    if (!alturaCm || Number.isNaN(alturaNum) || alturaNum < 110 || alturaNum > 230) {
      setErrorMsg('Ingresá una altura válida entre 110 cm y 230 cm.');
      return;
    }
    if (!objetivo) {
      setErrorMsg('Seleccioná 1 de los 3 objetivos disponibles.');
      return;
    }
    if (!frecuenciaDias) {
      setErrorMsg('Seleccioná cuántos días por semana vas a entrenar (de 1 a 6 días).');
      return;
    }

    onSubmit({
      genero,
      pesoKg: pesoNum,
      edad: edadNum,
      alturaCm: alturaNum,
      objetivo,
      frecuenciaDias: Number(frecuenciaDias),
    });
  };

  return (
    <section className="sf-onboarding-wrapper" aria-labelledby="onboarding-title">
      <div className="sf-onboarding-card">
        <div className="sf-onboarding-header">
          <span className="sf-onboarding-kicker">EVALUACIÓN INICIAL PERSONALIZADA</span>
          <h2 id="onboarding-title" className="sf-onboarding-title">
            Diseñemos tu Plan de Entrenamiento a Medida
          </h2>
          <p className="sf-onboarding-description">
            Respondé estas breves preguntas sobre tu perfil físico, tu objetivo y tu disponibilidad semanal para que ScanFit arme automáticamente la rutina ideal para vos.
          </p>
        </div>

        {errorMsg && (
          <div className="sf-onboarding-alert" role="alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="sf-onboarding-form" noValidate>
          {/* 1. Género */}
          <div className="sf-question-block">
            <label className="sf-question-label">
              1. ¿Cuál es tu género? <span className="sf-single-choice-hint">(Seleccioná 1 opción)</span>
            </label>
            <div className="sf-gender-grid" role="radiogroup" aria-label="Género">
              {GENERO_OPCIONES.map((opcion) => {
                const activo = genero === opcion;
                return (
                  <button
                    key={opcion}
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    className={`sf-choice-pill ${activo ? 'is-selected' : ''}`}
                    onClick={() => setGenero(opcion)}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2, 3 y 4. Datos biométricos: Peso (KG), Edad, Altura (CM) */}
          <div className="sf-question-block">
            <label className="sf-question-label">
              2. Tus datos físicos actuales
            </label>
            <div className="sf-biometrics-grid">
              <div className="sf-input-group">
                <label htmlFor="sf-input-peso" className="sf-field-label">
                  Peso corporal (en KG)
                </label>
                <div className="sf-input-with-unit">
                  <input
                    id="sf-input-peso"
                    type="number"
                    min="30"
                    max="250"
                    step="0.5"
                    placeholder="Ej: 72"
                    value={pesoKg}
                    onChange={(e) => setPesoKg(e.target.value)}
                    className="sf-input"
                    required
                  />
                  <span className="sf-unit-tag">KG</span>
                </div>
              </div>

              <div className="sf-input-group">
                <label htmlFor="sf-input-edad" className="sf-field-label">
                  Edad (en años)
                </label>
                <div className="sf-input-with-unit">
                  <input
                    id="sf-input-edad"
                    type="number"
                    min="12"
                    max="100"
                    placeholder="Ej: 22"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="sf-input"
                    required
                  />
                  <span className="sf-unit-tag">AÑOS</span>
                </div>
              </div>

              <div className="sf-input-group">
                <label htmlFor="sf-input-altura" className="sf-field-label">
                  Altura (en CM)
                </label>
                <div className="sf-input-with-unit">
                  <input
                    id="sf-input-altura"
                    type="number"
                    min="110"
                    max="230"
                    placeholder="Ej: 175"
                    value={alturaCm}
                    onChange={(e) => setAlturaCm(e.target.value)}
                    className="sf-input"
                    required
                  />
                  <span className="sf-unit-tag">CM</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Objetivo principal (Selección única de 3 opciones) */}
          <div className="sf-question-block">
            <label className="sf-question-label">
              3. ¿Qué buscás lograr con tu entrenamiento?{' '}
              <span className="sf-single-choice-hint">(Seleccioná solo 1 de las 3 opciones)</span>
            </label>
            <div className="sf-objectives-grid" role="radiogroup" aria-label="Objetivo de entrenamiento">
              {OBJETIVOS_OPCIONES.map((item) => {
                const seleccionado = objetivo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={seleccionado}
                    className={`sf-objective-card ${seleccionado ? 'is-selected' : ''}`}
                    onClick={() => setObjetivo(item.id)}
                  >
                    <div className="sf-objective-top">
                      <span className="sf-objective-icon" aria-hidden="true">
                        {item.icono}
                      </span>
                      <span className="sf-radio-indicator" aria-hidden="true" />
                    </div>
                    <h3 className="sf-objective-title">{item.titulo}</h3>
                    <p className="sf-objective-desc">{item.descripcion}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Frecuencia semanal (Selección única de 1 a 6 días) */}
          <div className="sf-question-block">
            <label className="sf-question-label">
              4. ¿Con qué frecuencia entrenarías cada semana?{' '}
              <span className="sf-single-choice-hint">(Seleccioná solo 1 opción de 1 a 6 días)</span>
            </label>
            <div className="sf-frequency-grid" role="radiogroup" aria-label="Frecuencia de entrenamiento semanal">
              {FRECUENCIA_OPCIONES.map((item) => {
                const seleccionado = Number(frecuenciaDias) === item.dias;
                return (
                  <button
                    key={item.dias}
                    type="button"
                    role="radio"
                    aria-checked={seleccionado}
                    className={`sf-frequency-card ${seleccionado ? 'is-selected' : ''}`}
                    onClick={() => setFrecuenciaDias(item.dias)}
                  >
                    <span className="sf-frequency-number">{item.etiqueta}</span>
                    <span className="sf-frequency-detail">{item.detalle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sf-onboarding-actions">
            {onCancel && (
              <button
                type="button"
                className="sf-btn sf-btn-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Volver a mi rutina actual
              </button>
            )}
            <button
              type="submit"
              className="sf-btn sf-btn-primary sf-btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Generando tu plan personalizado...'
                : 'Generar Mi Plan de Entrenamiento'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default OnboardingQuestionnaire;
