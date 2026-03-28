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

// ✅ Hash password before saving
employerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Add matchPassword method
employerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Prevent OverwriteModelError
const Employer =
  mongoose.models.Employer || mongoose.model("Employer", employerSchema);

export default Employer;
