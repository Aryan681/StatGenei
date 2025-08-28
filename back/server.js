// server.js
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
import { getCache, setCache } from "./middleware/Redis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Add JSON body parsing

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

// Helper function to decode base64 data
function decodeBase64Array(base64Data, dtype) {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    
    switch(dtype) {
      case 'i4': // int32
        const intArray = new Int32Array(buffer.buffer);
        return Array.from(intArray);
      case 'f8': // float64
        const floatArray = new Float64Array(buffer.buffer);
        return Array.from(floatArray);
      case 'i8': // int64
        const bigIntArray = new BigInt64Array(buffer.buffer);
        return Array.from(bigIntArray).map(Number);
      default:
        // Try to parse as JSON first, then fall back to string
        try {
          return JSON.parse(buffer.toString());
        } catch {
          return buffer.toString();
        }
    }
  } catch (error) {
    console.error("Error decoding base64 data:", error);
    return [];
  }
}

// Helper function to encode data to base64
function encodeBase64Array(data, dtype) {
  try {
    let buffer;
    
    switch(dtype) {
      case 'i4': // int32
        const intArray = new Int32Array(data);
        buffer = Buffer.from(intArray.buffer);
        break;
      case 'f8': // float64
        const floatArray = new Float64Array(data);
        buffer = Buffer.from(floatArray.buffer);
        break;
      case 'i8': // int64
        const bigIntArray = new BigInt64Array(data.map(BigInt));
        buffer = Buffer.from(bigIntArray.buffer);
        break;
      default:
        // For string data, convert to JSON string
        buffer = Buffer.from(JSON.stringify(data));
    }
    
    return buffer.toString('base64');
  } catch (error) {
    console.error("Error encoding data to base64:", error);
    return "";
  }
}

// Enhanced filtering function
function filterChartData(analysisData, filters) {
  const filteredData = JSON.parse(JSON.stringify(analysisData));
  
  if (!analysisData.charts || Object.keys(filters).length === 0) {
    return filteredData;
  }

  // Filter charts based on the provided criteria
  Object.keys(analysisData.charts).forEach(chartType => {
    const chart = filteredData.charts[chartType];
    
    if (chart.data && Array.isArray(chart.data)) {
      chart.data.forEach(trace => {
        // Decode data if it's in base64 format
        let xData = trace.x;
        let yData = trace.y;
        
        if (trace.x && trace.x.bdata) {
          xData = decodeBase64Array(trace.x.bdata, trace.x.dtype);
        }
        
        if (trace.y && trace.y.bdata) {
          yData = decodeBase64Array(trace.y.bdata, trace.y.dtype);
        }
        
        // If we have array data, filter it
        if (Array.isArray(xData)) {
          const filteredX = [];
          const filteredY = [];
          
          for (let i = 0; i < xData.length; i++) {
            let include = true;
            
            // Check all filter criteria
            for (const [filterKey, filterValue] of Object.entries(filters)) {
              const normalizedFilterKey = filterKey.trim();
              
              // Check different places where the filter might be applied
              // The client passes a single value, not an array of values
              if (trace.text && trace.text[i] && 
                  trace.text[i].includes(normalizedFilterKey) && 
                  trace.text[i] !== filterValue) {
                include = false;
                break;
              }
              
              if (trace.x && trace.x.bdata && xData[i] && xData[i] !== filterValue) {
                include = false;
                break;
              }

              if (trace.y && trace.y.bdata && yData[i] && yData[i] !== filterValue) {
                include = false;
                break;
              }

              // Check customdata if it exists
              if (trace.customdata && trace.customdata[i]) {
                const customData = trace.customdata[i];
                if (customData[normalizedFilterKey] && 
                    customData[normalizedFilterKey] !== filterValue) {
                  include = false;
                  break;
                }
              }
            }
            
            if (include) {
              filteredX.push(xData[i]);
              if (Array.isArray(yData) && i < yData.length) {
                filteredY.push(yData[i]);
              }
            }
          }
          
          // Re-encode the filtered data if needed
          if (trace.x && trace.x.bdata) {
            trace.x.bdata = encodeBase64Array(filteredX, trace.x.dtype);
          } else {
            trace.x = filteredX;
          }
          
          if (trace.y && trace.y.bdata && filteredY.length > 0) {
            trace.y.bdata = encodeBase64Array(filteredY, trace.y.dtype);
          } else if (Array.isArray(yData) && filteredY.length > 0) {
            trace.y = filteredY;
          }
        }
      });
    }
  });
  
  // Also update summary statistics based on filtered data
  updateSummaryStatistics(filteredData);
  
  return filteredData;
}

// Helper function to update summary statistics after filtering
function updateSummaryStatistics(filteredData) {
  // This would need to be implemented based on your specific data structure
  // For now, we'll just add a note that data has been filtered
  if (filteredData.data_story) {
    filteredData.data_story += " [Data has been filtered]";
  }
}

// Main endpoint
app.post("/clean_and_analyze", upload.single("file"), async (req, res) => {
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

    await setCache(cacheKey, response.data, 3600);

    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      /* ignore */
    }

    return safeJsonResponse(res, response.data, response.status);
  } catch (err) {
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

// **Updated** endpoint for filtering charts - accepts data, not a file
app.post("/filter_charts", async (req, res) => {
  // The client should send the full analysis data and the filter criteria in the body
  const { analysisData, filters } = req.body;
  
  if (!analysisData || !filters) {
    return safeJsonResponse(res, { error: "analysisData and filters are required" }, 400);
  }

  // Create a unique cache key based on the original file name and filters
  // This requires the client to send the original file name as well
  const originalFileName = analysisData.originalFileName;
  const filterString = JSON.stringify(filters);
  const cacheKey = `filtered:${originalFileName}:${filterString}`;
  
  // Check cache first
  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    return safeJsonResponse(res, cachedData, 200);
  }

  try {
    // Filter the data based on the provided filters
    const filteredData = filterChartData(analysisData, filters);

    // Save the filtered data to Redis cache
    await setCache(cacheKey, filteredData, 3600);

    return safeJsonResponse(res, filteredData, 200);
  } catch (error) {
    console.error("Filtering failed:", error.message);
    return safeJsonResponse(res, { error: "Failed to filter data" }, 500);
  }
});

// Alternative endpoint that accepts analysis data directly (for testing)
app.post("/filter_charts_direct", (req, res) => {
  const { analysisData, filters } = req.body;
  
  if (!analysisData || !filters) {
    return safeJsonResponse(res, { error: "analysisData and filters are required" }, 400);
  }

  try {
    const filteredData = filterChartData(analysisData, filters);
    return safeJsonResponse(res, filteredData, 200);
  } catch (error) {
    console.error("Direct filtering failed:", error.message);
    return safeJsonResponse(res, { error: "Failed to filter data" }, 500);
  }
});


// Start server
app.listen(3000, () => {
  console.log("🚀 Node.js server running at http://localhost:3000");
});