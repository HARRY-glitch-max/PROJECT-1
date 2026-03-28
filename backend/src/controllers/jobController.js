// controllers/jobController.js
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";
import User from "../models/Jobseeker.js"; // jobseekers
import Interview from "../models/Interview.js";
import { notifyJobseeker } from "../utils/notifyJobseeker.js";

// =======================
// Helper: Notify all jobseekers
// =======================
const notifyAllJobseekers = async (job, type, message, subject) => {
  const jobseekers = await User.find({}, "name email");
  for (const seeker of jobseekers) {
    await Notification.create({
      userId: seeker._id,
      type,
      content: message,
    });

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
// Get jobs by employer
// =======================
const getJobsByEmployer = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId }).populate(
      "employerId",
      "companyName industry"
    );
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
    if (!job) return res.status(404).json({ message: "Job not found" });
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
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
      "employerId",
      "companyName"
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

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
    if (!job) return res.status(404).json({ message: "Job not found" });

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

// =======================
// Interview Routes
// =======================

// Schedule a new interview for a job
const scheduleInterview = async (req, res) => {
  const { jobId } = req.params;
  const { applicantId, date, time } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const interview = await Interview.create({
      jobId,
      applicantId,
      date,
      time,
    });

    // Notify applicant
    const applicant = await User.findById(applicantId);
    if (applicant) {
      await Notification.create({
        userId: applicant._id,
        type: "interview",
        content: `You have an interview scheduled for "${job.title}" on ${date} at ${time}.`,
      });

      await notifyJobseeker({
        email: applicant.email,
        name: applicant.name,
        subject: "Interview Scheduled",
        message: `You have an interview scheduled for "${job.title}" on ${date} at ${time}.`,
      });
    }

    res.status(201).json(interview);
  } catch (error) {
    console.error("SCHEDULE INTERVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to schedule interview" });
  }
};

// Get all interviews for a job
const getInterviewsForJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const interviews = await Interview.find({ jobId }).populate(
      "applicantId",
      "name email"
    );
    res.status(200).json(interviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch interviews" });
  }
};

// ✅ Export all functions
export {
  createJob,
  getJobs,
  getJobsByEmployer,
  getJobById,
  updateJob,
  deleteJob,
  scheduleInterview,
  getInterviewsForJob,
};