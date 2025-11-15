import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// Test route (optional)
router.get("/", (req, res) => {
  res.send("User route is working!");
});

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

// GET /api/users/profile
router.get("/profile", getUserProfile);

export default router;
