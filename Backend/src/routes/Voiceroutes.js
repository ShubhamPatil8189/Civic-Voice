const express = require("express");
const { processVoice } = require("../controllers/voiceController");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();
// Use controller for Gemini integration
router.post("/", processVoice);
module.exports = router;
