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

    // 1. Context Retrieval (Database Search)
    const regex = new RegExp(text, "i");
    const directMatches = await Scheme.find({
      $or: [
        { name_en: regex }, { description_en: regex },
        { name_hi: regex }, { description_hi: regex },
        { name_mr: regex }, { description_mr: regex }
      ]
    }).limit(5).select("name_en description_en id");

    // 2. User Context
    let userProfile = null;
    if (userId) {
      userProfile = await User.findById(userId).select("age income state gender");
    }

    // 3. Cognitive Processing (Gemini)
    // Pass directMatches as context to help Gemini understand what we have in DB
    const intentData = await analyzeIntent(text, history, directMatches);

    // 4. Eligibility & Logic
    const specificScheme = intentData.suggested_schemes && intentData.suggested_schemes.length > 0
      ? directMatches.find(s => s.name_en === intentData.suggested_schemes[0].name) || directMatches[0]
      : directMatches[0];

    const eligibility = await checkEligibility(intentData.intent, userProfile || {}, specificScheme);

    // 5. Response Construction
    const responseData = {
      transcript: text,
      language,
      intentData,
      eligibility,
      matchedSchemes: directMatches, // Send raw matches too, frontend can decide to show them
      source: "hybrid_reasoning",
      navigation: intentData.navigation_step || null
    };

    // 6. Memory Consolidation (Save)
    if (sessionId || userId) {
      await Conversation.create({
        sessionId: sessionId || null,
        userId: userId || null,
        question: text,
        answer: intentData.explanation || "Processed request."
      });
    }

    return res.json(responseData);

  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
