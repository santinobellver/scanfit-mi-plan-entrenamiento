import React from 'react';

function Header({ usuarioAuth, onRecargar, cargando }) {
  return (
    <header className="sf-header">
      <div className="sf-container sf-header-inner">
        <div className="sf-brand">
          <div className="sf-logo-badge" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="sf-logo-svg">
              <rect x="10" y="42" width="10" height="36" rx="4" fill="#FFFFFF" />
              <rect x="23" y="32" width="11" height="56" rx="4" fill="#7DAD3D" />
              <rect x="86" y="32" width="11" height="56" rx="4" fill="#7DAD3D" />
              <rect x="100" y="42" width="10" height="36" rx="4" fill="#FFFFFF" />
              <rect x="34" y="55" width="52" height="10" fill="#324651" />
              <circle cx="60" cy="60" r="22" fill="#141B34" stroke="#FFFFFF" strokeWidth="5" />
              <circle cx="60" cy="60" r="11" fill="#7DAD3D" />
            </svg>
          </div>
          <div>
            <div className="sf-brand-top">
              <span className="sf-brand-name">SCANFIT</span>
              <span className="sf-module-pill">Mi Plan de Entrenamiento</span>
            </div>
            <p className="sf-brand-subtitle">
              Gestión interactiva de máquinas, cargas y progreso semanal en el gimnasio
            </p>
          </div>
        </div>

        <div className="sf-header-actions">
          <div className="sf-auth-status" title="Estado de conexión con Firebase">
            <span
              className={`sf-status-dot ${usuarioAuth ? 'sf-dot-online' : 'sf-dot-pending'}`}
            />
            <span className="sf-auth-text">
              {usuarioAuth
                ? `Firestore Activo (ID: ${usuarioAuth.uid.slice(0, 6)}...)`
                : 'Conectando a Firebase...'}
            </span>
          </div>

          <button
            type="button"
            className="sf-btn sf-btn-outline-light"
            onClick={onRecargar}
            disabled={cargando}
            title="Volver a consultar los documentos desde Cloud Firestore"
          >
            {cargando ? 'Sincronizando...' : 'Sincronizar Datos'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
