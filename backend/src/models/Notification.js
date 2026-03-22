import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
