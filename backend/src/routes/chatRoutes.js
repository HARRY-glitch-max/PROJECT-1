// routes/chatRoutes.js
import express from "express";
import {
  sendMessage,
  getChatHistory,
  getUserChats,
} from "../controllers/chatController.js";

const router = express.Router();

/**
 * ✅ Send a new message
 * POST /api/chats
 * Body: { senderId, receiverId, message }
 */
router.post("/", sendMessage);

/**
 * ✅ Get chat history between two users
 * GET /api/chats/history/:senderId/:receiverId
 */
router.get("/history/:senderId/:receiverId", getChatHistory);

/**
 * ✅ Get all chats for a user (inbox style)
 * GET /api/chats/user/:userId
 */
router.get("/user/:userId", getUserChats);

export default router;
