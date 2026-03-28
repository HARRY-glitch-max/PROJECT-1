import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    }, // Employer reference

    title: { type: String, required: true },          // Job title
    description: { type: String, required: true },    // Job description
    requirements: { type: [String], default: [] },    // Skills/qualifications

    location: { type: String, required: true },       // Job location
    salary: { type: String, required: true },         // Salary range or amount

    datePosted: { type: Date, default: Date.now },    // Date published
    status: {
      type: String,
      enum: ["open", "closed", "in review"],
      default: "open",
    }, // Job status
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
