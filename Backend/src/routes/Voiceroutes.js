const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
const VoiceSession = require("../models/VoiceSession");
const UniqueQuery = require("../models/UniqueQuery");
const { normalizeQuery, areSimilar } = require("../utils/querySimilarity");

// POST /api/voice/process
router.post("/process", async (req, res) => {
  const { text, language } = req.body;

  try {
    let schemes;
    if (!text || text.trim() === "") {
      schemes = await Scheme.find();
    } else {
      const regex = new RegExp(text, "i");

      if (language === "en") {
        schemes = await Scheme.find({ $or: [{ name_en: regex }, { description_en: regex }] });
      } else if (language === "hi") {
        schemes = await Scheme.find({ $or: [{ name_hi: regex }, { description_hi: regex }] });
      } else if (language === "mr") {
        schemes = await Scheme.find({ $or: [{ name_mr: regex }, { description_mr: regex }] });
      } else {
        schemes = await Scheme.find({
          $or: [
            { name_en: regex }, { description_en: regex },
            { name_hi: regex }, { description_hi: regex },
            { name_mr: regex }, { description_mr: regex },
          ],
        });
      }
    }

    // 💾 Save the voice session for AI learning
    if (text && text.trim() !== "") {
      await VoiceSession.create({
        spokenText: text,
        detectedLanguage: language || "en",
        extractedData: {},
        matchedSchemes: schemes
      });

      // 🔍 Track unique queries with deduplication
      const normalized = normalizeQuery(text);

      // Find all unique queries to check for similarity
      const allQueries = await UniqueQuery.find();
      let foundSimilar = null;

      for (const query of allQueries) {
        if (areSimilar(text, query.originalQuery)) {
          foundSimilar = query;
          break;
        }
      }

      if (foundSimilar) {
        // Similar query exists, increment count
        foundSimilar.searchCount += 1;
        foundSimilar.lastSearched = new Date();

        // Add to related queries if not already there
        if (!foundSimilar.relatedQueries.includes(text)) {
          foundSimilar.relatedQueries.push(text);
        }

        await foundSimilar.save();
      } else {
        // New unique query
        await UniqueQuery.create({
          normalizedQuery: normalized,
          originalQuery: text,
          searchCount: 1,
          language: language || "en",
          relatedQueries: []
        });
      }
    }

    res.json({ session: { matchedSchemes: schemes } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
