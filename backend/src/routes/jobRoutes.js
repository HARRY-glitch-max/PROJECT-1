import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

// Create job
router.post("/", createJob);

// Get all jobs
router.get("/", getJobs);

// Get job by ID
router.get("/:id", getJobById);

// Update job
router.put("/:id", updateJob);

// Delete job
router.delete("/:id", deleteJob);

export default router;
