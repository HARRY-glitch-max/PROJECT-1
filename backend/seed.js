import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Job from "./src/models/Job.js";
import Application from "./src/models/Application.js";
import connectDB from "./src/config/db.js";

dotenv.config();
await connectDB();

// Clear existing data
await User.deleteMany();
await Job.deleteMany();
await Application.deleteMany();

// Create sample users
const users = await User.insertMany([
  {
    name: "Alice Admin",
    email: "alice@admin.com",
    password: "password123",
    role: "admin",
  },
  {
    name: "Bob Employer",
    email: "bob@company.com",
    password: "password123",
    role: "employer",
  },
  {
    name: "Charlie Candidate",
    email: "charlie@user.com",
    password: "password123",
    role: "user",
  },
]);

// Create sample jobs
const jobs = await Job.insertMany([
  {
    title: "Frontend Developer",
    description: "React + Tailwind project",
    company: "TechCorp",
    location: "Nairobi",
    salary: 80000,
    postedBy: users[1]._id,
  },
  {
    title: "Backend Engineer",
    description: "Node.js + MongoDB API",
    company: "DevWorks",
    location: "Mombasa",
    salary: 90000,
    postedBy: users[1]._id,
  },
]);

// Create sample applications
await Application.insertMany([
  {
    job: jobs[0]._id,
    applicant: users[2]._id,
    resume: "https://example.com/resume-charlie.pdf",
    coverLetter: "Excited to join your frontend team!",
  },
  {
    job: jobs[1]._id,
    applicant: users[2]._id,
    resume: "https://example.com/resume-charlie.pdf",
    coverLetter: "Experienced in backend development.",
  },
]);

console.log("✅ Database seeded successfully");
process.exit();