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
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. AUTH ROUTES (Specific)
router.post("/register", registerUser);
router.post("/login", loginUser);

// 2. PROTECTED STATIC ROUTES (Specific)
// This MUST come before /:id, otherwise "profile" is treated as an ID
router.get("/profile/me", protect, getUserProfile);

// 3. GENERAL COLLECTION ROUTES
router.get("/", getUsers);

// 4. DYNAMIC ID ROUTES (Generic - Keep these at the bottom!)
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/notify/:id", notifyJobseekerById);

export default router;