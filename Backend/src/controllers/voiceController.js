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
        .limit(10) // Increased for better recall
        .lean();
      history = recent.reverse().map(msg => ({
        role: msg.question ? "user" : "assistant",
        content: msg.question || msg.answer
      }));
    }

    // 1. Context Retrieval (Database Search)
    // 1. Context Retrieval (Database Search)
    let directMatches = [];

    // Strategy A: Exact phrase match (e.g. user says "PM Kisan")
    const regex = new RegExp(text, "i");
    directMatches = await Scheme.find({
      $or: [
        { name_en: regex }, { description_en: regex },
        { name_hi: regex }, { description_hi: regex },
        { name_mr: regex }, { description_mr: regex }
      ]
    }).limit(5).select("name_en description_en id");

    // Strategy B: Keyword fallback if A fails
    if (directMatches.length === 0) {
      const keywords = ["pension", "scholarship", "health", "farmer", "housing", "education", "loan", "widow"];
      const foundKeywords = keywords.filter(k => text.toLowerCase().includes(k));

      if (foundKeywords.length > 0) {
        const keywordRegex = new RegExp(foundKeywords.join("|"), "i");
        directMatches = await Scheme.find({
          $or: [
            { name_en: keywordRegex }, { description_en: keywordRegex },
            { category_en: keywordRegex }
          ]
        }).limit(5).select("name_en description_en id");
      }
    }

    // 2. User Context
    let userProfile = null;
    if (userId) {
      userProfile = await User.findById(userId).select("age income state gender");
    }

    // 3. Cognitive Processing (Gemini)
    // Pass directMatches as context to help Gemini understand what we have in DB
    // Check if conversation is long (e.g. > 10 messages) to maintenance trigger summary offer
    // Since history contains user+assistant messages, 10 messages = 5 turns.
    const isLongConversation = history.length >= 10;

    const intentData = await analyzeIntent(text, history, directMatches, isLongConversation);

    // 4. Eligibility & Logic
    const specificScheme = intentData.suggested_schemes && intentData.suggested_schemes.length > 0
      ? directMatches.find(s => s.name_en === intentData.suggested_schemes[0].name)
      : null;

    let finalExplanation = intentData.explanation;

    // Feature: Graceful Failure & Safe Exit (Backend Safety Net)
    if (intentData.confidence < 0.6) {
      const exitMessage = "For the most accurate guidance, please visit your local Tehsil office or call the toll-free helpline 1905.";
      if (!finalExplanation.includes("1905")) {
        finalExplanation += ` ${exitMessage}`;
      }
    }

    const eligibility = await checkEligibility(intentData.intent, userProfile || {}, specificScheme);

    // 5. Response Construction
    // finalExplanation is already declared and potentially modified above

    // Feature: Alternative Path Suggestion
    // Check various flags for backward compatibility
    const isIneligible =
      (eligibility && eligibility.isEligible === false) ||
      (eligibility && eligibility.eligible === false) ||
      (eligibility && eligibility.status === "Not Eligible");

    if (isIneligible && specificScheme) {
      const altScheme = directMatches.find(s => s.id !== specificScheme.id);
      if (altScheme) {
        finalExplanation += ` You may not qualify for ${specificScheme.name_en}, but you might be interested in ${altScheme.name_en}.`;
      } else {
        finalExplanation += " You may not qualify for this, but please check our other schemes.";
      }
    }

    const responseData = {
      transcript: text,
      language,
      intentData: { ...intentData, explanation: finalExplanation },
      eligibility,
      matchedSchemes: directMatches, // Send raw matches too, frontend can decide to show them
      source: "hybrid_reasoning",
      navigation: intentData.navigation_step || null,
      explanation: finalExplanation
    };

    // 6. Memory Consolidation (Save)
    if (sessionId || userId) {
      await Conversation.create({
        sessionId: sessionId || null,
        userId: userId || null,
        question: text,
        answer: finalExplanation || intentData.explanation || "Processed request."
      });
    }

    return res.json(responseData);

  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
