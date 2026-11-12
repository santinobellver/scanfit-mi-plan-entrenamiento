import React from 'react';

const ExerciseCard = ({ exercise, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = exercise.estado === 'Completado';

  return (
    <article className={`sf-exercise-card ${isCompleted ? 'is-completed' : ''}`}>
      <div className="sf-card-top">
        <div className="sf-card-badges">
          <span className="sf-badge-day">{exercise.dia}</span>
          <span className="sf-badge-muscle">{exercise.grupoMuscular}</span>
        </div>
        <span className={`sf-status-pill ${isCompleted ? 'is-done' : 'is-pending'}`}>
          {isCompleted ? '✓ Completado' : 'Pendiente'}
        </span>
      </div>

      <h3 className="sf-card-title">{exercise.nombre}</h3>
      <p className="sf-card-machine">📍 {exercise.maquina}</p>

      <div className="sf-card-metrics">
        <div className="sf-metric-box">
          <span className="sf-metric-label">Series</span>
          <strong className="sf-metric-val">{exercise.series}</strong>
        </div>
        <div className="sf-metric-box">
          <span className="sf-metric-label">Repeticiones</span>
          <strong className="sf-metric-val">{exercise.repeticiones}</strong>
        </div>
        <div className="sf-metric-box">
          <span className="sf-metric-label">Carga</span>
          <strong className="sf-metric-val">
            {Number(exercise.pesoKg) > 0 ? `${exercise.pesoKg} kg` : 'Peso corporal'}
          </strong>
        </div>
        <div className="sf-metric-box">
          <span className="sf-metric-label">Pausa</span>
          <strong className="sf-metric-val">{exercise.descansoSeg || 60}s</strong>
        </div>
      </div>

      {exercise.notas && <p className="sf-card-notes">💡 {exercise.notas}</p>}

      <div className="sf-card-actions">
        <button
          type="button"
          className={`sf-btn ${isCompleted ? 'sf-btn-secondary' : 'sf-btn-primary'}`}
          onClick={() => onToggleStatus(exercise)}
        >
          {isCompleted ? 'Marcar como Pendiente' : '✓ Marcar Completado'}
        </button>

        <div className="sf-card-icon-actions">
          <button
            type="button"
            className="sf-btn-icon"
            onClick={() => onEdit(exercise)}
            title="Editar series, repeticiones o carga"
          >
            Editar
          </button>
          <button
            type="button"
            className="sf-btn-icon sf-btn-danger"
            onClick={() => onDelete(exercise.id)}
            title="Quitar ejercicio del plan"
          >
            Quitar
          </button>
        </div>
      </div>
    </article>
  );
};

export default ExerciseCard;
