import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheckCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SurveyReview = ({ questions, responses, onEdit, onSubmit }) => {
  const formatResponse = (question, response) => {
    if (!response) return <span className="no-response">No response provided</span>;
    switch (question.type) {
      case "choice":
        return question.options?.multiple === "yes" 
          ? response.map(r => <span className="badge" key={r}>{r}</span>)
          : <span className="response-text">{response}</span>;
      case "file":
        return Array.from(response).map(f => (
          <div key={f.name} className="file-item">
            <span className="file-name">{f.name}</span>
            <span className="file-size">({Math.round(f.size / 1024)} KB)</span>
          </div>
        ));
      default:
        return <span className="response-text">{response}</span>;
    }
  };

  return (
    <div className="review-container card">
      <div className="review-header">
        <h2 className="review-title"><FontAwesomeIcon icon={faCheckCircle} /> Review Your Answers</h2>
        <p className="review-subtitle">Please verify your responses before submission</p>
      </div>

      <div className="review-list">
        {questions.map((q, index) => (
          <div key={q.name} className="review-item card">
            <div className="review-question">
              <h3>{q.text} {q.required === "yes" && <sup className="required">*</sup>}</h3>
              <button onClick={() => onEdit(index)} className="btn-edit">
                <FontAwesomeIcon icon={faEdit} /> Edit
              </button>
            </div>
            <div className="review-response">
              {formatResponse(q, responses[q.name])}
            </div>
          </div>
        ))}
      </div>

      <div className="review-actions">
        <button onClick={() => onEdit(questions.length - 1)} className="btn-secondary">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Questions
        </button>
        <button onClick={onSubmit} className="btn-primary">
          Submit Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyReview;