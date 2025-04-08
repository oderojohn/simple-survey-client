import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const LoadingState = () => (
  <div className="loading-state">
    <FontAwesomeIcon icon={faSpinner} spin className="spinner" />
    <p>Loading responses...</p>
  </div>
);

export const ErrorState = ({ error }) => (
  <div className="error-state">
    <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
    <h3>Error loading responses</h3>
    <p>{error}</p>
    <button className="retry-button" onClick={() => window.location.reload()}>
      Try Again
    </button>
  </div>
);

export const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-icon">📭</div>
    <h3>No responses found</h3>
    <p>No survey responses match your criteria.</p>
  </div>
);