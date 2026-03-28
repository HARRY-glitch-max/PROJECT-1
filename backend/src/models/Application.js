import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ✅ Job reference
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ✅ Applicant reference (Standardized to JobSeeker)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker", // 👈 FIXED: Changed from "Jobseeker" to "JobSeeker"
      required: true,
    },

    // ✅ Employer reference
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: false,
    },

    // ✅ Resume file path or URL
    resume: {
      type: String,
      required: true,
    },

    // ✅ Optional cover letter
    coverLetter: {
      type: String,
      trim: true,
    },

    // ✅ Application status
    status: {
      type: String,
      enum: ["submitted", "reviewing", "shortlisted", "rejected", "hired"],
      default: "submitted",
    },

    // ✅ Shortlist date
    shortlistedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
applicationSchema.index({ jobId: 1, userId: 1, employerId: 1 });

// Check if model exists to prevent OverwriteModelError in development
const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;