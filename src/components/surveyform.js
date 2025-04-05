import React, { useEffect, useState } from "react";
import { fetchQuestions, submitResponses } from "../services/apiservice";
import "../assets/css/SurveyForm.css";

const Response = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchQuestions()
      .then(data => {
        console.log('Fetched questions:', data); // Debug log to inspect the response
        setQuestions(data.questions || []); // Ensure the structure is correct
      })
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

  const handleChange = (name, value) => {
    setResponses(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validateCurrentStep = () => {
    const currentQ = questions[currentStep];
    if (currentQ.required !== "yes") return true;

    const response = responses[currentQ.name];

    switch(currentQ.type) {
      case 'short_text':
      case 'email':
      case 'long_text':
        return !!response?.trim();
      case 'choice':
        if (currentQ.options?.multiple === "yes") {
          return Array.isArray(response) && response.length > 0;
        }
        return !!response;
      case 'file':
        return response?.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentStep];
    if (!validateCurrentStep()) {
      setErrors(prev => ({ ...prev, [currentQ.name]: "This field is required" }));
      return;
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    
    Object.entries(responses).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach(file => formData.append(key, file));
      } else if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });

    submitResponses(formData)
      .then(() => setSubmitted(true))
      .catch(err => console.error("Error submitting responses:", err));
  };

  const renderQuestion = (q) => {
    if (!q) return null;

    // Ensure all necessary keys exist in options and file_properties
    const options = q.options || {};
    const fileProperties = q.file_properties || {};

    switch(q.type) {
      case 'short_text':
        return (
          <>
            <label>{q.text}{q.required === "yes" && <span className="required">*</span>}</label>
            {q.description && <p className="description">{q.description}</p>}
            <input
              type="text"
              value={responses[q.name] || ""}
              onChange={e => handleChange(q.name, e.target.value)}
            />
          </>
        );

      case 'email':
        return (
          <>
            <label>{q.text}{q.required === "yes" && <span className="required">*</span>}</label>
            <input
              type="email"
              value={responses[q.name] || ""}
              onChange={e => handleChange(q.name, e.target.value)}
            />
          </>
        );

      case 'long_text':
        return (
          <>
            <label>{q.text}{q.required === "yes" && <span className="required">*</span>}</label>
            <textarea
              value={responses[q.name] || ""}
              onChange={e => handleChange(q.name, e.target.value)}
            />
          </>
        );

      case 'choice':
        return (
          <>
            <label>{q.text}{q.required === "yes" && <span className="required">*</span>}</label>
            <div className="options-container">
              {options.values?.map(option => (
                <label key={option} className="option-item">
                  {options.multiple === "yes" ? (
                    <input
                      type="checkbox"
                      checked={(responses[q.name] || []).includes(option)}
                      onChange={e => {
                        const selected = responses[q.name] || [];
                        const newSelected = e.target.checked
                          ? [...selected, option]
                          : selected.filter(item => item !== option);
                        handleChange(q.name, newSelected);
                      }}
                    />
                  ) : (
                    <input
                      type="radio"
                      name={q.name}
                      value={option}
                      checked={responses[q.name] === option}
                      onChange={e => handleChange(q.name, e.target.value)}
                    />
                  )}
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </>
        );

      case 'file':
        return (
          <>
            <label>{q.text}{q.required === "yes" && <span className="required">*</span>}</label>
            {q.description && <p className="description">{q.description}</p>}
            <input
              type="file"
              accept={fileProperties.format}
              multiple={fileProperties.multiple === "yes"}
              onChange={e => handleChange(q.name, e.target.files)}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="survey-container">
      <div className="form-details">
        <h2>Answer Survey Questions</h2>
        <p>Please fill out your answers below and click submit when done.</p>
        <div className="progress">
          Question {currentStep + 1} of {questions.length}
        </div>
      </div>

      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : submitted ? (
        <div className="confirmation">
          <p>Thank you! Your responses have been submitted.</p>
          <button className="btn-submit" onClick={() => window.location.reload()}>
            Respond Again
          </button>
        </div>
      ) : (
        <form className="survey-form">
          <div className="form-group">
            {renderQuestion(questions[currentStep])}
            {errors[questions[currentStep]?.name] && (
              <p className="error-message">{errors[questions[currentStep].name]}</p>
            )}
          </div>

          <div className="navigation-buttons">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="btn-prev"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="btn-next"
            >
              {currentStep === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Response;
