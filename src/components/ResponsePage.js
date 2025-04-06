import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/css/SurveyForm.css";

const ResponsePage = () => {
  const location = useLocation();
  const formData = location.state || {};
  const navigate = useNavigate();

  return (
    <div className="survey-container">
      <div className="form-glass-container">
        <div className="response-header">
          <h1>Survey Response</h1>
          <button 
            className="back-to-form-btn"
            onClick={() => navigate('/')}
          >
            Back to Form
          </button>
        </div>

        <div className="response-card">
          {Object.keys(formData).length > 0 ? (
            <>
              <h2>Thank you for your submission, {formData.fullName}!</h2>
              <div className="response-details">
                <div className="detail-group">
                  <label>Email:</label>
                  <p>{formData.email}</p>
                </div>
                <div className="detail-group">
                  <label>Description:</label>
                  <p>{formData.description}</p>
                </div>
                <div className="detail-group">
                  <label>Gender:</label>
                  <p>{formData.gender}</p>
                </div>
                <div className="detail-group">
                  <label>Programming Stack:</label>
                  <p>{formData.programmingStack.join(", ")}</p>
                </div>
                <div className="detail-group">
                  <label>Certificates Uploaded:</label>
                  <p>{formData.certificates.length} files</p>
                </div>
              </div>
            </>
          ) : (
            <div className="no-data">
              <h2>No submission data found</h2>
              <p>Please complete the form first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsePage;