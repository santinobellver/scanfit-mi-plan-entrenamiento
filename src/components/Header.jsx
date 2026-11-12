import React from 'react';

const Header = ({ theme, onToggleTheme, userProfile, onOpenQuestionnaire }) => {
  const isDark = theme === 'dark';

  return (
    <header className="sf-header">
      <div className="sf-header-container">
        <div className="sf-brand">
          <div className="sf-logo-badge" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M6.5 6.5L4 9L6.5 11.5M17.5 6.5L20 9L17.5 11.5M9 4L15 20"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div className="sf-brand-title-row">
              <h1 className="sf-brand-title">ScanFit</h1>
              <span className="sf-version-pill">Mi Plan Personalizado</span>
            </div>
            <p className="sf-brand-subtitle">
              Asesor inteligente de entrenamiento y uso de máquinas en el gimnasio
            </p>
          </div>
        </div>

        <div className="sf-header-actions">
          {userProfile && (
            <button
              type="button"
              className="sf-reconfigure-btn"
              onClick={onOpenQuestionnaire}
              title="Modificar tus datos, objetivo o días de entrenamiento"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Ajustar Mi Perfil / Objetivo</span>
            </button>
          )}

          <div className="sf-theme-switch-wrapper">
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={onToggleTheme}
              className={`sf-theme-switch ${isDark ? 'is-dark' : 'is-light'}`}
              aria-label="Cambiar entre modo claro y modo oscuro"
            >
              <span className="sf-theme-switch-track">
                <span className="sf-theme-icon sf-icon-sun" aria-hidden="true">
                  ☀️
                </span>
                <span className="sf-theme-icon sf-icon-moon" aria-hidden="true">
                  🌙
                </span>
                <span className="sf-theme-switch-thumb" />
              </span>
              <span className="sf-theme-switch-label">
                {isDark ? 'Modo Oscuro' : 'Modo Claro'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
