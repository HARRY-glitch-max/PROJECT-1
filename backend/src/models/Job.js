import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true }, // Employer reference
  title: { type: String, required: true },                                              // Job title
  description: { type: String, required: true },                                        // Job description
  requirements: { type: [String], default: [] },                                        // Skills/qualifications
  datePosted: { type: Date, default: Date.now },                                        // Date published
  status: { 
    type: String, 
    enum: ["open", "closed", "in review"], 
    default: "open" 
  }                                                                                     // Application stage
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
export default Job;
