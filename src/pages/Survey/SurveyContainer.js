import React, { useEffect, useState } from "react";
import { fetchQuestions, submitResponses } from "../../services/apiservice";
import SurveyForm from "./SurveyForm";
import SurveyReview from "./SurveyReview";
import { useNavigate } from "react-router-dom";
import "../../assets/css/SurveyForm.css";

const SurveyContainer = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState(null);


  useEffect(() => {
    fetchQuestions()
      .then((data) => setQuestions(data.questions || []))
      .catch((err) => setFormError("Failed to load survey questions."));
  }, []);

  const handleChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleGoToResponse = () => navigate("/response");

  const handleSubmit = () => {
    const formData = new FormData();
    Object.entries(responses).forEach(([key, value]) => {
      if (key === 'certificates') {
        Array.from(value).forEach(file => formData.append('certificates', file));
      } else {
        formData.append(key, value);
      }
    });
    submitResponses(formData)
  .then((data) => {
    setApiResponse(data);
    setSubmitted(true);
  })
  .catch((err) =>
    setFormError(err.response?.data?.message || "Submission failed.")
  );

  return (
    <div className="survey-container">
      <div className="form-details">
        <h2>Answer Survey Questions</h2>
        <button onClick={handleGoToResponse} className="btn-response">Go to Response</button>
        <div className="progress">
          {showReview ? "Review your answers" : `Question ${currentStep + 1} of ${questions.length}`}
        </div>
        {formError && <div className="error-message">{formError}</div>}
      </div>

      {questions.length === 0 && !formError ? (
        <p>Loading questions...</p>
      ) : submitted ? (
          <div className="confirmation">
    <h3>Thank you!</h3>
    <p>Your responses have been submitted successfully.</p>
    <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
    <button className="btn-submit" onClick={() => window.location.reload()}>
      Submit Another Response
    </button>
  </div>
      ) : showReview ? (
        <SurveyReview
          questions={questions}
          responses={responses}
          onEdit={(index) => {
            setCurrentStep(index);
            setShowReview(false);
          }}
          onSubmit={handleSubmit}
        />
      ) : (
        <SurveyForm
          questions={questions}
          responses={responses}
          errors={errors}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          handleChange={handleChange}
          setErrors={setErrors}
          setShowReview={setShowReview}
        />
      )}
    </div>
  );
};

export default SurveyContainer;
