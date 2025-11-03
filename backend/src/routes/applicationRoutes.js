import express from "express";
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Application routes are working!");
});

export default router;