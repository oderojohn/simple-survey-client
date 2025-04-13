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
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILES_ALLOWED = 10;

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

        const files = Array.from(response);
        if (files.length > MAX_FILES_ALLOWED) return false;

        return files.every(
          (file) =>
            file.size <= MAX_FILE_SIZE_MB * 1024 * 1024 &&
            (file.type === "application/pdf" ||
              file.name.toLowerCase().endsWith(".pdf"))
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
        const files = Array.from(response || []);
        if (files.length === 0) {
          errorMsg = "Please select at least one PDF file";
        } else if (files.length > MAX_FILES_ALLOWED) {
          errorMsg = `You can upload a maximum of ${MAX_FILES_ALLOWED} files`;
        } else if (
          files.some((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
        ) {
          errorMsg = `Each file must be less than ${MAX_FILE_SIZE_MB}MB`;
        } else {
          errorMsg = "Only PDF files are allowed";
        }
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
      placeholder:
        question.type === "email"
          ? "Enter your email address"
          : question.type === "short_text" &&
            question.text.toLowerCase().includes("name")
          ? "Enter your Surname , FirstName & OtherNames"
          : undefined,
    };

    const label = (
      <label htmlFor={question.name}>
        {question.text} {question.required && <span className="required">*</span>}
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
        const isMultiple = question.name === "programming_stack";

        return (
          <fieldset className="form-group">
            <legend>
              {question.text}
              {question.required && <span className="required">*</span>}
            </legend>
            {question.description && (
              <p className="question-description">{question.description}</p>
            )}
            {question.options.map((opt) => {
              const value = typeof opt === "object" ? opt.value : opt;
              const label = typeof opt === "object" ? opt.text : opt;

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
        const allowMultiple = question.name === "certificates";
        const selectedFiles = Array.from(responses[question.name] || []);

        return (
          <div className="form-group">
            <label>
              {question.text}
              {question.required && <span className="required">*</span>}
            </label>
            {question.description && (
              <p className="question-description">{question.description}</p>
            )}
            <div className="selected-files">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = selectedFiles.filter((_, i) => i !== index);
                      handleChange(question.name, updated);
                    }}
                    className="remove-file"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-file-btn"
              onClick={() => document.getElementById(`${question.name}-input`).click()}
            >
              + Add File
            </button>
            <input
              id={`${question.name}-input`}
              type="file"
              multiple={allowMultiple}
              accept=".pdf,application/pdf"
              style={{ display: "none" }}
              onChange={(e) => {
                const newFiles = Array.from(e.target.files);
                const existingFiles = Array.from(responses[question.name] || []);
                const allFiles = [...existingFiles, ...newFiles];

                if (allFiles.length > MAX_FILES_ALLOWED) {
                  setErrors((prev) => ({
                    ...prev,
                    [question.name]: `Max ${MAX_FILES_ALLOWED} files allowed.`,
                  }));
                } else if (
                  allFiles.some((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
                ) {
                  setErrors((prev) => ({
                    ...prev,
                    [question.name]: `Each file must be under ${MAX_FILE_SIZE_MB}MB`,
                  }));
                } else {
                  setErrors((prev) => ({ ...prev, [question.name]: null }));
                  handleChange(question.name, allFiles);
                }

                e.target.value = null;
              }}
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
