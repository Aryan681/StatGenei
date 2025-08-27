import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { safeJsonResponse } from "./jsonEnco.js";
import cors from "cors";
import axios from "axios";
import FormData from "form-data";
import { getCache, setCache } from "./middleware/Redis.js"; // 👈 Import Redis functions

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());

// Health check
app.get("/", (req, res) => {
  return res.json({ message: "StatGenie API running (Node.js gateway)." });
});

// Simple HTML uploader
app.get("/upload_page", (req, res) => {
  res.send(`
    <form action="/clean_and_analyze" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Main endpoint
app.post("/clean_and_analyze", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return safeJsonResponse(res, { error: "No file uploaded" }, 400);
  }

  if (!req.file.originalname.toLowerCase().endsWith(".csv")) {
    try {
      fs.unlinkSync(req.file.path); // delete the invalid file
    } catch (e) {
      /* ignore */
    }
    return safeJsonResponse(res, { error: "Only CSV files allowed" }, 400);
  }
  
  // Create a unique cache key based on the file name
  const cacheKey = `analysis:${req.file.originalname}`;

  // Check if data exists in Redis cache
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    // Delete the temporary file before sending cached data
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }
    return safeJsonResponse(res, cachedData, 200);
  }

  // If not in cache, proceed with the API call
  const fileData = fs.createReadStream(req.file.path);
  const formData = new FormData();
  formData.append("file", fileData, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  const remoteUrl = "https://statgenie-163827097277.asia-south1.run.app/clean_and_analyze";

  try {
    const response = await axios.post(remoteUrl, formData, {
      headers: formData.getHeaders(),
    });

    // Save the response to Redis with an expiration time (e.g., 1 hour)
    await setCache(cacheKey, response.data, 3600);

    // Delete the temporary file after a successful request
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }

    return safeJsonResponse(res, response.data, response.status);
  } catch (err) {
    // Delete the temporary file on error
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }

    console.error("Remote API call failed:", err.message);
    const errorStatus = err.response ? err.response.status : 500;
    const errorData = err.response ? err.response.data : { error: "Failed to connect to the remote service" };
    return safeJsonResponse(res, errorData, errorStatus);
  }
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Node.js server running at http://localhost:3000");
});