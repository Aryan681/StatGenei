// routes/analysis.js
import { Router } from "express";
import multer from "multer";
import { uploadFile, uploadPage, } from "../controller/analysisController.js"; 
import {filterData }from "../controller/FilterController.js"
import {DownloadData} from "../controller/DownloadContainer.js"
const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/upload_page", uploadPage);

router.post("/clean_and_analyze", upload.single("file"), uploadFile);

router.post("/filter",filterData);
router.post("/download",DownloadData);


export default router;