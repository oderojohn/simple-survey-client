import React, { useEffect, useState } from "react";
import { fetchQuestions, submitResponses } from "../../services/apiservice";
import SurveyForm from "./SurveyForm";
import SurveyReview from "./SurveyReview";
import { useNavigate } from "react-router-dom";
import "../../assets/css/SurveyForm.css";
import Swal from "sweetalert2";

const SurveyContainer = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [formError, setFormError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: 'Loading questions...',
      text: 'Please wait while we fetch the survey questions.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,  
    });

    fetchQuestions()
      .then((data) => {
        setQuestions(data.questions || []);
        Swal.close(); 
      })
      .catch(() => {
        setFormError("Failed to load survey questions.");
        Swal.close(); 
      });
  }, []);

  const handleChange = (name, value) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleGoToResponse = () => navigate("/response");

  const handleSubmit = () => {
    
    Swal.fire({
      title: 'Submitting...',
      text: 'Please wait while we submit your responses.',
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,  
    });

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

        
        Swal.fire({
          title: 'Success!',
          text: 'Your responses have been submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .catch((err) => {
        setFormError(err.response?.data?.message || "Submission failed.");

        
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to submit your responses.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

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
          <div className="response-summary">
            <p><strong>Full Name:</strong> {apiResponse.full_name}</p>
            <p><strong>Email Address:</strong> {apiResponse.email_address}</p>
            <p><strong>Description:</strong> {apiResponse.description}</p>
            <p><strong>Gender:</strong> {apiResponse.gender}</p>
            <p><strong>Programming Stack:</strong> {apiResponse.programming_stack}</p>
            <p><strong>Certificate Files:</strong></p>
            <ul>
              {apiResponse.certificate_files?.map((file, idx) => (
                <li key={idx}>{file.file_name}</li>
              ))}
            </ul>
            <p><strong>Date Responded:</strong> {new Date(apiResponse.date_responded).toLocaleString()}</p>
          </div>
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
