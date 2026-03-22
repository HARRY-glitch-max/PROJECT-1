import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { notifyJobseeker } from "../utils/notifyJobseeker.js";

// =======================
// Register user
// =======================
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, roles } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // ✅ Normalize email
    email = email.toLowerCase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, roles });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Login user (FIXED 🔥)
// =======================
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    console.log("BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ Normalize email
    email = email.toLowerCase();

    const user = await User.findOne({ email });

    console.log("USER:", user);

    // ✅ FIX: Handle user not found FIRST
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Extra safety check
    if (!user.matchPassword) {
      throw new Error("matchPassword method not defined");
    }

    const isMatch = await user.matchPassword(password);

    console.log("MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Get all users (admin)
// =======================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Get user by ID
// =======================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Update user profile
// =======================
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email
      ? req.body.email.toLowerCase()
      : user.email;

    if (user.roles === "jobseeker") {
      user.bio = req.body.bio || user.bio;
      user.skills = req.body.skills || user.skills;
      user.cv = req.body.cv || user.cv;
    }

    if (user.roles === "employer") {
      user.company = req.body.company || user.company;
      user.industry = req.body.industry || user.industry;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      roles: updatedUser.roles,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      cv: updatedUser.cv,
    });

  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Delete user
// =======================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Get logged-in profile
// =======================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// Notify jobseeker
// =======================
export const notifyJobseekerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    const user = await User.findById(id).select("-password");

    if (!user || user.roles !== "jobseeker") {
      return res.status(404).json({ message: "Jobseeker not found" });
    }

    await notifyJobseeker({
      email: user.email,
      name: user.name,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Notification sent to ${user.email}`,
    });

  } catch (err) {
    console.error("NOTIFY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};