import Job from "../models/Job.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs", error });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer only)
export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      postedBy: req.user._id, // assuming req.user is set by auth middleware
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: "Job creation failed", error });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};