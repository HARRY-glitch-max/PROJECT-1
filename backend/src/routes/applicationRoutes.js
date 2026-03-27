import express from "express";
import upload from "../middleware/multer.js"; // Multer for file uploads
import {
  createApplication,
  getApplications,
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationById,
  getApplicationsByEmployer,   // ✅ new controller
  updateApplicationStatus,
  deleteApplication,
  shortlistCandidate,
} from "../controllers/applicationController.js";

const router = express.Router();

/**
 * --- 📄 Application Submission ---
 * Multer middleware parses the file before hitting the controller.
 * "resume" must match the frontend FormData field name.
 */
router.post("/", upload.single("resume"), createApplication);

// --- 🔍 Retrieval Routes ---
router.get("/", getApplications);
router.get("/job/:jobId", getApplicationsByJob);
router.get("/user/:userId", getApplicationsByUser);
router.get("/employer/:employerId", getApplicationsByEmployer); // ✅ new route
router.get("/:id", getApplicationById);

// --- ⚙️ Management Routes ---
router.put("/:id/status", updateApplicationStatus);
router.put("/:id/shortlist", shortlistCandidate);
router.delete("/:id", deleteApplication);

export default router;