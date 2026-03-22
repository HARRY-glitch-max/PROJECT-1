import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // user who sent the message
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // user who receives the message
  message: { type: String, required: true },                                         // actual chat content
  timestamp: { type: Date, default: Date.now }                                       // when message was sent
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
