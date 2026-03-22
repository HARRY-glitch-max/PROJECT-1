import express from "express";
import {
  createNotification,
  getUserNotifications,
  getNotificationById,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

// Create notification
router.post("/", createNotification);

// Get all notifications for a user
router.get("/user/:userId", getUserNotifications);

// Get single notification by ID
router.get("/:id", getNotificationById);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;
