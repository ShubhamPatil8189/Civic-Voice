const express = require("express");
const router = express.Router();
const {
  getSchemes,
  searchWithGeminiAPI,  // Changed from searchWithExternalAPI
  getSchemeDetails
} = require("../controllers/schemeController");

// GET all schemes
router.get("/", getSchemes);

// 🔥 NEW: Search with Gemini AI
router.get("/search", searchWithGeminiAPI);

// Get scheme details
router.get("/:id", getSchemeDetails);

module.exports = router;