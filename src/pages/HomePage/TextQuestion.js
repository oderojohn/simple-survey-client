import React from 'react';

const TextQuestion = ({ question, responses, handleChange }) => (
  <div className="form-group">
    <label htmlFor={question.name}>
      {question.text}
      {question.required === "yes" && <span className="required">*</span>}
    </label>
    {question.description && <p className="description">{question.description}</p>}
    {question.type === 'long_text' ? (
      <textarea
        id={question.name}
        value={responses[question.name] || ""}
        onChange={(e) => handleChange(question.name, e.target.value)}
        aria-required={question.required === "yes"}
      />
    ) : (
      <input
        id={question.name}
        type={question.type === "email" ? "email" : "text"}
        value={responses[question.name] || ""}
        onChange={(e) => handleChange(question.name, e.target.value)}
        aria-required={question.required === "yes"}
      />
    )}
  </div>
);

export default TextQuestion;