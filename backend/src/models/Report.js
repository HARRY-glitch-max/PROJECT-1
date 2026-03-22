import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer", required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  generatedAt: { type: Date, default: Date.now },
  metrics: {
    totalJobs: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 },
    totalInterviews: { type: Number, default: 0 },
    hires: { type: Number, default: 0 }
  }
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
