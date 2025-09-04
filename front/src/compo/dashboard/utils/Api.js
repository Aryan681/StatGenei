// api.js
import axios from "axios";

const API_UPLOAD_URL = `${import.meta.env.VITE_BACKEND_URL}/clean_and_analyze`;
const API_FILTER_URL = `${import.meta.env.VITE_BACKEND_URL}/filter`;
const API_DOWNLOAD_URL = `${import.meta.env.VITE_BACKEND_URL}/download`;

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

// New function for filtering data, updated to match backend
export const getFilteredData = async (jobId, filters) => {
  const response = await axios.post(API_FILTER_URL, { job_id: jobId, filters });
  return response.data;
};

export const downloadReport = async (jobId, filters) => {
  const response = await axios.post(
    API_DOWNLOAD_URL, 
    { job_id: jobId, filters },
    { responseType: "blob" } 
  );

  const blob = new Blob([response.data], {
    type: response.headers["content-type"],
  });
  const url = window.URL.createObjectURL(blob);

  const filename =
    response.headers["x-filename"] || `analysis_report_${Date.now()}.pdf`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);

  return true;
};
