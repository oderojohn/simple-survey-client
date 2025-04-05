import React, { useState } from "react";
import "../assets/css/SurveyForm.css";

const SurveyForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    description: "",
    gender: "",
    programmingStack: [],
    certificates: []
  });

  const steps = [
    "Full Name",
    "Email Address",
    "Description",
    "Gender",
    "Programming Stack",
    "Certificates",
    "Preview & Submit"
  ];

  const handleNext = () => {
    if (currentStep === 0 && !formData.fullName) {
      alert("Please enter your full name.");
      return;
    }
    if (currentStep === 1 && !formData.email) {
      alert("Please enter your email address.");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData);
    alert("Form submitted! Check the console for details.");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for programming stack (multiple selections)
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      let updatedStack = [...prev.programmingStack];
      if (checked) {
        updatedStack.push(value);
      } else {
        updatedStack = updatedStack.filter((item) => item !== value);
      }
      return { ...prev, programmingStack: updatedStack };
    });
  };

  // Handle file upload changes
  const handleFileUpload = (e) => {
    setFormData((prev) => ({ ...prev, certificates: [...e.target.files] }));
  };

  return (
    <div className="survey-container">
      {/* Form Details Section */}
      <div className="form-details">
        <h2>Survey Form</h2>
        <p>Please fill out the following details. This form will help us get to know more about you and your skills. You can review your information before submitting.</p>
      </div>

      <div className="step-header">
        <h2>{steps[currentStep]}</h2>
        <div className="progress-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="survey-form">
        {/* Step 1: Full Name */}
        {currentStep === 0 && (
          <div className="form-group">
            <label htmlFor="fullName">What is your full name?</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="e.g., Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {currentStep === 1 && (
          <div className="form-group">
            <label htmlFor="email">What is your email address?</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g., janedoe@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-group">
            <label htmlFor="description">Tell us a bit more about yourself</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-group">
            <label htmlFor="gender">What is your gender?</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-group">
            <label>What programming stack are you familiar with?</label>
            <p>You can select multiple</p>
            <div className="checkbox-group">
              {[
                { value: "REACT", label: "React JS" },
                { value: "ANGULAR", label: "Angular JS" },
                { value: "VUE", label: "Vue JS" },
                { value: "SQL", label: "SQL" },
                { value: "POSTGRES", label: "Postgres" },
                { value: "MYSQL", label: "MySQL" },
                { value: "MSSQL", label: "Microsoft SQL Server" },
                { value: "Java", label: "Java" },
                { value: "PHP", label: "PHP" },
                { value: "GO", label: "Go" },
                { value: "RUST", label: "Rust" }
              ].map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    value={option.value}
                    onChange={handleCheckbox}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="form-group">
            <label>Upload any of your certificates? (.pdf only)</label>
            <p>You can upload multiple (.pdf, max 1MB each)</p>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              required
            />
          </div>
        )}

        {currentStep === 6 && (
          <div className="form-group preview">
            <h3>Review Your Information</h3>
            <p>
              <strong>Full Name:</strong> {formData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Description:</strong> {formData.description}
            </p>
            <p>
              <strong>Gender:</strong> {formData.gender}
            </p>
            <p>
              <strong>Programming Stack:</strong> {formData.programmingStack.join(", ")}
            </p>
            <p>
              <strong>Certificates:</strong> {formData.certificates.length} file(s) selected
            </p>
          </div>
        )}

        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button type="button" onClick={handlePrev} className="btn-prev">
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button type="button" onClick={handleNext} className="btn-next">
              Next
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button type="submit" className="btn-submit">
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
