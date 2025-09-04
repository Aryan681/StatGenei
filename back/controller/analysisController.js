import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { safeJsonResponse } from "../middleware/jsonEnco.js";
import { getCache, setCache } from "../middleware/Redis.js";
import { parseCsvFile } from "../utils/csvParser.js";
import dotenv from "dotenv";
dotenv.config();
const remoteUrl = process.env.MODLE_URL;

export const uploadPage = (req, res) => {
  res.send(`
        <form action="/clean_and_analyze" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit">Upload</button>
        </form>
    `);
};

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return safeJsonResponse(res, { error: "No file uploaded" }, 400);
  }

  if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }
    return safeJsonResponse(res, { error: "Only CSV files allowed" }, 400);
  }

  const cacheKey = `analysis:${req.file.originalname}`;
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }
    return safeJsonResponse(res, cachedData, 200);
  }

  let flatData;
  try {
    flatData = await parseCsvFile(req.file.path);
    if (flatData.length === 0) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        /* ignore */
      }
      return safeJsonResponse(res, { error: "CSV file is empty." }, 400);
    }
  } catch (err) {
    console.error("Failed to parse CSV file:", err.message);
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }
    return safeJsonResponse(
      res,
      { error: "Failed to read or parse the CSV file." },
      500
    );
  }

  const fileData = fs.createReadStream(req.file.path);
  const formData = new FormData();
  formData.append("file", fileData, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  try {
    const response = await axios.post(remoteUrl, formData, {
      headers: formData.getHeaders(),
    });

    const analysisData = response.data;
    await setCache(cacheKey, analysisData, 3600);

    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }

    return safeJsonResponse(res, analysisData, response.status);
  } catch (err) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }

    console.error("Remote API call failed:", err.message);
    const errorStatus = err.response?.status || 500;
    const errorData =
      err.response?.data || {
        error: "Failed to connect to the remote service",
      };
    return safeJsonResponse(res, errorData, errorStatus);
  }
};