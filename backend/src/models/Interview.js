import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true }, // ✅ track who booked
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["scheduled", "completed", "cancelled"], 
    default: "scheduled" 
  },
  result: { 
    type: String, 
    enum: ["passed", "failed", "pending"], 
    default: "pending" 
  }, // ✅ interview outcome
  feedback: { type: String } // ✅ optional notes from employer
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);
