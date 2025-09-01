// api.js
import axios from 'axios'; // Ensure you're using your custom axios instance

const API_UPLOAD_URL = "http://localhost:3000/clean_and_analyze";
const API_FILTER_URL = "http://localhost:3000/filter"; // New endpoint

export const uploadFileAndAnalyze = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(API_UPLOAD_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// New function for filtering data
export const getFilteredData = async (dataId, filters) => {
  const response = await axios.post(API_FILTER_URL, { dataId, filters });
  return response.data;
};