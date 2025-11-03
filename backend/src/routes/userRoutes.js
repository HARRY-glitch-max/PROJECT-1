import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/userController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User route is working!");
});

export default router;