import express from "express";
import { registerAdmin, loginAdmin, getAdminReports } from "../controllers/adminController.js";
import { adminProtect } from "../middleware/authMiddleware.js"; // ✅ use this

const router = express.Router();

// Register a new admin
router.post("/register", registerAdmin);

// Login admin
router.post("/login", loginAdmin);

// Generate reports (protected + admin-only)
router.get("/reports", adminProtect, getAdminReports);

export default router;