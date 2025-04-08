import React from 'react';

const SurveyConfirmation = ({ onRestart }) => (
  <div className="confirmation">
    <h3>Thank you!</h3>
    <p>Your responses have been submitted successfully.</p>
    <button 
      className="btn-submit" 
      onClick={onRestart}
    >
      Submit Another Response
    </button>
  </div>
);

export default SurveyConfirmation;