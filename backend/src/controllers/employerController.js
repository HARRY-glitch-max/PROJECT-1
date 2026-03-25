import Employer from "../models/Employer.js";
import generateToken from "../utils/generateToken.js";

// =======================
// Register employer
// =======================
export const createEmployer = async (req, res) => {
  try {
    const { companyName, industry, contactInformation, password } = req.body;

    if (!companyName || !industry || !contactInformation?.email || !password) {
      return res.status(400).json({ message: "Please provide company name, industry, email, and password." });
    }

    if (typeof contactInformation.email !== "string") {
      return res.status(400).json({ message: "Email must be a string." });
    }

    const email = contactInformation.email.toLowerCase();

    const employerExists = await Employer.findOne({ "contactInformation.email": email });
    if (employerExists) {
      return res.status(400).json({ message: "Employer already exists." });
    }

    const employer = await Employer.create({
      companyName,
      industry,
      contactInformation: { ...contactInformation, email },
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
    console.error("REGISTER EMPLOYER ERROR:", err);
    res.status(500).json({ message: "Server error during employer registration." });
  }
};

// =======================
// Login employer
// =======================
export const loginEmployer = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Both email and password are required." });
    }

    if (typeof email !== "string") {
      return res.status(400).json({ message: "Email must be a string." });
    }

    email = email.toLowerCase();
    const employer = await Employer.findOne({ "contactInformation.email": email });

    if (!employer) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await employer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      _id: employer._id,
      companyName: employer.companyName,
      industry: employer.industry,
      contactInformation: employer.contactInformation,
      token: generateToken(employer._id)
    });
  } catch (err) {
    console.error("LOGIN EMPLOYER ERROR:", err);
    res.status(500).json({ message: "Server error during employer login." });
  }
};

// =======================
// Get all employers
// =======================
export const getEmployers = async (req, res) => {
  try {
    const employers = await Employer.find().select("-password");
    res.json(employers);
  } catch (err) {
    console.error("GET EMPLOYERS ERROR:", err);
    res.status(500).json({ message: "Server error fetching employers." });
  }
};

// =======================
// Get employer by ID
// =======================
export const getEmployerById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id).select("-password");
    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }
    res.json(employer);
  } catch (err) {
    console.error("GET EMPLOYER ERROR:", err);
    res.status(500).json({ message: "Server error fetching employer." });
  }
};

// =======================
// Update employer
// =======================
export const updateEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    employer.companyName = req.body.companyName || employer.companyName;
    employer.industry = req.body.industry || employer.industry;
    employer.contactInformation = {
      email: req.body.contactInformation?.email && typeof req.body.contactInformation.email === "string"
        ? req.body.contactInformation.email.toLowerCase()
        : employer.contactInformation.email,
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
    console.error("UPDATE EMPLOYER ERROR:", err);
    res.status(500).json({ message: "Server error updating employer." });
  }
};

// =======================
// Delete employer
// =======================
export const deleteEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found." });
    }

    await employer.remove();
    res.json({ message: "Employer removed successfully." });
  } catch (err) {
    console.error("DELETE EMPLOYER ERROR:", err);
    res.status(500).json({ message: "Server error deleting employer." });
  }
};

// =======================
// Shortlist candidate (placeholder logic)
// =======================
export const shortlistCandidate = async (req, res) => {
  res.json({ message: `Application ${req.params.id} shortlisted.` });
};
