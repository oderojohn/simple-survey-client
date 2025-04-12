import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE}/questions/`);  
    console.log("Fetched questions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    throw error;
  }
};

//send FormData directly
export const submitResponses = async (formData) => {
  console.log("Submitting responses:");

  // Log all key-value pairs in formData
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}:`, value.name, `(File)`);
    } else {
      console.log(`${key}:`, value);
    }
  }

  try {
    const response = await axios.post(`${API_BASE}/responses/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to submit responses:", error.response?.data || error.message);
    throw error;
  }
};


// Updated to handle pagination and filtering

export const fetchAllResponses = async ({ page = 1, pageSize = 5, email = "" } = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/responses/`, {
      params: {
        page,
        page_size: pageSize,
        email_address: email, 
      },
    });
    console.log("Fetched paginated/filtered responses:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    throw error;
  }
};




export const downloadCertificate = async (responseId) => {
  try {
    const response = await axios.get(`${API_BASE}/certificates/download/`, {
      params: { response_id: responseId },
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/);
    const filename = filenameMatch ? filenameMatch[1] : `certificates_${responseId}`;

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    // Check if the error has a response (server-side issue)
    if (error.response) {
      console.error("Failed to download certificates (Server Response):", error.response.data);
      console.error("HTTP Status Code:", error.response.status);
    } 
    // If there is no response (network or request issue)
    else {
      console.error("Failed to download certificates (Network/Request Error):", error.message);
    }

    // Re-throw the error for further handling if necessary
    throw error;
  }
};
