import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  contactInformation: {
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String }
  },
  password: { type: String, required: true },

  // 🔑 Reference to Admin
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
});

// ✅ Hash password before saving (Option 1: async/await, no next)
employerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Add matchPassword method
employerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Employer = mongoose.model("Employer", employerSchema);

export default Employer;
