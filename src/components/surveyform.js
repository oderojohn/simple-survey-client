import React, { useEffect, useState } from "react";
import { fetchQuestions, submitResponses } from "../services/apiservice";
import "../assets/css/SurveyForm.css";
import { useNavigate } from "react-router-dom";

const Survey = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  // Debug questions data
  useEffect(() => {
    console.log("Questions data:", questions);
  }, [questions]);

  // Debug responses
  useEffect(() => {
    console.log("Current responses:", responses);
  }, [responses]);

  const handleGoToResponse = () => {
    navigate("/response");
  };

  useEffect(() => {
    fetchQuestions()
      .then((data) => {
        setQuestions(data.questions || []);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setFormError("Failed to load survey questions. Please try again later.");
      });
  }, []);

  const handleChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateCurrentStep = () => {
    const currentQ = questions[currentStep];
    if (!currentQ || currentQ.required !== "yes") return true;
    const response = responses[currentQ.name];

    switch (currentQ.type) {
      case "short_text":
      case "email":
      case "long_text":
        return !!response?.trim();
      case "choice":
        if (currentQ.options?.multiple === "yes") {
          return Array.isArray(response) && response.length > 0;
        }
        return !!response;
      case "file":
        // Validate at least one file is selected and all are PDFs
        if (!response || response.length === 0) return false;
        return Array.from(response).every(file => 
          file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentStep];
    if (!validateCurrentStep()) {
      let errorMsg = "This field is required";
      if (currentQ.type === "file") {
        if (!responses[currentQ.name] || responses[currentQ.name].length === 0) {
          errorMsg = "Please select at least one PDF file";
        } else {
          errorMsg = "Only PDF files are allowed";
        }
      }
      setErrors((prev) => ({ ...prev, [currentQ.name]: errorMsg }));
      return;
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    
    // Append all non-file fields
    Object.entries(responses).forEach(([key, value]) => {
      if (key === 'certificates') {
        Array.from(value).forEach(file => {
          formData.append('certificates', file);
        });
      } else {
        formData.append(key, value);
      }
    });

    submitResponses(formData)
      .then(() => setSubmitted(true))
      .catch((err) => {
        console.error("Submission error:", err);
        setFormError(err.response?.data?.message || "Submission failed. Please try again.");
      });
  };

  const Review = ({ questions, responses, onEdit, onSubmit }) => {
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
            onClick={() => setShowReview(false)}
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

  const renderQuestion = (q) => {
    if (!q) return null;
    const fileProperties = q.file_properties || {};

    switch (q.type) {
      case "short_text":
      case "email":
        return (
          <div className="form-group">
            <label htmlFor={q.name}>
              {q.text}
              {q.required === "yes" && <span className="required">*</span>}
            </label>
            {q.description && <p className="description">{q.description}</p>}
            <input
              id={q.name}
              type={q.type === "email" ? "email" : "text"}
              value={responses[q.name] || ""}
              onChange={(e) => handleChange(q.name, e.target.value)}
              aria-required={q.required === "yes"}
            />
          </div>
        );
      case "long_text":
        return (
          <div className="form-group">
            <label htmlFor={q.name}>
              {q.text}
              {q.required === "yes" && <span className="required">*</span>}
            </label>
            {q.description && <p className="description">{q.description}</p>}
            <textarea
              id={q.name}
              value={responses[q.name] || ""}
              onChange={(e) => handleChange(q.name, e.target.value)}
              aria-required={q.required === "yes"}
            />
          </div>
        );
      case "choice":
        return (
          <div className="form-group">
            <fieldset>
              <legend>
                {q.text}
                {q.required === "yes" && <span className="required">*</span>}
              </legend>
              {q.description && <p className="description">{q.description}</p>}
              <div className="options-container">
                {(Array.isArray(q.options) ? q.options : []).map((opt) => {
                  const value = typeof opt === "object" ? opt.value : opt;
                  const label = typeof opt === "object" ? opt.text : opt;
                  return (
                    <label key={value} className="option-item">
                      {q.options?.multiple === "yes" ? (
                        <input
                          type="checkbox"
                          checked={(responses[q.name] || []).includes(value)}
                          onChange={(e) => {
                            const selected = responses[q.name] || [];
                            const newSelected = e.target.checked
                              ? [...selected, value]
                              : selected.filter((item) => item !== value);
                            handleChange(q.name, newSelected);
                          }}
                          aria-label={label}
                        />
                      ) : (
                        <input
                          type="radio"
                          name={q.name}
                          value={value}
                          checked={responses[q.name] === value}
                          onChange={(e) => handleChange(q.name, e.target.value)}
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
      case "file":
        return (
          <div className="form-group">
            <label htmlFor={`file-input-${q.name}`}>
              {q.text}
              {q.required === "yes" && <span className="required">*</span>}
            </label>
            {q.description && <p className="description">{q.description}</p>}
            <div className="file-upload-wrapper">
              <input
                id={`file-input-${q.name}`}
                type="file"
                accept=".pdf,application/pdf"
                multiple={fileProperties.multiple === "yes"}
                onChange={(e) => handleChange(q.name, e.target.files)}
                className="file-input"
                aria-required={q.required === "yes"}
              />
              <label 
                htmlFor={`file-input-${q.name}`} 
                className="file-upload-label"
              >
                Choose {fileProperties.multiple === "yes" ? "Files" : "File"}
              </label>
              <div className="file-upload-hint">
                {fileProperties.multiple === "yes" 
                  ? "Click to select multiple PDF files"
                  : "Click to select a PDF file"}
              </div>
              {responses[q.name] && (
                <div className="selected-files">
                  Selected: {Array.from(responses[q.name]).map(f => f.name).join(', ')}
                </div>
              )}
            </div>
          </div>
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
        <button 
          onClick={handleGoToResponse}
          className="btn-response"
        >
          Go to Response
        </button>
        <div className="progress">
          {showReview 
            ? "Review your answers" 
            : `Question ${currentStep + 1} of ${questions.length}`}
        </div>
        {formError && <div className="error-message">{formError}</div>}
      </div>

      {questions.length === 0 && !formError ? (
        <div className="loading-state">
          <p>Loading questions...</p>
        </div>
      ) : submitted ? (
        <div className="confirmation">
          <h3>Thank you!</h3>
          <p>Your responses have been submitted successfully.</p>
          <button 
            className="btn-submit" 
            onClick={() => window.location.reload()}
          >
            Submit Another Response
          </button>
        </div>
      ) : showReview ? (
        <Review
          questions={questions}
          responses={responses}
          onEdit={(index) => {
            setCurrentStep(index);
            setShowReview(false);
          }}
          onSubmit={handleSubmit}
        />
      ) : (
        <form className="survey-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            {renderQuestion(questions[currentStep])}
            {errors[questions[currentStep]?.name] && (
              <div className="error-message">
                {errors[questions[currentStep].name]}
              </div>
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
              {currentStep === questions.length - 1 ? "Review" : "Next"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Survey;