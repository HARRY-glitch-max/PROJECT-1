import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

// Load environment variables at the very top
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Configure CORS to only allow the specified origin from .env
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you plan to send cookies/auth headers
  })
);

app.use(express.json());

// Root endpoint
app.get("/", (req, res) => res.send("JobLink API running..."));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
