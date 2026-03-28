import Chat from "../models/Chat.js";
import JobSeeker from "../models/Jobseeker.js";
import Employer from "../models/Employer.js";
import Application from "../models/Application.js";
import mongoose from "mongoose";

// --- Helper: Verify Application exists between two parties ---
const checkApplicationExists = async (id1, id2) => {
  return await Application.findOne({
    $or: [
      { jobseekerId: id1, employerId: id2 },
      { jobseekerId: id2, employerId: id1 }
    ]
  });
};

// --- 1. Send a new message (with Permission Guard) ---
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderType } = req.body;

    // 🛑 1. Permission Check: Verify an application exists
    const hasConnection = await checkApplicationExists(senderId, receiverId);
    if (!hasConnection) {
      return res.status(403).json({ 
        message: "Access Denied: You can only message after an application is submitted." 
      });
    }

    // 2. Fetch sender and receiver details dynamically
    const SenderModel = senderType === "JobSeeker" ? JobSeeker : Employer;
    const ReceiverModel = senderType === "JobSeeker" ? Employer : JobSeeker;

    const [sender, receiver] = await Promise.all([
      SenderModel.findById(senderId).select("name companyName avatar"),
      ReceiverModel.findById(receiverId).select("name companyName avatar")
    ]);

    const chat = new Chat({
      senderId,
      senderName: sender?.name || sender?.companyName || "Unknown",
      senderAvatar: sender?.avatar || null,
      receiverId,
      receiverName: receiver?.name || receiver?.companyName || "Unknown",
      receiverAvatar: receiver?.avatar || null,
      message,
    });

    const savedChat = await chat.save();

    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- 2. Get chat history (with Permission Guard) ---
export const getChatHistory = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // 🛑 Permission Check
    const hasConnection = await checkApplicationExists(senderId, receiverId);
    if (!hasConnection) {
      return res.status(403).json({ message: "No active application found between these users." });
    }

    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: 1 }) // Use createdAt if using timestamps: true
      .lean();

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. Get Inbox (Recent Chats only for applied jobs) ---
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find all employers/seekers connected via applications
    const apps = await Application.find({
      $or: [{ jobseekerId: userId }, { employerId: userId }]
    }).select("jobseekerId employerId");

    const connectedIds = apps.map(a => 
      a.jobseekerId.toString() === userId ? a.employerId : a.jobseekerId
    );

    // 2. Get latest messages only with those connected IDs
    const chats = await Chat.find({
      $or: [
        { senderId: userId, receiverId: { $in: connectedIds } },
        { receiverId: userId, senderId: { $in: connectedIds } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};