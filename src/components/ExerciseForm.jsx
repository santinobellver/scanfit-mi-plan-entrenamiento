import React, { useState } from 'react';
import { DIAS_ENTRENAMIENTO, GRUPOS_MUSCULARES } from '../services/workoutService';

const ESTADO_INICIAL = {
  nombre: '',
  dia: DIAS_ENTRENAMIENTO[0],
  grupoMuscular: GRUPOS_MUSCULARES[0],
  series: '',
  repeticiones: '',
  pesoKg: '',
  notaTecnica: '',
};

function ExerciseForm({ onAgregarEjercicio, guardando }) {
  const [formData, setFormData] = useState(ESTADO_INICIAL);
  const [errores, setErrores] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'Ingresá el nombre del ejercicio o máquina.';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    const seriesNum = Number(formData.series);
    if (formData.series === '' || Number.isNaN(seriesNum) || !Number.isInteger(seriesNum)) {
      nuevosErrores.series = 'Ingresá un número entero de series.';
    } else if (seriesNum < 1 || seriesNum > 20) {
      nuevosErrores.series = 'Las series deben estar entre 1 y 20.';
    }

    const repsNum = Number(formData.repeticiones);
    if (
      formData.repeticiones === '' ||
      Number.isNaN(repsNum) ||
      !Number.isInteger(repsNum)
    ) {
      nuevosErrores.repeticiones = 'Ingresá un número entero de repeticiones.';
    } else if (repsNum < 1 || repsNum > 100) {
      nuevosErrores.repeticiones = 'Las repeticiones deben estar entre 1 y 100.';
    }

    const pesoNum = Number(formData.pesoKg);
    if (formData.pesoKg === '' || Number.isNaN(pesoNum)) {
      nuevosErrores.pesoKg = 'Ingresá el peso en kg (usá 0 si es peso corporal).';
    } else if (pesoNum < 0 || pesoNum > 500) {
      nuevosErrores.pesoKg = 'El peso debe estar entre 0 y 500 kg.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const exito = await onAgregarEjercicio(formData);
    if (exito) {
      setFormData((prev) => ({
        ...ESTADO_INICIAL,
        dia: prev.dia,
        grupoMuscular: prev.grupoMuscular,
      }));
      setErrores({});
    }
  };

  return (
    <aside className="sf-form-card" aria-labelledby="form-heading">
      <div className="sf-form-header">
        <span className="sf-form-tag">NUEVO REGISTRO</span>
        <h2 id="form-heading" className="sf-form-title">
          Agregar Ejercicio o Máquina
        </h2>
        <p className="sf-form-desc">
          Sumá una máquina o ejercicio a tu plan semanal en Cloud Firestore.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="sf-form">
        <div className="sf-field">
          <label htmlFor="nombre" className="sf-label">
            Nombre del ejercicio / máquina *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={`sf-input ${errores.nombre ? 'sf-input-error' : ''}`}
            placeholder="Ej: Press banca con barra / Peck-Deck"
            value={formData.nombre}
            onChange={handleChange}
            disabled={guardando}
          />
          {errores.nombre && <span className="sf-error-text">{errores.nombre}</span>}
        </div>

        <div className="sf-field">
          <label htmlFor="dia" className="sf-label">
            Día de entrenamiento asignado *
          </label>
          <select
            id="dia"
            name="dia"
            className="sf-select"
            value={formData.dia}
            onChange={handleChange}
            disabled={guardando}
          >
            {DIAS_ENTRENAMIENTO.map((dia) => (
              <option key={dia} value={dia}>
                {dia}
              </option>
            ))}
          </select>
        </div>

        <div className="sf-field">
          <label htmlFor="grupoMuscular" className="sf-label">
            Grupo muscular *
          </label>
          <select
            id="grupoMuscular"
            name="grupoMuscular"
            className="sf-select"
            value={formData.grupoMuscular}
            onChange={handleChange}
            disabled={guardando}
          >
            {GRUPOS_MUSCULARES.map((grupo) => (
              <option key={grupo} value={grupo}>
                {grupo}
              </option>
            ))}
          </select>
        </div>

        <div className="sf-metrics-row">
          <div className="sf-field">
            <label htmlFor="series" className="sf-label">
              Series *
            </label>
            <input
              id="series"
              name="series"
              type="number"
              min="1"
              max="20"
              placeholder="Ej: 4"
              className={`sf-input ${errores.series ? 'sf-input-error' : ''}`}
              value={formData.series}
              onChange={handleChange}
              disabled={guardando}
            />
            {errores.series && <span className="sf-error-text">{errores.series}</span>}
          </div>

          <div className="sf-field">
            <label htmlFor="repeticiones" className="sf-label">
              Reps *
            </label>
            <input
              id="repeticiones"
              name="repeticiones"
              type="number"
              min="1"
              max="100"
              placeholder="Ej: 12"
              className={`sf-input ${errores.repeticiones ? 'sf-input-error' : ''}`}
              value={formData.repeticiones}
              onChange={handleChange}
              disabled={guardando}
            />
            {errores.repeticiones && (
              <span className="sf-error-text">{errores.repeticiones}</span>
            )}
          </div>

          <div className="sf-field">
            <label htmlFor="pesoKg" className="sf-label">
              Peso (kg) *
            </label>
            <input
              id="pesoKg"
              name="pesoKg"
              type="number"
              min="0"
              step="0.5"
              placeholder="Ej: 35"
              className={`sf-input ${errores.pesoKg ? 'sf-input-error' : ''}`}
              value={formData.pesoKg}
              onChange={handleChange}
              disabled={guardando}
            />
            {errores.pesoKg && <span className="sf-error-text">{errores.pesoKg}</span>}
          </div>
        </div>

        <div className="sf-field">
          <label htmlFor="notaTecnica" className="sf-label">
            Nota técnica / consejo de uso de máquina (opcional)
          </label>
          <textarea
            id="notaTecnica"
            name="notaTecnica"
            rows="3"
            className="sf-textarea"
            placeholder="Ej: Ajustar el respaldo en posición 3 y mantener los codos pegados al cuerpo..."
            value={formData.notaTecnica}
            onChange={handleChange}
            disabled={guardando}
          />
        </div>

        <button
          type="submit"
          className="sf-btn sf-btn-primary sf-btn-full"
          disabled={guardando}
        >
          {guardando ? 'Guardando en Firestore...' : '+ Registrar en Mi Plan'}
        </button>
      </form>
    </aside>
  );
}

export default ExerciseForm;
