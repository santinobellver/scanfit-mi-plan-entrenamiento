import React from 'react';

function FeedbackBanner({ feedback, onClose }) {
  if (!feedback || !feedback.mensaje) return null;

  const esError = feedback.tipo === 'error';
  const esInfo = feedback.tipo === 'info';

  return (
    <div
      className={`sf-feedback-banner ${
        esError ? 'sf-feedback-error' : esInfo ? 'sf-feedback-info' : 'sf-feedback-success'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="sf-feedback-content">
        <span className="sf-feedback-icon" aria-hidden="true">
          {esError ? '⚠️' : esInfo ? 'ℹ️' : '✅'}
        </span>
        <p className="sf-feedback-message">{feedback.mensaje}</p>
      </div>
      {onClose && (
        <button
          type="button"
          className="sf-feedback-close"
          onClick={onClose}
          aria-label="Cerrar mensaje"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default FeedbackBanner;
