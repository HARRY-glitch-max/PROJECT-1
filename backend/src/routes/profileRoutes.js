// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, getProfile);
router.put("/:id", authMiddleware, updateProfile);

module.exports = router;
