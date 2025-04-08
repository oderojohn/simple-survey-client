import React, { useEffect, useState } from "react";
import { fetchQuestions, submitResponses } from "../../services/apiservice";
import { useNavigate } from "react-router-dom";
import SurveyReview from "./SurveyReview";
import QuestionRenderer from "./QuestionRenderer";
import SurveyNavigation from "./SurveyNavigation";
import SurveyConfirmation from "./SurveyConfirmation";
import useSurveyValidation from "../../hooks/useSurveyValidation";
import "../../assets/css/SurveyForm.css";

const Survey = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();
  const { validateStep, getErrorMessage } = useSurveyValidation();

  useEffect(() => {
    fetchQuestions()
      .then((data) => setQuestions(data.questions || []))
      .catch(() => setFormError("Failed to load survey questions"));
  }, []);

  const handleChange = (name, value) => {
    setResponses(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleNavigation = (direction) => {
    const currentQ = questions[currentStep];
    const currentResponse = responses[currentQ?.name];
    
    if (direction === 'next') {
      const isValid = validateStep(currentQ, currentResponse);
      
      if (!isValid) {
        const errorMsg = getErrorMessage(currentQ, currentResponse);
        setErrors(prev => ({ ...prev, [currentQ.name]: errorMsg }));
        return;
      }
    }

    if (direction === 'next') {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowReview(true);
      }
    } else {
      setCurrentStep(prev => Math.max(0, prev - 1));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
  
    questions.forEach((question) => {
      const response = responses[question.name];
      if (!validateStep(question, response)) {
        newErrors[question.name] = getErrorMessage(question, response);
      }
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstInvalid = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstInvalid}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
  
    const formData = new FormData();
    Object.entries(responses).forEach(([key, value]) => {
      if (value instanceof FileList || Array.isArray(value)) {
        Array.from(value).forEach(file => formData.append(key, file));
      } else {
        formData.append(key, value);
      }
    });
  
    try {
      await submitResponses(formData);
      setSubmitted(true);
    } catch (err) {
      setFormError(err.response?.data?.message || "Submission failed");
    }
  };
  
  return (
    <div className="survey-container">
      <div className="form-details">
        <h2>Answer Survey Questions</h2>
        <button onClick={() => navigate("/response")} className="btn-response">
          Go to Response
        </button>
        <div className="progress">
          {showReview ? "Review" : `Question ${currentStep + 1}/${questions.length}`}
        </div>
        {formError && <div className="error-message">{formError}</div>}
      </div>

      {questions.length === 0 && !formError ? (
        <div className="loading-state">Loading questions...</div>
      ) : submitted ? (
        <SurveyConfirmation onRestart={() => window.location.reload()} />
      ) : showReview ? (
        <SurveyReview
          questions={questions}
          responses={responses}
          onEdit={setCurrentStep}
          onSubmit={handleSubmit}
        />
      ) : (
        <form className="survey-form">
          <QuestionRenderer
            question={questions[currentStep]}
            responses={responses}
            handleChange={handleChange}
          />
          {errors[questions[currentStep]?.name] && (
            <div className="error-message">{errors[questions[currentStep].name]}</div>
          )}
          <SurveyNavigation
            currentStep={currentStep}
            totalSteps={questions.length}
            onPrevious={() => handleNavigation('previous')}
            onNext={() => handleNavigation('next')}
            hasErrors={!!errors[questions[currentStep]?.name]}
          />
        </form>
      )}
    </div>
  );
};

export default Survey;