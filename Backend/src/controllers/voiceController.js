const VoiceSession = require("../models/VoiceSession");
const Scheme = require("../models/Scheme");

const processVoice = async (req, res, next) => {
  try {
    const { text, language } = req.body;

    // VERY BASIC EXTRACTION (can improve later)
    const extractedData = {};

    if (text.includes("60")) extractedData.age = 60;
    if (text.toLowerCase().includes("farmer")) extractedData.occupation = "farmer";
    if (text.toLowerCase().includes("maharashtra")) extractedData.state = "Maharashtra";

    // reuse eligibility logic
    const schemes = await Scheme.find();
    const matchedSchemes = schemes.filter(s =>
      !s.eligibilityCriteria.ageMin || extractedData.age >= s.eligibilityCriteria.ageMin
    );

    const session = await VoiceSession.create({
      spokenText: text,
      detectedLanguage: language,
      extractedData,
      matchedSchemes
    });

    res.status(200).json({
      success: true,
      message: "Voice processed",
      session
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { processVoice };
