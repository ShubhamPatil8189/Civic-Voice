const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");

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

    res.json({ session: { matchedSchemes: schemes } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
