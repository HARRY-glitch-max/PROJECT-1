import Admin from "../models/Admin.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new admin linked to employer
// @route   POST /api/admin/register
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, employerId } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({ name, email, password, employerId });
    
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      employerId: admin.employerId,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Populate employer details if needed for the frontend
    const admin = await Admin.findOne({ email }).populate("employerId");

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        employerId: admin.employerId,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate employer-scoped reports (Optimized)
// @route   GET /api/admin/reports
export const getAdminReports = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const employerId = admin.employerId;

    // Use Promise.all to fetch all counts in parallel
    const [
      totalJobs, activeJobs, closedJobs,
      totalApps, shortlistedApps, hiredApps, rejectedApps, pendingApps,
      totalInterviews, completedInterviews, scheduledInterviews, cancelledInterviews
    ] = await Promise.all([
      // Jobs
      Job.countDocuments({ employerId }),
      Job.countDocuments({ employerId, status: "active" }),
      Job.countDocuments({ employerId, status: "closed" }),
      // Applications
      Application.countDocuments({ employerId }),
      Application.countDocuments({ employerId, status: "shortlisted" }),
      Application.countDocuments({ employerId, status: "hired" }),
      Application.countDocuments({ employerId, status: "rejected" }),
      Application.countDocuments({ employerId, status: "pending" }),
      // Interviews
      Interview.countDocuments({ employerId }),
      Interview.countDocuments({ employerId, status: "completed" }),
      Interview.countDocuments({ employerId, status: "scheduled" }),
      Interview.countDocuments({ employerId, status: "cancelled" })
    ]);

    res.json({
      jobs: {
        total: totalJobs,
        active: activeJobs,
        closed: closedJobs
      },
      applications: {
        total: totalApps,
        shortlisted: shortlistedApps,
        hired: hiredApps,
        rejected: rejectedApps,
        pending: pendingApps
      },
      interviews: {
        total: totalInterviews,
        completed: completedInterviews,
        scheduled: scheduledInterviews,
        cancelled: cancelledInterviews
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};