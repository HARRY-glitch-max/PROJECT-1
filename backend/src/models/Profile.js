// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  role: { 
    type: String, 
    enum: ["user", "employer", "admin"], // ✅ added admin
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ✅ secure login
  bio: { type: String },

  // Employer-specific fields
  company: { type: String },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" },

  // User-specific fields
  skills: [{ type: String }],
  experience: { type: String }, // optional extra for users

  // Admin-specific fields
  permissions: [{ type: String }], // e.g. ["manage_jobs", "view_reports"]
  accessLevel: { type: String, enum: ["super", "standard"], default: "standard" },

  updatedAt: { type: Date, default: Date.now }
});

// Optional: add password hashing middleware if needed
profileSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const bcrypt = require("bcryptjs");
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check password
profileSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Profile", profileSchema);
