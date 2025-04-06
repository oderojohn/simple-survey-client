import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE}/questions/`);  // Correct endpoint for fetching questions
    console.log("Fetched questions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    throw error;
  }
};

// ✅ Updated to send FormData directly
export const submitResponses = async (formData) => {
  console.log("Submitting responses:");
  
  // Log each form data entry
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await axios.post(`${API_BASE}/responses/`, formData, {  // Changed to POST
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Submitted successfully:", response.data);
  } catch (error) {
    console.error("Failed to submit responses:", error);
    throw error;
  }
};
