import express from "express";
import {
  createEmployer,
  loginEmployer,
  getEmployers,
  getEmployerById,
  updateEmployer,
  deleteEmployer,
  shortlistCandidate
} from "../controllers/employerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. PUBLIC AUTH ROUTES (Specific)
router.post("/register", createEmployer);
router.post("/login", loginEmployer);

// 2. SPECIFIC EMPLOYER ACTIONS (Specific)
// This is safe because "/applications" is a hard string, not a dynamic ID
router.put("/applications/:id/shortlist", protect, shortlistCandidate);

// 3. GENERAL COLLECTION ROUTES
router.get("/", protect, getEmployers);

// 4. DYNAMIC ID ROUTES (Generic - Always at the bottom)
router.get("/:id", protect, getEmployerById);
router.put("/:id", protect, updateEmployer);
router.delete("/:id", protect, deleteEmployer);

export default router;