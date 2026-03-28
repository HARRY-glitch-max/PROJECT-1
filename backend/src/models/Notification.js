import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ✅ Standardized to JobSeeker (Uppercase S)
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "JobSeeker", 
      required: true 
    },
    
    // ✅ Added 'enum' to prevent random strings and help frontend filtering
    type: { 
      type: String, 
      enum: ["interview", "interview_result", "application_status", "message"],
      required: true 
    },
    
    content: { 
      type: String, 
      required: true 
    },

    // ✅ Added 'isRead' so you can show a "Red Dot" on the bell icon
    isRead: { 
      type: Boolean, 
      default: false 
    },

    // ✅ Added 'link' so the user can click the notification to go to the interview page
    link: { 
      type: String 
    }
  },
  { timestamps: true } // Replaces 'date' field with createdAt and updatedAt
);

// Prevent OverwriteModelError during development reloads
const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;