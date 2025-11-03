import Application from "../models/Application.js";


// @desc    Submit a job application
// @route   POST /api/applications
// @access  Private (User only)
export const submitApplication = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      resume,
      coverLetter,
    });

    const savedApp = await application.save();
    res.status(201).json(savedApp);
  } catch (error) {
    res.status(400).json({ message: "Application failed", error });
  }
};

// @desc    Get applications submitted by current user
// @route   GET /api/applications/my
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error });
  }
};

// @desc    Get applications for a job (employer view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
export const getApplicationsForJob = async (req, res) => {
  try {
    const apps = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job applications", error });
  }
};