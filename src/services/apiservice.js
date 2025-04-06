import axios from "axios";

const API_BASE = "https://5d7289d1-e281-4ffd-9e97-213a05bf3426.mock.pstmn.io/survey/allquestions";

export const fetchQuestions = async () => {
  try {
    const response = await axios.get(API_BASE);
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
    const response = await axios.put(`${API_BASE}/responses`, formData, {
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
