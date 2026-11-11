import React from 'react';

function ExerciseCard({
  ejercicio,
  onToggleEstado,
  onAbrirEdicion,
  onEliminar,
  procesandoId,
}) {
  const completado = ejercicio.estado === 'Completado';
  const estaProcesando = procesandoId === ejercicio.id;

  return (
    <article
      className={`sf-exercise-card ${
        completado ? 'sf-card-completed' : 'sf-card-pending'
      }`}
    >
      <div className="sf-card-top">
        <div className="sf-card-badges">
          <span className="sf-badge sf-badge-day">{ejercicio.dia}</span>
          <span className="sf-badge sf-badge-muscle">{ejercicio.grupoMuscular}</span>
        </div>

        <span
          className={`sf-status-pill ${
            completado ? 'sf-status-done' : 'sf-status-todo'
          }`}
        >
          {completado ? '✓ Completado' : '⏳ Pendiente'}
        </span>
      </div>

      <div className="sf-card-body">
        <h3 className="sf-exercise-title">{ejercicio.nombre}</h3>

        <div className="sf-prescription-grid">
          <div className="sf-metric-chip">
            <span className="sf-metric-label">SERIES</span>
            <span className="sf-metric-value">{ejercicio.series}</span>
          </div>
          <div className="sf-metric-chip">
            <span className="sf-metric-label">REPETICIONES</span>
            <span className="sf-metric-value">{ejercicio.repeticiones}</span>
          </div>
          <div className="sf-metric-chip">
            <span className="sf-metric-label">CARGA</span>
            <span className="sf-metric-value">{ejercicio.pesoKg} kg</span>
          </div>
        </div>

        {ejercicio.notaTecnica && (
          <div className="sf-tech-note">
            <span className="sf-tech-note-label">Guía de máquina / técnica:</span>
            <p className="sf-tech-note-text">{ejercicio.notaTecnica}</p>
          </div>
        )}
      </div>

      <div className="sf-card-actions">
        <button
          type="button"
          className={`sf-btn ${
            completado ? 'sf-btn-secondary' : 'sf-btn-primary'
          } sf-btn-toggle`}
          onClick={() => onToggleEstado(ejercicio)}
          disabled={estaProcesando}
        >
          {estaProcesando
            ? 'Actualizando...'
            : completado
            ? 'Marcar como Pendiente'
            : '✓ Marcar Completado'}
        </button>

        <div className="sf-card-secondary-actions">
          <button
            type="button"
            className="sf-btn sf-btn-ghost"
            onClick={() => onAbrirEdicion(ejercicio)}
            disabled={estaProcesando}
            title="Editar nombre, series, repeticiones o peso"
          >
            Editar
          </button>
          <button
            type="button"
            className="sf-btn sf-btn-danger"
            onClick={() => onEliminar(ejercicio)}
            disabled={estaProcesando}
            title="Eliminar ejercicio de la rutina"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ExerciseCard;
