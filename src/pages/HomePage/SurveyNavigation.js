import React from 'react';

const SurveyNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  hasErrors 
}) => (
  <div className="navigation-buttons">
    {currentStep > 0 && (
      <button 
        type="button" 
        onClick={onPrevious} 
        className="btn-prev"
      >
        Previous
      </button>
    )}
    <button 
      type="button" 
      onClick={onNext} 
      className="btn-next"
      disabled={hasErrors}
    >
      {currentStep === totalSteps - 1 ? "Review" : "Next"}
    </button>
  </div>
);

export default SurveyNavigation;