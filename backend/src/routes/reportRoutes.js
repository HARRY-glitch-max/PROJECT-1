import express from "express";
import { generateReport, getReports, getReportById } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate a new report (admin only)
router.post("/generate", protect, generateReport);

// Get all reports for logged-in admin
router.get("/", protect, getReports);

// Get a specific report by ID
router.get("/:id", protect, getReportById);

export default router;
