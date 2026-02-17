const Scheme = require("../models/Scheme");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const VoiceSession = require("../models/VoiceSession");
const UniqueQuery = require("../models/UniqueQuery");
const { analyzeIntent } = require("../services/geminiService");
const { checkEligibility } = require("../services/eligibilityEngine");
const { normalizeQuery, areSimilar } = require("../utils/querySimilarity");

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

    // 1. Smart Query Analysis (LLM First)
    const { analyzeQuery } = require("../services/geminiService");
    const analysis = await analyzeQuery(text);
    console.log("🧠 Query Analysis:", analysis);

    let directMatches = [];

    // 2. Conditional Database Search
    if (analysis.intent === "scheme_search" && analysis.keywords.length > 0) {
      // Construct robust $or query with extracted keywords
      const searchConditions = analysis.keywords.flatMap(kw => {
        const regex = new RegExp(kw, "i");
        return [
          { name_en: regex }, { description_en: regex },
          { name_hi: regex }, { description_hi: regex },
          { name_mr: regex }, { description_mr: regex }
        ];
      });

      directMatches = await Scheme.find({ $or: searchConditions })
        .limit(5)
        .select("name_en description_en id");

      console.log(`🔎 Found ${directMatches.length} schemes matching keywords: ${analysis.keywords.join(", ")}`);
    } else {
      console.log("⏩ Skipping DB search for general doubt/chat.");
    }

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

    // Strategy C: LLM Fallback - If still no matches, ask Gemini for scheme suggestions
    if (directMatches.length === 0 && analysis.intent === "scheme_search") {
      console.log("🌐 No local results, calling Gemini API for scheme suggestions...");
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: "gemini-flash-latest",
          generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
          You are a civic scheme expert. The user is searching for: "${text}" in ${language}.
          The scheme was not found in our database.
          
          List 3-5 real government schemes that closely match this search.
          
          Return JSON object with a "schemes" array, where each item has:
          - name (Exact official name)
          - description (1 sentence summary)
          - category (e.g. Health, Education, Welfare, Women Empowerment)
          - eligibility (Short eligibility summary)
          
          IMPORTANT:
          - Do NOT make up fake schemes. Only real ones.
          - If unsure, return an empty array.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text_response = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(text_response);

        // Transform to match schema format
        directMatches = (data.schemes || []).map(s => ({
          id: s.name, // Use name as ID for LLM-generated details
          name_en: s.name,
          description_en: s.description,
          category_en: s.category,
          isExternal: true,
          source: "gemini_suggestion"
        }));

        console.log(`✨ Gemini suggested ${directMatches.length} schemes via AI`);
      } catch (llmError) {
        console.error("Gemini fallback failed:", llmError);
        // Continue with empty matches if LLM fails
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

    const intentData = await analyzeIntent(text, history, directMatches, isLongConversation, language);

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

    // 7. Smart FAQ Learning (Query Tracking)
    try {
      // 💾 Save raw voice session
      await VoiceSession.create({
        spokenText: text,
        detectedLanguage: language || "en",
        extractedData: intentData,
        matchedSchemes: directMatches
      });

      // 🔍 Track unique queries for FAQ generation
      if (text && text.trim().length > 3) {
        const normalized = normalizeQuery(text);

        // Find all unique queries to check for semantic similarity
        // Ideally, this should be optimized with vector search in production, 
        // but for hackathon scale, linear scan or simple text index is acceptable.
        // We'll use the utility function to find a match.

        const allQueries = await UniqueQuery.find();
        let foundSimilar = null;

        for (const query of allQueries) {
          if (areSimilar(text, query.originalQuery)) {
            foundSimilar = query;
            break;
          }
        }

        if (foundSimilar) {
          // Increment count for existing similar query
          foundSimilar.searchCount += 1;
          foundSimilar.lastSearched = new Date();
          // Add to related variations if unique enough
          if (!foundSimilar.relatedQueries.includes(text) && text.length < 100) {
            foundSimilar.relatedQueries.push(text);
          }
          await foundSimilar.save();
        } else {
          // Create new unique query entry
          await UniqueQuery.create({
            normalizedQuery: normalized,
            originalQuery: text, // Keep original casing/phrasing for better display
            searchCount: 1,
            language: language || "en",
            relatedQueries: []
          });
        }
      }
    } catch (trackError) {
      console.error("⚠️ Query tracking failed:", trackError.message);
      // Don't fail the request, just log it
    }

    return res.json(responseData);

  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};
