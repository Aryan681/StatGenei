import axios from "axios";
import { safeJsonResponse } from "../middleware/jsonEnco.js";
import dotenv from "dotenv";
dotenv.config(); 

const remoteFilterUrl = process.env.FILTER_URL;

export const filterData = async (req, res) => {
  const { job_id, filters } = req.body;

  if (!job_id || !filters) {
    return safeJsonResponse(
      res,
      { error: "Job ID and filters are required." },
      400
    );
  }

  try {
    const response = await axios.post(remoteFilterUrl, {
      job_id,
      filters,
    });
    return safeJsonResponse(res, response.data, response.status);
  } catch (err) {
    console.error("Remote filter API call failed:", err.message);
    const errorStatus = err.response?.status || 500;
    const errorData = err.response?.data || {
      error: "Failed to connect to the remote filtering service",
    };
    return safeJsonResponse(res, errorData, errorStatus);
  }
};