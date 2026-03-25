import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  notifyJobseekerById
} from "../controllers/jobseekerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. AUTH ROUTES (Jobseeker-specific)
router.post("/register", registerUser);
router.post("/login", loginUser);

// 2. PROTECTED ROUTES (Jobseeker profile)
router.get("/profile/me", protect, getUserProfile);

// 3. JOBSEEKER COLLECTION ROUTES
router.get("/", getUsers);

// 4. JOBSEEKER ID ROUTES
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// 5. JOBSEEKER NOTIFICATION ROUTE
router.post("/notify/:id", notifyJobseekerById);

export default router;
