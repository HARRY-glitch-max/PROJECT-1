import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  // 1. Updated ref from "User" to "JobSeeker" to match your new model name
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "JobSeeker", 
    required: true 
  },
  
  // 2. Reference to the Job being applied for
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: true 
  },
  
  // 3. Track the employer who scheduled the session
  employerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employer", 
    required: true 
  }, 
  
  // 4. Scheduling details
  date: { 
    type: Date, 
    required: true 
  },
  time: { 
    type: String 
  },
  location: { 
    type: String, 
    required: true 
  },
  
  // 5. Lifecycle and Results
  status: { 
    type: String, 
    enum: ["scheduled", "completed", "cancelled"], 
    default: "scheduled" 
  },
  result: { 
    type: String, 
    enum: ["passed", "failed", "pending"], 
    default: "pending" 
  }, 
  
  // 6. Post-interview notes
  feedback: { 
    type: String 
  } 
}, { timestamps: true });

// Ensure the model name "Interview" is consistent with your controller imports
export default mongoose.model("Interview", interviewSchema);