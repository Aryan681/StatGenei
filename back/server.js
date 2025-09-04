// server.js
import express from "express";
import cors from "cors";
import analysisRoutes from "./Routes/Clear&Anylasise.js";
import dotenv from "dotenv";
import { rateLimit } from "./middleware/Redis.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "StatGenie API running (Node.js gateway)." });
});

// Rate-limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.ip;
  const limit = 100; 
  const windowInSeconds = 3600; 

  const isAllowed = await rateLimit(userId, limit, windowInSeconds);

  if (!isAllowed) {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  }

  next();
};

app.use(rateLimitMiddleware);

app.use(analysisRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on port ${PORT}`);
});