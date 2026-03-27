import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const jobseekerSchema = new mongoose.Schema(
  {
    // ✅ Core identity fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ Optional profile fields
    bio: { type: String },
    skills: [{ type: String }],
    cv: { type: String }, // store CV file path or URL
    avatar: { type: String }, // profile picture URL or file path

    // ✅ Role field for flexibility
    role: {
      type: String,
      enum: ["jobseeker"], // locked to jobseeker for this model
      default: "jobseeker",
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
jobseekerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Add matchPassword method
jobseekerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Jobseeker = mongoose.model("Jobseeker", jobseekerSchema);

export default Jobseeker;
