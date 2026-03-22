import express from "express";
import uploadModule from "../middleware/multer.js"; // CommonJS interop
import {
  createApplication,
  getApplications,
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  shortlistCandidate
} from "../controllers/applicationController.js";

const router = express.Router();

// Normalize CommonJS export
const upload = uploadModule.default || uploadModule;

/**
 * --- 📄 Application Submission ---
 * Added upload.single("resume") middleware.
 * "resume" is the field name you must use in Postman (form-data).
 */
router.post("/", upload.single("resume"), createApplication);

// --- 🔍 Retrieval Routes ---
router.get("/", getApplications);
router.get("/job/:jobId", getApplicationsByJob);
router.get("/user/:userId", getApplicationsByUser);
router.get("/:id", getApplicationById);

// --- ⚙️ Management Routes ---
router.put("/:id/status", updateApplicationStatus);
router.put("/:id/shortlist", shortlistCandidate);
router.delete("/:id", deleteApplication);

export default router;
