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
  const navigate = useNavigate();

  const handleGoToResponse = () => {
    navigate("/response");
  };

  useEffect(() => {
    fetchQuestions()
      .then(data => {
        setQuestions(data.questions || []);
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
      setShowReview(true);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };
  const handleSubmit = () => {
    const formData = new FormData();
    console.log("Submitting responses:", responses);
  
    // Iterate over the responses and append them to FormData
    Object.entries(responses).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach(file => formData.append(key, file));
      } else if (Array.isArray(value)) {
        value.forEach(item => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });
  
    // Log the FormData entries (this is a workaround since FormData isn't directly printable)
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    // Now call submitResponses to send FormData
    submitResponses(formData)
      .then(() => setSubmitted(true))
      .catch(err => console.error("Error submitting responses:", err));
  };
  
  

  const Review = ({ questions, responses, onEdit, onSubmit }) => {
    const formatResponse = (question, response) => {
      if (!response) return "No response";
      
      switch(question.type) {
        case 'choice':
          return question.options.multiple === "yes" 
            ? response.join(", ")
            : response;
        case 'file':
          return Array.from(response).map(file => file.name).join(", ");
        default:
          return response;
      }
    };

    return (
      <div className="review-container">
        <h3>Review Your Answers</h3>
        {questions.map((q, index) => (
          <div key={q.name} className="review-item">
            <h4>{q.text}{q.required === "yes" && <span className="required">*</span>}</h4>
            <p>{formatResponse(q, responses[q.name])}</p>
            <button 
              className="btn-edit"
              onClick={() => onEdit(index)}
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
        <button onClick={handleGoToResponse}>Go to Response</button>

        <div className="progress">
          {showReview ? (
            "Review your answers"
          ) : (
            `Question ${currentStep + 1} of ${questions.length}`
          )}
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
              {currentStep === questions.length - 1 ? "Review" : "Next"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Survey;
