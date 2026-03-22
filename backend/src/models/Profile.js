// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "employer"], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  company: { type: String }, // only for employers
  skills: [{ type: String }], // only for users
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", profileSchema);
