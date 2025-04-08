import React from 'react';

const SurveyReview = ({ questions, responses, onEdit, onSubmit }) => {
  const formatResponse = (question, response) => {
    if (!response) return "No response";
    switch (question.type) {
      case "choice":
        return question.options.multiple === "yes"
          ? response.join(", ")
          : response;
      case "file":
        return Array.from(response).map((file) => file.name).join(", ");
      default:
        return response;
    }
  };

  return (
    <div className="review-container">
      <h3>Review Your Answers</h3>
      {questions.map((q, index) => (
        <div key={q.name} className="review-item">
          <h4>
            {q.text}
            {q.required === "yes" && <span className="required">*</span>}
          </h4>
          <p>{formatResponse(q, responses[q.name])}</p>
          <button 
            className="btn-edit" 
            onClick={() => onEdit(index)}
            aria-label={`Edit ${q.text}`}
          >
            Edit
          </button>
        </div>
      ))}
      <div className="review-buttons">
        <button 
          type="button" 
          className="btn-prev" 
          onClick={() => onEdit(null)}
        >
          Back
        </button>
        <button 
          type="button" 
          className="btn-submit" 
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SurveyReview;