const Scheme = require("../models/Scheme");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const { analyzeIntent } = require("../services/geminiService");
const { checkEligibility } = require("../services/eligibilityEngine");

exports.processVoice = async (req, res) => {
  try {
    const { text, language, sessionId } = req.body;
    const userId = req.user ? req.user.userId : null;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    // Retrieve conversation history (last 5 messages)
    let history = [];
    if (sessionId || userId) {
      const query = userId ? { userId } : { sessionId };
      const recent = await Conversation.find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
      history = recent.reverse().map(msg => ({
        role: msg.question ? "user" : "assistant",
        content: msg.question || msg.answer
      }));
    }

    // Try database search (simple keyword match)
    const regex = new RegExp(text, "i");
    const directMatches = await Scheme.find({
      $or: [
        { name_en: regex }, { description_en: regex },
        { name_hi: regex }, { description_hi: regex },
        { name_mr: regex }, { description_mr: regex }
      ]
    }).limit(5);

    // If no direct match, use Gemini
    if (directMatches.length === 0) {
      let userProfile = null;
      if (userId) {
        userProfile = await User.findById(userId).select("age income state gender");
      }

      const intentData = await analyzeIntent(text, history);
      const eligibility = checkEligibility(intentData.intent, userProfile || {});

      const responseData = {
        transcript: text,
        language,
        intentData,
        eligibility,
        matchedSchemes: [],
        source: "gemini"
      };

      // Save conversation
      if (sessionId || userId) {
        await Conversation.create({
          sessionId: sessionId || null,
          userId: userId || null,
          question: text,
          answer: intentData.explanation || "No explanation provided."
        });
      }

      return res.json(responseData);
    }

    // Database match found
    const responseData = {
      transcript: text,
      language,
      matchedSchemes: directMatches,
      source: "database"
    };

    if (sessionId || userId) {
      await Conversation.create({
        sessionId: sessionId || null,
        userId: userId || null,
        question: text,
        answer: `Found ${directMatches.length} schemes.`
      });
    }

    return res.json(responseData);

  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
