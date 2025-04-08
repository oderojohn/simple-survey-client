import React from "react";

const SurveyForm = ({
  questions,
  responses,
  errors,
  currentStep,
  setCurrentStep,
  handleChange,
  setErrors,
  setShowReview,
}) => {
  const question = questions[currentStep];

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateCurrentStep = () => {
    if (!question) return true;
    const response = responses[question.name];

    if (!question.required) return true;

    switch (question.type) {
      case "short_text":
      case "long_text":
        return typeof response === "string" && response.trim().length > 0;

      case "email": {
        const email = (response || "").trim();
        return email !== "" && isValidEmail(email);
      }

      case "choice":
        return question.options?.multiple === "yes"
          ? Array.isArray(response) && response.length > 0
          : !!response;

      case "file":
        if (!response || response.length === 0) return false;
        return Array.from(response).every(
          (file) =>
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf")
        );

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      let errorMsg = "This field is required";
      const response = responses[question.name];

      if (question.type === "email") {
        errorMsg = response?.trim()
          ? "Please enter a valid email address"
          : "This field is required";
      } else if (question.type === "file") {
        errorMsg = !response?.length
          ? "Please select at least one PDF file"
          : "Only PDF files are allowed";
      }

      setErrors((prev) => ({ ...prev, [question.name]: errorMsg }));
      return;
    }

    setErrors((prev) => ({ ...prev, [question.name]: null }));

    currentStep < questions.length - 1
      ? setCurrentStep(currentStep + 1)
      : setShowReview(true);
  };

  const handlePrevious = () => setCurrentStep(Math.max(0, currentStep - 1));

  const renderInput = () => {
    if (!question) return null;
    const value = responses[question.name] || "";

    const commonProps = {
      id: question.name,
      value: value,
      onChange: (e) => handleChange(question.name, e.target.value),
      className: errors[question.name] ? "error" : "",
    };

    const label = (
      <label htmlFor={question.name}>
        {question.text}{" "}
        {question.required && <span className="required">*</span>}
      </label>
    );

    switch (question.type) {
      case "short_text":
      case "email":
        return (
          <div className="form-group">
            {label}
            <input
              type={question.type === "email" ? "email" : "text"}
              {...commonProps}
            />
          </div>
        );

      case "long_text":
        return (
          <div className="form-group">
            {label}
            <textarea {...commonProps} />
          </div>
        );

      case "choice":
        return (
          <fieldset className="form-group">
            <legend>
              {question.text}
              {question.required && <span className="required">*</span>}
            </legend>
            {question.options.map((opt) => {
              const value = typeof opt === "object" ? opt.value : opt;
              const label = typeof opt === "object" ? opt.text : opt;
              const isMultiple = question.options?.multiple === "yes";

              const checked = isMultiple
                ? (responses[question.name] || []).includes(value)
                : responses[question.name] === value;

              return (
                <label key={value} className="option-item">
                  <input
                    type={isMultiple ? "checkbox" : "radio"}
                    name={question.name}
                    value={value}
                    checked={checked}
                    onChange={(e) => {
                      let updated;
                      if (isMultiple) {
                        const prev = responses[question.name] || [];
                        updated = e.target.checked
                          ? [...prev, value]
                          : prev.filter((v) => v !== value);
                      } else {
                        updated = value;
                      }
                      handleChange(question.name, updated);
                    }}
                  />
                  {label}
                </label>
              );
            })}
          </fieldset>
        );

      case "file":
        return (
          <div className="form-group">
            {label}
            <input
              type="file"
              multiple={question.file_properties?.multiple === true}
              accept=".pdf,application/pdf"
              onChange={(e) => handleChange(question.name, e.target.files)}
              className={errors[question.name] ? "error" : ""}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form className="survey-form" onSubmit={(e) => e.preventDefault()}>
      {renderInput()}
      {errors[question?.name] && (
        <div className="error-message">{errors[question.name]}</div>
      )}
      <div className="navigation-buttons">
        {currentStep > 0 && (
          <button type="button" onClick={handlePrevious} className="btn-prev">
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="btn-next"
          disabled={!question}
        >
          {currentStep === questions.length - 1 ? "Review" : "Next"}
        </button>
      </div>
    </form>
  );
};

export default SurveyForm;
