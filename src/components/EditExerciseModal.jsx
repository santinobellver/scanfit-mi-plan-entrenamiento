import React, { useState, useEffect } from 'react';
import { DIAS_ENTRENAMIENTO, GRUPOS_MUSCULARES } from '../services/workoutService';

function EditExerciseModal({ ejercicio, onGuardarEdicion, onCerrar, guardando }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dia: DIAS_ENTRENAMIENTO[0],
    grupoMuscular: GRUPOS_MUSCULARES[0],
    series: '',
    repeticiones: '',
    pesoKg: '',
    notaTecnica: '',
    estado: 'Pendiente',
  });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (ejercicio) {
      setFormData({
        nombre: ejercicio.nombre || '',
        dia: ejercicio.dia || DIAS_ENTRENAMIENTO[0],
        grupoMuscular: ejercicio.grupoMuscular || GRUPOS_MUSCULARES[0],
        series: String(ejercicio.series ?? ''),
        repeticiones: String(ejercicio.repeticiones ?? ''),
        pesoKg: String(ejercicio.pesoKg ?? ''),
        notaTecnica: ejercicio.notaTecnica || '',
        estado: ejercicio.estado || 'Pendiente',
      });
      setErrores({});
    }
  }, [ejercicio]);

  if (!ejercicio) return null;

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    const seriesNum = Number(formData.series);
    if (
      formData.series === '' ||
      Number.isNaN(seriesNum) ||
      !Number.isInteger(seriesNum) ||
      seriesNum < 1 ||
      seriesNum > 20
    ) {
      nuevosErrores.series = 'Series entre 1 y 20.';
    }

    const repsNum = Number(formData.repeticiones);
    if (
      formData.repeticiones === '' ||
      Number.isNaN(repsNum) ||
      !Number.isInteger(repsNum) ||
      repsNum < 1 ||
      repsNum > 100
    ) {
      nuevosErrores.repeticiones = 'Repeticiones entre 1 y 100.';
    }

    const pesoNum = Number(formData.pesoKg);
    if (
      formData.pesoKg === '' ||
      Number.isNaN(pesoNum) ||
      pesoNum < 0 ||
      pesoNum > 500
    ) {
      nuevosErrores.pesoKg = 'Peso entre 0 y 500 kg.';
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
    if (!validar()) return;
    await onGuardarEdicion(ejercicio.id, formData);
  };

  return (
    <div className="sf-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="sf-modal-card">
        <div className="sf-modal-header">
          <div>
            <span className="sf-form-tag">MODIFICAR EJERCICIO (updateDoc)</span>
            <h2 id="edit-modal-title" className="sf-modal-title">
              Editar Datos del Ejercicio
            </h2>
          </div>
          <button
            type="button"
            className="sf-modal-close"
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar ventana de edición"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="sf-form">
          <div className="sf-field">
            <label htmlFor="edit-nombre" className="sf-label">
              Nombre del ejercicio / máquina *
            </label>
            <input
              id="edit-nombre"
              name="nombre"
              type="text"
              className={`sf-input ${errores.nombre ? 'sf-input-error' : ''}`}
              value={formData.nombre}
              onChange={handleChange}
              disabled={guardando}
            />
            {errores.nombre && <span className="sf-error-text">{errores.nombre}</span>}
          </div>

          <div className="sf-modal-row-2">
            <div className="sf-field">
              <label htmlFor="edit-dia" className="sf-label">
                Día asignado *
              </label>
              <select
                id="edit-dia"
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
              <label htmlFor="edit-grupo" className="sf-label">
                Grupo muscular *
              </label>
              <select
                id="edit-grupo"
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
          </div>

          <div className="sf-metrics-row">
            <div className="sf-field">
              <label htmlFor="edit-series" className="sf-label">
                Series *
              </label>
              <input
                id="edit-series"
                name="series"
                type="number"
                min="1"
                max="20"
                className={`sf-input ${errores.series ? 'sf-input-error' : ''}`}
                value={formData.series}
                onChange={handleChange}
                disabled={guardando}
              />
              {errores.series && <span className="sf-error-text">{errores.series}</span>}
            </div>

            <div className="sf-field">
              <label htmlFor="edit-repeticiones" className="sf-label">
                Reps *
              </label>
              <input
                id="edit-repeticiones"
                name="repeticiones"
                type="number"
                min="1"
                max="100"
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
              <label htmlFor="edit-pesoKg" className="sf-label">
                Peso (kg) *
              </label>
              <input
                id="edit-pesoKg"
                name="pesoKg"
                type="number"
                min="0"
                step="0.5"
                className={`sf-input ${errores.pesoKg ? 'sf-input-error' : ''}`}
                value={formData.pesoKg}
                onChange={handleChange}
                disabled={guardando}
              />
              {errores.pesoKg && <span className="sf-error-text">{errores.pesoKg}</span>}
            </div>
          </div>

          <div className="sf-field">
            <label htmlFor="edit-estado" className="sf-label">
              Estado del ejercicio
            </label>
            <select
              id="edit-estado"
              name="estado"
              className="sf-select"
              value={formData.estado}
              onChange={handleChange}
              disabled={guardando}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div className="sf-field">
            <label htmlFor="edit-nota" className="sf-label">
              Nota técnica / consejo de uso de máquina (opcional)
            </label>
            <textarea
              id="edit-nota"
              name="notaTecnica"
              rows="3"
              className="sf-textarea"
              value={formData.notaTecnica}
              onChange={handleChange}
              disabled={guardando}
            />
          </div>

          <div className="sf-modal-actions">
            <button
              type="button"
              className="sf-btn sf-btn-ghost"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="sf-btn sf-btn-primary"
              disabled={guardando}
            >
              {guardando ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditExerciseModal;
