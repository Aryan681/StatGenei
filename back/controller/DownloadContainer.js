import axios from "axios";
import { safeJsonResponse } from "../middleware/jsonEnco.js";
import dotenv from "dotenv";
dotenv.config();
const remoteDownloadUrl = process.env.DOWNLOAD_URL;

export const DownloadData = async (req, res) => {
  const { job_id, filters } = req.body;

  if (!job_id) {
    return safeJsonResponse(
      res,
      { error: "Job ID is required for downloading a report." },
      400
    );
  }

  try {
    const response = await axios.post(
      remoteDownloadUrl,
      { job_id, filters },
      {
        responseType: "arraybuffer", // handle PDF/binary
        headers: { "Content-Type": "application/json" },
      }
    );

    const reportData = response.data;
    const contentType = response.headers["content-type"] || "application/pdf";

    // ✅ dynamic filename
    const filename = `analysis_report_${job_id}_${Date.now()}.pdf`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("x-filename", filename); // custom header (frontend reads this)
    res.status(response.status).end(reportData);
  } catch (err) {
    console.error("Remote download API call failed:", err.message);
    const errorStatus = err.response?.status || 500;
    const errorData =
      err.response?.data || {
        error: "Failed to connect to the remote service or generate PDF.",
      };
    return safeJsonResponse(res, errorData, errorStatus);
  }
};
