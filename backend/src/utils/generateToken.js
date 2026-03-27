// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (id, role, employerId = null) => {
  return jwt.sign(
    { id, role, employerId },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export default generateToken;
