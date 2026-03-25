import jwt from "jsonwebtoken";
import User from "../models/Jobseeker.js";
import Employer from "../models/Employer.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Search across all possible account models
      const [user, employer, admin] = await Promise.all([
        User.findById(decoded.id).select("-password"),
        Employer.findById(decoded.id).select("-password"),
        Admin.findById(decoded.id).select("-password")
      ]);

      const account = user || employer || admin;

      if (!account) {
        return res.status(401).json({ message: "Not authorized, account not found" });
      }

      // Attach account to request
      req.user = account;

      // Set accountType and normalize employer access
      const modelName = account.constructor.modelName;
      if (modelName === "Admin") {
        req.user.accountType = "admin";
        // Ensure Admin has their tied employerId accessible
        req.employerId = account.employerId; 
      } else if (modelName === "Employer") {
        req.user.accountType = "employer";
        req.employerId = account._id; // An employer IS the employerId
      } else {
        req.user.accountType = "user";
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};

// Simplified Role Checkers
export const employerProtect = (req, res, next) => {
  if (req.user && req.user.accountType === "employer") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, employers only" });
  }
};

export const adminProtect = (req, res, next) => {
  if (req.user && req.user.accountType === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admins only" });
  }
};