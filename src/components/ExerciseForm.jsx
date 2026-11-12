import React, { useState } from 'react';

const GRUPOS_MUSCULARES = ['Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core', 'Cardio'];

const ExerciseForm = ({ availableDays, activeDay, onAddExercise, isSubmitting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [maquina, setMaquina] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState('Pecho');
  const [dia, setDia] = useState(activeDay !== 'Todos' ? activeDay : availableDays[0] || 'Día 1');
  const [series, setSeries] = useState(4);
  const [repeticiones, setRepeticiones] = useState('10 a 12 reps');
  const [pesoKg, setPesoKg] = useState(25);
  const [descansoSeg, setDescansoSeg] = useState(60);
  const [notas, setNotas] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!nombre.trim() || !maquina.trim()) {
      setFormError('Completá el nombre del ejercicio y la máquina correspondiente.');
      return;
    }

    await onAddExercise({
      nombre,
      maquina,
      grupoMuscular,
      dia,
      series: Number(series),
      repeticiones,
      pesoKg: Number(pesoKg),
      descansoSeg: Number(descansoSeg),
      notas,
    });

    setNombre('');
    setMaquina('');
    setNotas('');
    setIsOpen(false);
  };

  return (
    <section className="sf-form-section">
      <div className="sf-form-toggle-bar">
        <div>
          <h3 className="sf-section-title">¿Querés sumar una máquina extra a tu plan?</h3>
          <p className="sf-section-subtitle">
            Podés agregar ejercicios personalizados a cualquiera de tus días de entrenamiento.
          </p>
        </div>
        <button
          type="button"
          className="sf-btn sf-btn-primary"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? 'Cerrar formulario' : '+ Agregar Ejercicio Manual'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="sf-exercise-form">
          {formError && <p className="sf-form-error">{formError}</p>}

          <div className="sf-form-grid">
            <div className="sf-input-group">
              <label className="sf-field-label">Nombre del Ejercicio *</label>
              <input
                type="text"
                className="sf-input"
                placeholder="Ej: Prensa de piernas 45°"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Máquina o Estación *</label>
              <input
                type="text"
                className="sf-input"
                placeholder="Ej: Máquina #10 Sector Piernas"
                value={maquina}
                onChange={(e) => setMaquina(e.target.value)}
                required
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Día de tu Plan</label>
              <select
                className="sf-input"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
              >
                {availableDays.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Grupo Muscular</label>
              <select
                className="sf-input"
                value={grupoMuscular}
                onChange={(e) => setGrupoMuscular(e.target.value)}
              >
                {GRUPOS_MUSCULARES.map((grupo) => (
                  <option key={grupo} value={grupo}>
                    {grupo}
                  </option>
                ))}
              </select>
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Series</label>
              <input
                type="number"
                min="1"
                max="10"
                className="sf-input"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Repeticiones</label>
              <input
                type="text"
                className="sf-input"
                placeholder="Ej: 10 a 12 reps"
                value={repeticiones}
                onChange={(e) => setRepeticiones(e.target.value)}
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Peso Sugerido (KG)</label>
              <input
                type="number"
                min="0"
                max="400"
                step="2.5"
                className="sf-input"
                value={pesoKg}
                onChange={(e) => setPesoKg(e.target.value)}
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Descanso (Segundos)</label>
              <input
                type="number"
                min="15"
                max="300"
                step="5"
                className="sf-input"
                value={descansoSeg}
                onChange={(e) => setDescansoSeg(e.target.value)}
              />
            </div>
          </div>

          <div className="sf-input-group" style={{ marginTop: '12px' }}>
            <label className="sf-field-label">Consejo postural / Notas de uso</label>
            <input
              type="text"
              className="sf-input"
              placeholder="Ej: Mantener la espalda apoyada y controlar el descenso"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          <div className="sf-form-actions">
            <button
              type="button"
              className="sf-btn sf-btn-secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="sf-btn sf-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar en Mi Plan'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default ExerciseForm;
