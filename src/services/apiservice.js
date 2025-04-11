import axios from "axios";

const API_BASE = "https://sky-survey-backend.onrender.com/api";

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

// Updated to send FormData directly
export const submitResponses = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE}/responses/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
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


// export const downloadCertificate = async (certificateId) => {
//   try {
//     const response = await axios.get(`${API_BASE}/download-certificate/${certificateId}/`, {
//       responseType: 'blob',
//     });

//     const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `certificate_${certificateId}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (error) {
//     console.error("Failed to download certificate:", error.response?.data || error.message);
//     throw error;
//   }
// };

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
    console.error("Failed to download certificates:", error.response?.data || error.message);
    throw error;
  }
};
