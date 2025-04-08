const useSurveyValidation = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateStep = (question, response) => {
    if (!question || question.required !== "yes") return true;

    switch (question.type) {
      case "short_text":
      case "long_text":
        return !!response?.trim();
      case "email":
        return !!response?.trim() && emailRegex.test(response);
      case "choice":
        if (question.options?.multiple === "yes") {
          return Array.isArray(response) && response.length > 0;
        }
        return !!response;
      case "file":
        if (!response || response.length === 0) return false;
        return Array.from(response).every(file => 
          file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf')
        );
      default:
        return true;
    }
  };

  const getErrorMessage = (question, response) => {
    if (question.type === "file") {
      if (!response || response.length === 0) {
        return "Please select at least one PDF file";
      }
      return "Only PDF files are allowed";
    }
    if (question.type === "email") {
      if (!response?.trim()) return "Email is required";
      return "Please enter a valid email address";
    }
    return "This field is required";
  };

  return { validateStep, getErrorMessage };
};

export default useSurveyValidation;
