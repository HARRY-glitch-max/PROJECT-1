import mongoose from "mongoose";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import Job from "../models/Job.js";
import JobSeeker from "../models/Jobseeker.js"; 
import { notifyJobseeker } from "../utils/notifyJobseeker.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- 🛡️ NEW: Check if user has applied to a specific job ---
// Used by JobCard to toggle between "Apply" and "Chat"
export const checkApplicationStatus = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid IDs provided" });
    }

    const application = await Application.findOne({ 
      userId: userId, // Match the schema field name (userId vs jobseekerId)
      jobId: jobId 
    }).select("_id");

    res.status(200).json({ applied: !!application });
  } catch (error) {
    console.error("Error in checkApplicationStatus:", error);
    res.status(500).json({ message: "Server error checking status" });
  }
};

// --- 1. Submit a new application ---
export const createApplication = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    // Prevent double applications
    const existingApp = await Application.findOne({ jobId, userId });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied for this position." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload your resume (PDF/DOCX)" });
    }

    const job = await Job.findById(jobId).select("employerId title");
    if (!job) return res.status(404).json({ message: "Job not found" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "resumes", resource_type: "raw" },
        (error, uploaded) => (error ? reject(error) : resolve(uploaded))
      );
      stream.end(req.file.buffer);
    });

    const newApp = new Application({
      jobId,
      userId,
      employerId: job.employerId,
      resume: result.secure_url,
    });

    await newApp.save();

    const application = await Application.findById(newApp._id)
      .populate("userId", "name email avatar") 
      .populate("jobId", "title");

    if (application.userId?.email) {
      await notifyJobseeker({
        email: application.userId.email,
        name: application.userId.name,
        subject: "Application Successfully Received",
        message: `Thank you for applying for the "${job.title}" position. Your resume has been uploaded successfully.`,
      });
    }

    res.status(201).json({ message: "Application submitted successfully!", application });
  } catch (error) {
    console.error("Error in createApplication:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- 2. Update application status ---
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true })
      .populate("userId", "name email avatar")
      .populate("jobId", "title employerId");

    if (!application) return res.status(404).json({ message: "Application not found" });

    await Notification.create({
      userId: application.userId._id,
      type: "application_status",
      content: `Update: Your application status for "${application.jobId.title}" is now ${status}.`,
    });

    if (application.userId?.email) {
      await notifyJobseeker({
        email: application.userId.email,
        name: application.userId.name,
        subject: `Application Update: ${status}`,
        message: `The employer has updated your application status for "${application.jobId.title}" to: ${status}.`,
      });
    }

    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 3. Shortlist candidate ---
export const shortlistCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("userId", "name email avatar")
      .populate("jobId", "title");

    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "shortlisted";
    application.shortlistedDate = new Date();
    await application.save();

    await Notification.create({
      userId: application.userId._id,
      type: "application_status",
      content: `Congratulations! You've been shortlisted for "${application.jobId.title}".`,
    });

    if (application.userId?.email) {
      await notifyJobseeker({
        email: application.userId.email,
        name: application.userId.name,
        subject: "Good News: You've been Shortlisted!",
        message: `Excellent news, ${application.userId.name}! You have been shortlisted for the "${application.jobId.title}" role.`,
      });
    }

    res.json({ message: "Candidate shortlisted", application });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- 4. Delete application ---
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 5. Get all applications ---
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "jobId",
        select: "title employerId",
        populate: { path: "employerId", select: "companyName contactEmail" },
      })
      .populate("userId", "name email avatar");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 6. Get applications by employer ---
export const getApplicationsByEmployer = async (req, res) => {
  try {
    const { employerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employerId)) {
      return res.status(400).json({ message: "Invalid employer ID" });
    }

    const applications = await Application.find({ employerId })
      .populate("userId", "name email avatar")
      .populate("jobId", "title location type");

    res.status(200).json(applications); 
  } catch (error) {
    console.error("Error fetching applications by employer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- 7. Standard helper getters ---
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("userId", "name email avatar")
      .populate("jobId", "title");
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("userId", "name email avatar");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate("jobId", "title company location");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};