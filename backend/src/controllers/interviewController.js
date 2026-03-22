import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import { notifyJobseeker } from "../utils/notifyJobseeker.js";

// Employer books interview slot for a shortlisted candidate
const bookInterview = async (req, res) => {
  try {
    const { jobId, candidateId, scheduledDate, scheduledTime, location } = req.body;
    const employerId = req.user._id;

    // Verify candidate is shortlisted
    const application = await Application.findOne({ userId: candidateId, jobId })
      .populate("userId", "name email");
    if (!application || application.status !== "shortlisted") {
      return res.status(400).json({ message: "Candidate must be shortlisted before booking an interview." });
    }

    const interview = new Interview({
      userId: candidateId,
      jobId,
      employerId,
      date: new Date(scheduledDate),
      time: scheduledTime,
      location,
      status: "scheduled"
    });
    await interview.save();

    // 🔔 Save notification in DB
    await Notification.create({
      userId: candidateId,
      type: "interview",
      content: `You have been scheduled for an interview for job ${jobId} on ${scheduledDate} at ${location}.`
    });

    // 📧 Send email to candidate
    await notifyJobseeker({
      email: application.userId.email,
      name: application.userId.name,
      subject: "Interview Scheduled",
      message: `Your interview for job ${jobId} is scheduled on ${scheduledDate} at ${location}.`,
    });

    // 🔔 Save employer notification in DB
    await Notification.create({
      userId: employerId,
      type: "interview",
      content: `You booked an interview with candidate ${candidateId} for job ${jobId} on ${scheduledDate} at ${location}.`
    });

    res.status(201).json({ message: "Interview booked successfully by employer", interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employer views interviews for a job
const getInterviewsByJob = async (req, res) => {
  try {
    const interviews = await Interview.find({ jobId: req.params.jobId })
      .populate("userId", "name email");
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Candidate views their interviews
const getInterviewsByUser = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.params.userId })
      .populate("jobId", "title description");
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get interview by ID
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }
    const interview = await Interview.findById(id)
      .populate("jobId", "title")
      .populate("userId", "name email");
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employer submits interview result
const submitInterviewResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { result, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    const interview = await Interview.findById(id).populate("userId", "name email");
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.result = result;
    interview.feedback = feedback;
    interview.status = "completed";
    await interview.save();

    // 🔔 Save notification in DB
    await Notification.create({
      userId: interview.userId._id,
      type: "interview_result",
      content: `Your interview result for job ${interview.jobId} is: ${result}.`
    });

    // 📧 Send email to candidate
    await notifyJobseeker({
      email: interview.userId.email,
      name: interview.userId.name,
      subject: "Interview Result",
      message: `Your interview result for job ${interview.jobId} is: ${result}. Feedback: ${feedback || "No additional feedback provided."}`,
    });

    res.json({ message: "Interview result submitted successfully", interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Candidate or employer views interview result
const getInterviewResult = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    const interview = await Interview.findById(id)
      .populate("jobId", "title")
      .populate("userId", "name email");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (!interview.result) {
      return res.status(404).json({ message: "Interview result not available yet" });
    }

    res.json({ result: interview.result, feedback: interview.feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export all functions
export {
  bookInterview,
  getInterviewsByJob,
  getInterviewsByUser,
  getInterviewById,
  submitInterviewResult,
  getInterviewResult
};
