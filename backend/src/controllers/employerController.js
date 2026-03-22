import Employer from "../models/Employer.js";
import generateToken from "../utils/generateToken.js";

// Register employer
export const createEmployer = async (req, res) => {
  try {
    const { companyName, industry, contactInformation, password } = req.body;

    const employerExists = await Employer.findOne({ "contactInformation.email": contactInformation.email });
    if (employerExists) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const employer = await Employer.create({
      companyName,
      industry,
      contactInformation,
      password
    });

    res.status(201).json({
      _id: employer._id,
      companyName: employer.companyName,
      industry: employer.industry,
      contactInformation: employer.contactInformation,
      token: generateToken(employer._id)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login employer
export const loginEmployer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employer = await Employer.findOne({ "contactInformation.email": email });

    if (employer && (await employer.matchPassword(password))) {
      res.json({
        _id: employer._id,
        companyName: employer.companyName,
        industry: employer.industry,
        contactInformation: employer.contactInformation,
        token: generateToken(employer._id)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all employers
export const getEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().select("-password");
    res.json(employers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get employer by ID
export const getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id).select("-password");
    if (!employer) return res.status(404).json({ message: "Employer not found" });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update employer
export const updateEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) return res.status(404).json({ message: "Employer not found" });

    employer.companyName = req.body.companyName || employer.companyName;
    employer.industry = req.body.industry || employer.industry;
    employer.contactInformation = {
      email: req.body.contactInformation?.email || employer.contactInformation.email,
      phone: req.body.contactInformation?.phone || employer.contactInformation.phone,
      address: req.body.contactInformation?.address || employer.contactInformation.address,
    };

    if (req.body.password) {
      employer.password = req.body.password; // will be hashed by pre-save hook
    }

    const updatedEmployer = await employer.save();
    res.json({
      _id: updatedEmployer._id,
      companyName: updatedEmployer.companyName,
      industry: updatedEmployer.industry,
      contactInformation: updatedEmployer.contactInformation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete employer
export const deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) return res.status(404).json({ message: "Employer not found" });

    await employer.remove();
    res.json({ message: "Employer removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Shortlist candidate (placeholder logic)
export const shortlistCandidate = async (req, res) => {
  res.json({ message: `Application ${req.params.id} shortlisted` });
};
