import React from 'react';

const ChoiceQuestion = ({ question, responses, handleChange }) => (
  <div className="form-group">
    <fieldset>
      <legend>
        {question.text}
        {question.required === "yes" && <span className="required">*</span>}
      </legend>
      {question.description && <p className="description">{question.description}</p>}
      <div className="options-container">
        {(Array.isArray(question.options) ? question.options : []).map((opt) => {
          const value = typeof opt === "object" ? opt.value : opt;
          const label = typeof opt === "object" ? opt.text : opt;
          return (
            <label key={value} className="option-item">
              {question.options?.multiple === "yes" ? (
                <input
                  type="checkbox"
                  checked={(responses[question.name] || []).includes(value)}
                  onChange={(e) => {
                    const selected = responses[question.name] || [];
                    const newSelected = e.target.checked
                      ? [...selected, value]
                      : selected.filter((item) => item !== value);
                    handleChange(question.name, newSelected);
                  }}
                  aria-label={label}
                />
              ) : (
                <input
                  type="radio"
                  name={question.name}
                  value={value}
                  checked={responses[question.name] === value}
                  onChange={(e) => handleChange(question.name, e.target.value)}
                  aria-label={label}
                />
              )}
              <span>{label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  </div>
);

export default ChoiceQuestion;