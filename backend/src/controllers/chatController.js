import Chat from "../models/Chat.js";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const chat = new Chat({ senderId, receiverId, message });
    await chat.save();

    res.status(201).json({ message: "Message sent successfully", chat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history between two users
export const getChatHistory = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 }); // sort by time ascending

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages for a single user (inbox style)
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).sort({ timestamp: -1 }); // latest first

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
