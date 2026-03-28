import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
import { notifyJobseeker } from "../utils/notifyJobseeker.js";

// Employer books interview slot for a shortlisted candidate
export const bookInterview = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicantId, date, time, location } = req.body;
    const employerId = req.user?._id;

    if (!employerId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // 1. Verify candidate is shortlisted
    const application = await Application.findOne({ userId: applicantId, jobId })
      .populate("userId", "name email")
      .populate("jobId", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found for this candidate." });
    }

    if (application.status !== "shortlisted") {
      return res.status(400).json({ message: "Candidate must be shortlisted before booking." });
    }

    // 2. Create Interview
    const interview = await Interview.create({
      userId: applicantId,
      jobId,
      employerId,
      date: new Date(date),
      time,
      location,
      status: "scheduled"
    });

    // 3. Create Notifications
    await Notification.insertMany([
      {
        userId: applicantId,
        type: "interview",
        content: `Interview scheduled for ${application.jobId.title} on ${date} at ${location}.`
      },
      {
        userId: employerId,
        type: "interview",
        content: `You booked an interview with ${application.userId.name} for ${application.jobId.title}.`
      }
    ]);

    // 4. Send Email (Non-blocking or simple await)
    try {
      await notifyJobseeker({
        email: application.userId.email,
        name: application.userId.name,
        subject: "Interview Scheduled",
        message: `Your interview for ${application.jobId.title} is scheduled on ${date} at ${location}.`,
      });
    } catch (emailErr) {
      console.error("Email notification failed, but interview was booked:", emailErr);
    }

    res.status(201).json({ message: "Interview booked successfully", interview });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Employer submits interview result
export const submitInterviewResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { result, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const interview = await Interview.findById(id)
      .populate("userId", "name email")
      .populate("jobId", "title");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.result = result;
    interview.feedback = feedback;
    interview.status = "completed";
    await interview.save();

    // Create Notification
    await Notification.create({
      userId: interview.userId._id,
      type: "interview_result",
      content: `Your interview result for ${interview.jobId.title} is: ${result}.`
    });

    // Send Email
    try {
      await notifyJobseeker({
        email: interview.userId.email,
        name: interview.userId.name,
        subject: "Interview Result",
        message: `Your result for ${interview.jobId.title} is: ${result}. Feedback: ${feedback || "None."}`,
      });
    } catch (emailErr) {
      console.error("Result email failed:", emailErr);
    }

    res.json({ message: "Interview result submitted successfully", interview });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- View Controllers (Stay the same) ---

export const getInterviewsByJob = async (req, res) => {
  try {
    const interviews = await Interview.find({ jobId: req.params.jobId })
      .populate("userId", "name email")
      .populate("jobId", "title");
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewsByUser = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.params.userId })
      .populate("jobId", "title description")
      .populate("userId", "email");
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }
    const interview = await Interview.findById(id)
      .populate("jobId", "title")
      .populate("userId", "name email");

    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewResult = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview || !interview.result) {
      return res.status(404).json({ message: "Interview result not available" });
    }

    res.json({ result: interview.result, feedback: interview.feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};