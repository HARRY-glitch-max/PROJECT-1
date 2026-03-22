import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import { notifyJobseeker } from "../utils/notifyJobseeker.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Submit a new application + Cloudinary Resume + Email Confirmation
export const createApplication = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload your resume (PDF/DOCX)" });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "resumes", resource_type: "raw" },
        (error, uploaded) => {
          if (error) reject(error);
          else resolve(uploaded);
        }
      );
      stream.end(req.file.buffer);
    });

    // Create application with the Cloudinary resume URL
    const newApp = new Application({ jobId, userId, resume: result.secure_url });
    await newApp.save();

    const application = await Application.findById(newApp._id)
      .populate("userId", "name email")
      .populate("jobId", "title");

    // 📧 Confirmation Email
    await notifyJobseeker({
      email: application.userId.email,
      name: application.userId.name,
      subject: "Application Successfully Received",
      message: `Thank you for applying for the "${application.jobId.title}" position. Your resume has been uploaded successfully, and the employer has been notified.`,
    });

    res.status(201).json({
      message: "Application submitted and email confirmation sent!",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Update status + Professional Update Email
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true })
      .populate("userId", "name email")
      .populate("jobId", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await Notification.create({
      userId: application.userId._id,
      type: "application_status",
      content: `Update: Your application status for "${application.jobId.title}" is now ${status}.`,
    });

    await notifyJobseeker({
      email: application.userId.email,
      name: application.userId.name,
      subject: `Application Update: ${status}`,
      message: `The employer has updated your application status for "${application.jobId.title}". Your current status is: **${status}**.`,
    });

    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Shortlist candidate + Special Shortlist Email
export const shortlistCandidate = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("userId", "name email")
      .populate("jobId", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "shortlisted";
    application.shortlistedDate = new Date();
    await application.save();

    await Notification.create({
      userId: application.userId._id,
      type: "application_status",
      content: `Congratulations! You've been shortlisted for "${application.jobId.title}".`,
    });

    await notifyJobseeker({
      email: application.userId.email,
      name: application.userId.name,
      subject: "Good News: You've been Shortlisted!",
      message: `Excellent news, ${application.userId.name}! You have been shortlisted for the "${application.jobId.title}" role. Expect to hear from the hiring team soon regarding next steps.`,
    });

    res.json({ message: "Candidate shortlisted", application });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- GETTERS & HELPERS ---
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title")
      .populate("userId", "name email");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId", "title")
      .populate("userId", "name email");
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("userId", "name email");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.params.userId })
      .populate("jobId", "title");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShortlistedApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId, status: "shortlisted" })
      .populate("userId", "name email");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
