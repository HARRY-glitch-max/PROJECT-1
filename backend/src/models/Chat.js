import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // ✅ Sender details
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobseeker", // updated from "User"
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String, // optional profile picture
      default: null,
    },

    // ✅ Receiver details
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobseeker", // updated from "User"
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverAvatar: {
      type: String, // optional profile picture
      default: null,
    },

    // ✅ Message content
    message: {
      type: String,
      required: true,
      trim: true, // ensures no accidental whitespace
    },

    // ✅ Read status
    isRead: {
      type: Boolean,
      default: false,
    },

    // ✅ Timestamp
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ Index for faster queries on conversations
chatSchema.index({ senderId: 1, receiverId: 1, timestamp: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
