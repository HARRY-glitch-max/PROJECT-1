import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // ✅ Job reference
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ✅ Applicant reference (Jobseeker)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobseeker", // updated from "User"
      required: true,
    },

    // ✅ Employer reference (optional, auto-injected from Job in controller)
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: false, // ✅ changed
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

// Optional: index for faster queries by employer/jobseeker
applicationSchema.index({ jobId: 1, userId: 1, employerId: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
