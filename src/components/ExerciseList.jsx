import React from 'react';
import ExerciseCard from './ExerciseCard';

function ExerciseList({
  ejercicios,
  diaSeleccionado,
  cargando,
  procesandoId,
  onToggleEstado,
  onAbrirEdicion,
  onEliminar,
  onCargarRutinaBase,
  totalGlobal,
}) {
  if (cargando) {
    return (
      <div className="sf-state-box" role="status">
        <div className="sf-spinner" aria-hidden="true" />
        <h3 className="sf-state-title">Cargando tu plan desde Cloud Firestore...</h3>
        <p className="sf-state-text">
          Consultando los documentos de la colección <code>scanfit_entrenamientos</code>.
        </p>
      </div>
    );
  }

  if (ejercicios.length === 0) {
    return (
      <div className="sf-state-box sf-empty-state">
        <div className="sf-empty-icon" aria-hidden="true">
          🏋️‍♂️
        </div>
        <h3 className="sf-state-title">
          {totalGlobal === 0
            ? 'Tu rutina de entrenamiento está vacía'
            : `No hay ejercicios asignados para "${diaSeleccionado}"`}
        </h3>
        <p className="sf-state-text">
          {totalGlobal === 0
            ? 'Podés registrar tu primer ejercicio desde el formulario o cargar la rutina inicial de 4 días de ScanFit para empezar a entrenar con guía técnica.'
            : 'Usá el formulario para agregar un ejercicio a este día o seleccioná "Todos" en el filtro superior.'}
        </p>
        {totalGlobal === 0 && (
          <button
            type="button"
            className="sf-btn sf-btn-primary"
            onClick={onCargarRutinaBase}
            disabled={procesandoId === 'seed'}
          >
            {procesandoId === 'seed'
              ? 'Cargando rutina en Firestore...'
              : '⚡ Cargar Rutina Sugerida ScanFit (4 Días)'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="sf-list-wrapper">
      <div className="sf-list-header">
        <h2 className="sf-section-title">
          {diaSeleccionado === 'Todos'
            ? 'Todos los Ejercicios de la Rutina'
            : diaSeleccionado}
        </h2>
        <span className="sf-list-counter">
          {ejercicios.length}{' '}
          {ejercicios.length === 1 ? 'ejercicio registrado' : 'ejercicios registrados'}
        </span>
      </div>

      <div className="sf-cards-grid">
        {ejercicios.map((ejercicio) => (
          <ExerciseCard
            key={ejercicio.id}
            ejercicio={ejercicio}
            onToggleEstado={onToggleEstado}
            onAbrirEdicion={onAbrirEdicion}
            onEliminar={onEliminar}
            procesandoId={procesandoId}
          />
        ))}
      </div>
    </div>
  );
}

export default ExerciseList;
