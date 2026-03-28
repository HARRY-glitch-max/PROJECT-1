import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const jobseekerSchema = new mongoose.Schema(
  {
    // Core identity fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Optional profile fields
    bio: { type: String },
    skills: [{ type: String }],
    cv: { type: String },     // CV file path or URL
    avatar: { type: String }, // profile picture URL or file path

    // Role field
    role: {
      type: String,
      enum: ["jobseeker"],
      default: "jobseeker",
    },
  },
  { timestamps: true }
);

// Hash password before saving
jobseekerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Add matchPassword method
jobseekerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ CRITICAL FIX: Standardize name to "JobSeeker" (Uppercase S)
// This must match the 'ref' used in Interview.js and Application.js
const JobSeeker =
  mongoose.models.JobSeeker || mongoose.model("JobSeeker", jobseekerSchema);

export default JobSeeker;