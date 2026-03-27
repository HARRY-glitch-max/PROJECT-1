import Job from "../models/Job.js";
import Notification from "../models/Notification.js";
import User from "../models/Jobseeker.js"; // assuming jobseekers are stored in User model
import { notifyJobseeker } from "../utils/notifyJobseeker.js";

// Helper to notify all jobseekers
const notifyAllJobseekers = async (job, type, message, subject) => {
  const jobseekers = await User.find({}, "name email"); // adjust query to target specific jobseekers
  for (const seeker of jobseekers) {
    // 🔔 Save notification in DB
    await Notification.create({
      userId: seeker._id,
      type,
      content: message,
    });

    // 📧 Send email
    await notifyJobseeker({
      email: seeker.email,
      name: seeker.name,
      subject,
      message,
    });
  }
};

// =======================
// Create a new job
// =======================
const createJob = async (req, res) => {
  try {
    const { employerId, title, description, requirements, location, salary } = req.body;

    const job = new Job({ employerId, title, description, requirements, location, salary });
    await job.save();

    // 🔔 + 📧 Notify jobseekers
    await notifyAllJobseekers(
      job,
      "job_posting",
      `A new job "${job.title}" has been posted.`,
      "New Job Alert"
    );

    res.status(201).json({ message: "Job created successfully and notifications sent", job });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get all jobs
// =======================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employerId", "companyName industry");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Get job by ID
// =======================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employerId", "companyName industry");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Update job
// =======================
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("employerId", "companyName");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔔 + 📧 Notify jobseekers
    await notifyAllJobseekers(
      job,
      "job_update",
      `The job "${job.title}" has been updated by ${job.employerId.companyName}.`,
      "Job Update Notification"
    );

    res.json({ message: "Job updated successfully and notifications sent", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// Delete job
// =======================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔔 + 📧 Notify jobseekers
    await notifyAllJobseekers(
      job,
      "job_delete",
      `The job "${job.title}" has been removed.`,
      "Job Removed Notification"
    );

    res.json({ message: "Job deleted successfully and notifications sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export all functions
export {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
};
