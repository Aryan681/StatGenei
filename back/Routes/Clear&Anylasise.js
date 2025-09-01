// routes/analysis.js
import { Router } from "express";
import multer from "multer";
// Import the new filterData function from the controller
import { uploadFile, uploadPage, filterData } from "../controller/analysisController.js"; 

const router = Router();
const upload = multer({ dest: "uploads/" });

// Simple HTML uploader for testing purposes
router.get("/upload_page", uploadPage);

// Main endpoint for file upload, analysis, and caching
router.post("/clean_and_analyze", upload.single("file"), uploadFile);

// New endpoint to handle filtering
// Use POST because it sends data in the request body
router.post("/filter", filterData);

export default router;