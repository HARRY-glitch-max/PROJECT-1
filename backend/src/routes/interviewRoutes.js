// routes/interviewRoutes.js
import express from "express";
import {
  bookInterview,
  getInterviewsByJob,
  getInterviewsByUser,
  getInterviewById,
  submitInterviewResult,
  getInterviewResult
} from "../controllers/interviewController.js";
import { protect, employerProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employer books interview
router.post("/book", employerProtect, bookInterview);

// Employer views interviews for a job
router.get("/job/:jobId", protect, getInterviewsByJob);

// Candidate views their interviews
router.get("/user/:userId", protect, getInterviewsByUser);

// Get interview by ID
router.get("/:id", protect, getInterviewById);

// Employer submits interview result
router.post("/:id/result", employerProtect, submitInterviewResult);

// Candidate or employer views interview result
router.get("/:id/result", protect, getInterviewResult);

export default router;
