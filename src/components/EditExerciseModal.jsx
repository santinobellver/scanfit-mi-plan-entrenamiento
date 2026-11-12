import React, { useState, useEffect } from 'react';

const EditExerciseModal = ({ exercise, availableDays, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [maquina, setMaquina] = useState('');
  const [dia, setDia] = useState('Día 1');
  const [series, setSeries] = useState(4);
  const [repeticiones, setRepeticiones] = useState('');
  const [pesoKg, setPesoKg] = useState(0);
  const [descansoSeg, setDescansoSeg] = useState(60);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (exercise) {
      setNombre(exercise.nombre || '');
      setMaquina(exercise.maquina || '');
      setDia(exercise.dia || 'Día 1');
      setSeries(exercise.series || 4);
      setRepeticiones(exercise.repeticiones || '10 a 12 reps');
      setPesoKg(exercise.pesoKg ?? 0);
      setDescansoSeg(exercise.descansoSeg || 60);
      setNotas(exercise.notas || '');
    }
  }, [exercise]);

  if (!exercise) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !maquina.trim()) return;

    onSave(exercise.id, {
      ...exercise,
      nombre: nombre.trim(),
      maquina: maquina.trim(),
      dia,
      series: Number(series),
      repeticiones: String(repeticiones).trim(),
      pesoKg: Number(pesoKg),
      descansoSeg: Number(descansoSeg),
      notas: notas.trim(),
    });
  };

  return (
    <div className="sf-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="sf-modal-card">
        <div className="sf-modal-header">
          <h3 id="edit-modal-title">Ajustar Parámetros del Ejercicio</h3>
          <button type="button" className="sf-modal-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sf-modal-form">
          <div className="sf-form-grid">
            <div className="sf-input-group">
              <label className="sf-field-label">Ejercicio</label>
              <input
                type="text"
                className="sf-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Máquina</label>
              <input
                type="text"
                className="sf-input"
                value={maquina}
                onChange={(e) => setMaquina(e.target.value)}
                required
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Día asignado</label>
              <select className="sf-input" value={dia} onChange={(e) => setDia(e.target.value)}>
                {availableDays.map((d) => (
                  <option key={d} value={d}>
                    {d}
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
                value={repeticiones}
                onChange={(e) => setRepeticiones(e.target.value)}
              />
            </div>

            <div className="sf-input-group">
              <label className="sf-field-label">Carga (KG)</label>
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
              <label className="sf-field-label">Descanso (Seg)</label>
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
            <label className="sf-field-label">Notas técnicas</label>
            <input
              type="text"
              className="sf-input"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          <div className="sf-modal-actions">
            <button type="button" className="sf-btn sf-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="sf-btn sf-btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExerciseModal;
