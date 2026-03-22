import Report from "../models/Report.js";
import Admin from "../models/Admin.js";

// Generate and save a report
export const generateReport = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).populate({
      path: "employer",
      populate: { path: "jobs applications interviews" } // adjust based on your Employer schema
    });

    if (!admin || !admin.employer) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const metrics = {
      totalJobs: admin.employer.jobs?.length || 0,
      totalApplications: admin.employer.applications?.length || 0,
      totalInterviews: admin.employer.interviews?.length || 0,
      hires: admin.employer.hires?.length || 0
    };

    const report = await Report.create({
      employer: admin.employer._id,
      admin: admin._id,
      metrics
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};

// Get all reports for an admin
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ admin: req.user._id }).populate("employer");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
};

// Get a single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("employer admin");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report", error: error.message });
  }
};
