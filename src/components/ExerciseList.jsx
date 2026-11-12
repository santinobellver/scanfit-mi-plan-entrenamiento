import React from 'react';
import ExerciseCard from './ExerciseCard';

const ExerciseList = ({
  exercises,
  availableDays,
  activeDay,
  onSelectDay,
  statusFilter,
  onSelectStatusFilter,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <section className="sf-list-section" aria-label="Ejercicios de tu rutina">
      <div className="sf-filters-bar">
        <div className="sf-day-tabs" role="tablist" aria-label="Filtrar por día de entrenamiento">
          <button
            type="button"
            role="tab"
            aria-selected={activeDay === 'Todos'}
            className={`sf-day-tab ${activeDay === 'Todos' ? 'is-active' : ''}`}
            onClick={() => onSelectDay('Todos')}
          >
            Todos los días
          </button>
          {availableDays.map((dia) => (
            <button
              key={dia}
              type="button"
              role="tab"
              aria-selected={activeDay === dia}
              className={`sf-day-tab ${activeDay === dia ? 'is-active' : ''}`}
              onClick={() => onSelectDay(dia)}
            >
              {dia}
            </button>
          ))}
        </div>

        <div className="sf-status-filter">
          {['Todos', 'Pendiente', 'Completado'].map((estado) => (
            <button
              key={estado}
              type="button"
              className={`sf-filter-chip ${statusFilter === estado ? 'is-active' : ''}`}
              onClick={() => onSelectStatusFilter(estado)}
            >
              {estado === 'Todos' ? 'Todos' : estado === 'Pendiente' ? 'Pendientes' : 'Completados'}
            </button>
          ))}
        </div>
      </div>

      {exercises.length === 0 ? (
        <div className="sf-empty-state">
          <h3>No hay ejercicios en esta vista</h3>
          <p>Probá cambiando el filtro de día o agregá un ejercicio nuevo a tu rutina.</p>
        </div>
      ) : (
        <div className="sf-exercises-grid">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ExerciseList;
