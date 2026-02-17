const express = require("express");
const router = express.Router();
const { getFAQs, generateSmartFAQs } = require("../controllers/faqController");

// GET /api/faqs - Get all FAQs
router.get("/", getFAQs);

// POST /api/faqs/generate - Trigger AI generation
router.post("/generate", generateSmartFAQs);

module.exports = router;
