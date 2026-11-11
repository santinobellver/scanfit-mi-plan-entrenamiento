import React from 'react';
import { DIAS_ENTRENAMIENTO } from '../services/workoutService';

function ProgressDashboard({
  ejercicios,
  diaSeleccionado,
  onSelectDia,
  ejerciciosFiltrados,
}) {
  const totalGlobal = ejercicios.length;
  const completadosGlobal = ejercicios.filter((e) => e.estado === 'Completado').length;
  const porcentajeGlobal =
    totalGlobal > 0 ? Math.round((completadosGlobal / totalGlobal) * 100) : 0;

  const totalDia = ejerciciosFiltrados.length;
  const completadosDia = ejerciciosFiltrados.filter(
    (e) => e.estado === 'Completado'
  ).length;
  const pendientesDia = totalDia - completadosDia;
  const porcentajeDia =
    totalDia > 0 ? Math.round((completadosDia / totalDia) * 100) : 0;

  const filtros = ['Todos', ...DIAS_ENTRENAMIENTO];

  return (
    <section className="sf-dashboard" aria-label="Progreso y filtros del plan">
      <div className="sf-stats-grid">
        <div className="sf-stat-card sf-stat-primary">
          <div className="sf-stat-header">
            <span className="sf-stat-label">
              {diaSeleccionado === 'Todos'
                ? 'PROGRESO TOTAL DE LA RUTINA'
                : `PROGRESO — ${diaSeleccionado.toUpperCase()}`}
            </span>
            <span className="sf-stat-percentage">
              {diaSeleccionado === 'Todos' ? porcentajeGlobal : porcentajeDia}%
            </span>
          </div>

          <div
            className="sf-progress-track"
            role="progressbar"
            aria-valuenow={diaSeleccionado === 'Todos' ? porcentajeGlobal : porcentajeDia}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="sf-progress-fill"
              style={{
                width: `${diaSeleccionado === 'Todos' ? porcentajeGlobal : porcentajeDia}%`,
              }}
            />
          </div>

          <p className="sf-stat-caption">
            {totalDia === 0
              ? 'Todavía no hay ejercicios registrados en esta vista.'
              : `${completadosDia} de ${totalDia} ejercicios completados (${pendientesDia} pendientes)`}
          </p>
        </div>

        <div className="sf-kpi-row">
          <div className="sf-kpi-box">
            <span className="sf-kpi-number">{totalDia}</span>
            <span className="sf-kpi-title">Asignados</span>
          </div>
          <div className="sf-kpi-box sf-kpi-completed">
            <span className="sf-kpi-number">{completadosDia}</span>
            <span className="sf-kpi-title">Completados</span>
          </div>
          <div className="sf-kpi-box sf-kpi-pending">
            <span className="sf-kpi-number">{pendientesDia}</span>
            <span className="sf-kpi-title">Pendientes</span>
          </div>
        </div>
      </div>

      <div className="sf-filter-bar">
        <span className="sf-filter-label">Filtrar por día de entrenamiento:</span>
        <div className="sf-filter-pills" role="tablist">
          {filtros.map((dia) => {
            const activo = diaSeleccionado === dia;
            const cantidadPorDia =
              dia === 'Todos'
                ? ejercicios.length
                : ejercicios.filter((item) => item.dia === dia).length;

            return (
              <button
                key={dia}
                type="button"
                role="tab"
                aria-selected={activo}
                className={`sf-filter-pill ${activo ? 'sf-filter-pill-active' : ''}`}
                onClick={() => onSelectDia(dia)}
              >
                <span>{dia}</span>
                <span className="sf-pill-count">{cantidadPorDia}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProgressDashboard;
