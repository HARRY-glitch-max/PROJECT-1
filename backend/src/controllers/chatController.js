import Chat from "../models/Chat.js";
import JobSeeker from "../models/Jobseeker.js";
import Employer from "../models/Employer.js";
import Application from "../models/Application.js";
import mongoose from "mongoose";

/**
 * 🛡️ Security Helper
 * Verifies that a Jobseeker and Employer have a formal connection 
 * via an application before allowing communication.
 */
const checkApplicationExists = async (id1, id2) => {
  return await Application.findOne({
    $or: [
      { userId: id1, employerId: id2 },
      { userId: id2, employerId: id1 }
    ]
  }).lean();
};

// --- 1. Send a New Message ---
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderType } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message content cannot be empty." });
    }

    // Authorization: Only allow messaging if an application exists
    const hasConnection = await checkApplicationExists(senderId, receiverId);
    if (!hasConnection) {
      return res.status(403).json({ 
        message: "Access Denied: You can only message after an application has been submitted." 
      });
    }

    // Dynamically determine models based on sender role
    const IsJobSeeker = senderType === "JobSeeker";
    const SenderModel = IsJobSeeker ? JobSeeker : Employer;
    const ReceiverModel = IsJobSeeker ? Employer : JobSeeker;

    const [sender, receiver] = await Promise.all([
      SenderModel.findById(senderId).select("name companyName avatar").lean(),
      ReceiverModel.findById(receiverId).select("name companyName avatar").lean()
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver profile not found." });
    }

    const newChat = new Chat({
      senderId,
      senderName: sender.companyName || sender.name || "Unknown User",
      senderAvatar: sender.avatar || null,
      receiverId,
      receiverName: receiver.companyName || receiver.name || "Unknown User",
      receiverAvatar: receiver.avatar || null,
      message: message.trim(),
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Server error while sending message." });
  }
};

// --- 2. Get Chat History (One-on-One) ---
export const getChatHistory = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const hasConnection = await checkApplicationExists(senderId, receiverId);
    if (!hasConnection) {
      return res.status(403).json({ message: "Authorization failed: No active application found." });
    }

    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
    .sort({ createdAt: 1 })
    .lean();

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving chat history." });
  }
};

// --- 3. Get Inbox (Sidebar Conversation List) ---
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const inbox = await Chat.aggregate([
      {
        $match: {
          $or: [{ senderId: userObjectId }, { receiverId: userObjectId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $gt: ["$senderId", "$receiverId"] },
              { s: "$senderId", r: "$receiverId" },
              { s: "$receiverId", r: "$senderId" }
            ]
          },
          lastMessage: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          contactId: {
            $first: { $cond: [{ $eq: ["$senderId", userObjectId] }, "$receiverId", "$senderId"] }
          },
          contactName: {
            $first: { $cond: [{ $eq: ["$senderId", userObjectId] }, "$receiverName", "$senderName"] }
          },
          contactAvatar: {
            $first: { $cond: [{ $eq: ["$senderId", userObjectId] }, "$receiverAvatar", "$senderAvatar"] }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const formattedInbox = inbox.map(item => ({
      _id: item.contactId,
      lastMessage: item.lastMessage,
      lastMessageAt: item.createdAt,
      otherUser: {
        _id: item.contactId,
        name: item.contactName,
        avatar: item.contactAvatar
      }
    }));

    res.status(200).json(formattedInbox);
  } catch (error) {
    console.error("Inbox Aggregation Error:", error);
    res.status(500).json({ message: "Error generating inbox." });
  }
};