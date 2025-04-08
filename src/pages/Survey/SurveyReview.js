import React from "react";

const SurveyReview = ({ questions, responses, onEdit, onSubmit }) => {
  const formatResponse = (question, response) => {
    if (!response) return "No response";
    switch (question.type) {
      case "choice":
        return question.options?.multiple === "yes" ? response.join(", ") : response;
      case "file":
        return Array.from(response).map(f => f.name).join(", ");
      default:
        return response;
    }
  };

  return (
    <div className="review-container">
      <h3>Review Your Answers</h3>
      {questions.map((q, index) => (
        <div key={q.name} className="review-item">
          <h4>{q.text} {q.required === "yes" && <span className="required">*</span>}</h4>
          <p>{formatResponse(q, responses[q.name])}</p>
          <button onClick={() => onEdit(index)} className="btn-edit">Edit</button>
        </div>
      ))}
      <div className="review-buttons">
        <button onClick={() => onEdit(questions.length - 1)} className="btn-prev">Back</button>
        <button onClick={onSubmit} className="btn-submit">Submit</button>
      </div>
    </div>
  );
};

export default SurveyReview;