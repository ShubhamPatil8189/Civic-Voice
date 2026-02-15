const express = require("express");
const router = express.Router();

const { 
  register, 
  login, 
  getCurrentUser, 
  updateProfile 
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Register & Login
router.post("/register", register);
router.post("/login", login);

// Current user
router.get("/me", protect, getCurrentUser);

// Update profile
router.put("/profile", protect, updateProfile);

module.exports = router;
