import React from 'react';

const ProgressDashboard = ({ exercises, userProfile, onOpenQuestionnaire }) => {
  const total = exercises.length;
  const completados = exercises.filter((e) => e.estado === 'Completado').length;
  const pendientes = total - completados;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  return (
    <section className="sf-dashboard" aria-label="Resumen de tu plan personalizado">
      {userProfile && (
        <div className="sf-profile-banner">
          <div className="sf-profile-summary">
            <span className="sf-profile-badge">TU PLAN PERSONALIZADO</span>
            <h2 className="sf-profile-headline">
              Objetivo: <strong>{userProfile.objetivo}</strong> •{' '}
              <span>
                {userProfile.frecuenciaDias}{' '}
                {Number(userProfile.frecuenciaDias) === 1 ? 'día por semana' : 'días por semana'}
              </span>
            </h2>
            <p className="sf-profile-meta">
              Perfil configurado: {userProfile.genero} • {userProfile.edad} años • {userProfile.pesoKg} kg •{' '}
              {userProfile.alturaCm} cm
            </p>
          </div>
          <button
            type="button"
            className="sf-btn sf-btn-outline"
            onClick={onOpenQuestionnaire}
          >
            Rehacer cuestionario
          </button>
        </div>
      )}

      <div className="sf-stats-grid">
        <article className="sf-stat-card">
          <span className="sf-stat-label">Avance de la Rutina</span>
          <div className="sf-stat-value-row">
            <strong className="sf-stat-number sf-text-green">{porcentaje}%</strong>
            <span className="sf-stat-sub">
              {completados} de {total} ejercicios
            </span>
          </div>
          <div className="sf-progress-bar-bg" aria-hidden="true">
            <div
              className="sf-progress-bar-fill"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </article>

        <article className="sf-stat-card">
          <span className="sf-stat-label">Ejercicios Completados</span>
          <div className="sf-stat-value-row">
            <strong className="sf-stat-number">{completados}</strong>
            <span className="sf-stat-chip is-done">Realizados</span>
          </div>
          <p className="sf-stat-helper">Marcá cada máquina a medida que terminás tus series.</p>
        </article>

        <article className="sf-stat-card">
          <span className="sf-stat-label">Ejercicios Pendientes</span>
          <div className="sf-stat-value-row">
            <strong className="sf-stat-number">{pendientes}</strong>
            <span className="sf-stat-chip is-pending">Por entrenar</span>
          </div>
          <p className="sf-stat-helper">Adaptados a tu peso y frecuencia semanal.</p>
        </article>
      </div>
    </section>
  );
};

export default ProgressDashboard;
