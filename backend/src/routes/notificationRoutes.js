// backend/src/routes/notificationRoutes.js
import express from "express";
import {
  createNotification,
  getUserNotifications,
  getNotificationById,
  deleteNotification,
  markAsRead,
  markAllAsRead
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Basic CRUD ---
// Create notification (used internally during interview booking/status updates)
router.post("/", protect, createNotification);

// Get all notifications for a specific Jobseeker
router.get("/user/:userId", protect, getUserNotifications);

// Get single notification details
router.get("/:id", protect, getNotificationById);

// Delete a specific notification
router.delete("/:id", protect, deleteNotification);

// --- Status Updates ---
// Mark a single notification as read
router.put("/:id/read", protect, markAsRead);

// Mark all notifications for a user as read
router.put("/user/:userId/read-all", protect, markAllAsRead);

export default router;
