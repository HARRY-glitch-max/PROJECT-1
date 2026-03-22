import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

// Import routes
import userRoutes from "./routes/userRoutes.js";
 import employerRoutes from "./routes/employerRoutes.js";
 import jobRoutes from "./routes/jobRoutes.js";
 import applicationRoutes from "./routes/applicationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";   
import adminRoutes from "./routes/adminRoutes.js";   
import testRoutes from "./routes/testRoutes.js";     

// Import error middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.ALLOWED_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl/Postman
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS policy blocked this origin."), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- ROUTES ---
 app.use("/api/users", userRoutes); 
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interviews", interviewRoutes);
 app.use("/api/admin", adminRoutes); 
app.use("/api/test", testRoutes);     

// Health-check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is alive" });
});

// Default route
app.get("/", (req, res) => {
  res.send("Job Connect API is running...");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
    });

    // Graceful shutdown logic
    const shutdown = () => {
      console.log("Shutting down server...");
      server.close(() => {
        console.log("HTTP server closed.");
        mongoose.connection.close(false, () => {
          console.log("MongoDB connection closed.");
          process.exit(0);
        });
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Catch unhandled errors
    process.on("uncaughtException", err => {
      console.error("Uncaught Exception:", err);
    });
    process.on("unhandledRejection", err => {
      console.error("Unhandled Rejection:", err);
    });

  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();
