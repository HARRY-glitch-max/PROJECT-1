import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { 
    type: String, 
    enum: ["jobseeker", "employer", "admin"], 
    default: "jobseeker" 
  },
  // ✅ New field: Ties an Admin to a specific Employer/Company
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model (specifically those with 'employer' role)
    required: function() {
      return this.roles === 'admin'; // Only mandatory if the user is an Admin
    }
  },
  bio: { type: String },
  skills: [{ type: String }],
  cv: { type: String }
}, { timestamps: true });

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Add matchPassword method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;