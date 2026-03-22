import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  employerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employer"
  },
  // 🚨 ADD THIS FIELD BELOW
  resume: { 
    type: String, 
    required: true 
  }, 
  coverLetter: {
    type: String
  },
  dateApplied: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ["submitted", "reviewing", "shortlisted", "rejected", "hired"], 
    default: "submitted" 
  },
  shortlistedDate: {
    type: Date
  }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;