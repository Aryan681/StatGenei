// server.js
import express from "express";
import cors from "cors";
import analysisRoutes from "./Routes/Clear&Anylasise.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "StatGenie API running (Node.js gateway)." });
});

// Mount the analysis routes
app.use(analysisRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on port ${PORT}`);
});