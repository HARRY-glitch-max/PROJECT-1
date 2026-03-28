import jwt from "jsonwebtoken";
import User from "../models/Jobseeker.js";
import Employer from "../models/Employer.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;

    // 🔥 Admins
    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.id).select("-password");
      if (!account) {
        return res.status(401).json({ message: "Admin not found" });
      }
      req.user = account;
      req.user.accountType = "admin";
      req.user.employerId = account.employerId;
      return next();
    }

    // 🔄 Jobseekers or Employers
    const [user, employer] = await Promise.all([
      User.findById(decoded.id).select("-password"),
      Employer.findById(decoded.id).select("-password"),
    ]);

    account = user || employer;
    if (!account) {
      return res.status(401).json({ message: "Not authorized, account not found" });
    }

    req.user = account;
    if (employer) {
      req.user.accountType = "employer";
      req.user.employerId = employer._id;
    } else {
      req.user.accountType = "user";
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// =======================
// Role Middlewares
// =======================

export const adminProtect = (req, res, next) => {
  if (req.user?.accountType === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, admins only" });
};

export const employerProtect = (req, res, next) => {
  if (req.user?.accountType === "employer") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, employers only" });
};
