import express from "express";
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Job routes are working!");
});

export default router;