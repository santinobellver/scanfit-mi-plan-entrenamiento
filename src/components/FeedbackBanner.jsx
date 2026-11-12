import React from 'react';

const FeedbackBanner = ({ feedback, onClose }) => {
  if (!feedback || !feedback.message) return null;

  return (
    <div
      className={`sf-feedback-banner ${feedback.type === 'error' ? 'is-error' : 'is-success'}`}
      role="status"
    >
      <span>{feedback.message}</span>
      <button type="button" className="sf-feedback-close" onClick={onClose} aria-label="Cerrar aviso">
        ✕
      </button>
    </div>
  );
};

export default FeedbackBanner;
