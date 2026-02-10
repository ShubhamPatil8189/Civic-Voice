const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Schema to match your Atlas collection
const eligibilitySchema = new mongoose.Schema({}, { strict: false, collection: 'eligibilities' });
const Eligibility = mongoose.model('Eligibility', eligibilitySchema);

router.get("/:schemeId", async (req, res) => {
  try {
    const { schemeId } = req.params;
    const lang = req.query.lang || "en"; // 'en', 'hi', or 'mr'

    const data = await Eligibility.findOne({ 
      schemeId: new mongoose.Types.ObjectId(schemeId) 
    });

    if (!data) {
      return res.status(404).json({ message: "Eligibility details not found." });
    }

    // CRITICAL: Explicitly select the language key from the database object
    // This ensures your frontend gets a simple 'name' and 'description' string
    res.json({
      name: data.name[lang] || data.name["en"],
      description: data.description[lang] || data.description["en"],
      eligibilityCriteria: data.eligibilityCriteria[lang] || data.eligibilityCriteria["en"],
      requiredDocuments: data.requiredDocuments[lang] || data.requiredDocuments["en"],
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;