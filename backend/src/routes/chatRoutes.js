import express from "express";
import {
  sendMessage,
  getChatHistory,
  getUserChats
} from "../controllers/chatController.js";

const router = express.Router();

// Send a new message
router.post("/", sendMessage);

// Get chat history between two users
router.get("/history/:senderId/:receiverId", getChatHistory);

// Get all chats for a user
router.get("/user/:userId", getUserChats);

export default router;
