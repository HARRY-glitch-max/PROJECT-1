import Chat from "../models/Chat.js";
import Jobseeker from "../models/Jobseeker.js"; // ✅ import Jobseeker model

// --- 1. Send a new message ---
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Fetch sender and receiver details
    const sender = await Jobseeker.findById(senderId).select("name avatar");
    const receiver = await Jobseeker.findById(receiverId).select("name avatar");

    const chat = new Chat({
      senderId,
      senderName: sender?.name || "Unknown",
      senderAvatar: sender?.avatar || null,
      receiverId,
      receiverName: receiver?.name || "Unknown",
      receiverAvatar: receiver?.avatar || null,
      message,
    });

    const savedChat = await chat.save();

    res.status(201).json({
      message: "Message sent successfully",
      chat: savedChat,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- 2. Get chat history between two jobseekers ---
export const getChatHistory = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ timestamp: 1 }) // ascending by time
      .lean();

    res.json(chats);
  } catch (error) {
    console.error("Error in getChatHistory:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- 3. Get all messages for a single jobseeker (inbox style) ---
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ timestamp: -1 }) // latest first
      .lean();

    res.json(chats);
  } catch (error) {
    console.error("Error in getUserChats:", error);
    res.status(500).json({ message: error.message });
  }
};
