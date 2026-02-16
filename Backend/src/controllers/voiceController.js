const Scheme = require("../models/Scheme");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const UniqueQuery = require("../models/UniqueQuery");
const { analyzeIntent } = require("../services/geminiService");
const { checkEligibility } = require("../services/eligibilityEngine");

// Simple query normalization
const normalizeQuery = (query) => {
  return query.toLowerCase().trim().replace(/[^\w\s]/g, '');
};

// Check if two queries are similar (basic implementation)
const areSimilar = (q1, q2) => {
  const norm1 = normalizeQuery(q1);
  const norm2 = normalizeQuery(q2);

  // Exact match
  if (norm1 === norm2) return true;

  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  return false;
};

exports.processVoice = async (req, res) => {
  try {
    const { text, language, sessionId } = req.body;
    const userId = req.user ? req.user.userId : null;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    // Track unique queries for FAQ generation
    if (text && text.trim() !== "") {
      try {
        const normalized = normalizeQuery(text);

        // Use findOneAndUpdate with upsert for atomic operation
        await UniqueQuery.findOneAndUpdate(
          { normalizedQuery: normalized },
          {
            $set: {
              originalQuery: text,
              lastSearched: new Date(),
              language: language || "en"
            },
            $inc: { searchCount: 1 },
            $addToSet: { relatedQueries: text }
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );
      } catch (queryErr) {
        console.error("Query tracking error:", queryErr);
      }
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
        explanation: intentData.explanation,
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
