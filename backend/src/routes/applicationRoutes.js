import express from "express";
import upload from "../middleware/multer.js";
import {
  createApplication,
  getApplications,
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationById,
  getApplicationsByEmployer,
  updateApplicationStatus,
  deleteApplication,
  shortlistCandidate,
  checkApplicationStatus, // ✅ Add this import
} from "../controllers/applicationController.js";

const router = express.Router();

// --- 🛡️ Validation Route ---
// This is used by the frontend JobCard to toggle between "Apply" and "Chat"
router.get("/check/:userId/:jobId", checkApplicationStatus);

/**
 * --- 📄 Application Submission ---
 */
router.post("/", upload.single("resume"), createApplication);

// --- 🔍 Retrieval Routes ---
router.get("/", getApplications);
router.get("/job/:jobId", getApplicationsByJob);
router.get("/user/:userId", getApplicationsByUser);
router.get("/employer/:employerId", getApplicationsByEmployer);
router.get("/:id", getApplicationById);

// --- ⚙️ Management Routes ---
router.put("/:id/status", updateApplicationStatus);
router.put("/:id/shortlist", shortlistCandidate);
router.delete("/:id", deleteApplication);

export default router;