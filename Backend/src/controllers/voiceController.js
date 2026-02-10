
const VoiceSession = require("../models/VoiceSession");
const Scheme = require("../models/Scheme");

const processVoice = async (req, res, next) => {
  try {
    const { text, language } = req.body;

    if (!text || text.trim() === "") {
      return res.json({ session: { matchedSchemes: [] } });
    }

    // 🔎 Search keyword (works for Hindi + Marathi + English)
    const regex = new RegExp(text, "i");

    // search in ALL languages
    const schemes = await Scheme.find({
      $or: [
        { name_en: regex },
        { name_hi: regex },
        { name_mr: regex },
        { description_en: regex },
        { description_hi: regex },
        { description_mr: regex },
        { category_en: regex },
        { category_hi: regex },
        { category_mr: regex }
      ]
    });

    // ⭐ CONVERT TO SELECTED LANGUAGE (VERY IMPORTANT)
    const localizedSchemes = schemes.map((s) => ({
      _id: s._id,

      name:
        language === "hi"
          ? s.name_hi
          : language === "mr"
          ? s.name_mr
          : s.name_en,

      description:
        language === "hi"
          ? s.description_hi
          : language === "mr"
          ? s.description_mr
          : s.description_en
    }));

    // save session (optional but ok)
    await VoiceSession.create({
      spokenText: text,
      detectedLanguage: language,
      extractedData: {},
      matchedSchemes: localizedSchemes
    });

    res.status(200).json({
      success: true,
      session: {
        matchedSchemes: localizedSchemes
      }
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { processVoice };
