import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByEmployer
} from "../controllers/jobController.js";

import {
  bookInterview,
  getInterviewsByJob
} from "../controllers/interviewController.js";

// ✅ Middleware imported to handle JWT verification and Role checking
import { protect, employerProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Job routes ---
// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);
router.get("/employer/:employerId", getJobsByEmployer);

// Protected Employer routes for Job Management
router.post("/", protect, employerProtect, createJob);
router.put("/:id", protect, employerProtect, updateJob);
router.delete("/:id", protect, employerProtect, deleteJob);

// --- Interview routes ---
/**
 * @route   POST /api/jobs/:jobId/interviews
 * @desc    Schedule a new interview for a specific job
 * @access  Private (Employer only)
 */
router.post("/:jobId/interviews", protect, employerProtect, bookInterview);

/**
 * @route   GET /api/jobs/:jobId/interviews
 * @desc    Get all interviews associated with a specific job
 * @access  Private (Employer only)
 */
router.get("/:jobId/interviews", protect, employerProtect, getInterviewsByJob);

export default router;