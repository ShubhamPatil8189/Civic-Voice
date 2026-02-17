const Scheme = require("../models/Scheme");
const { analyzeQuery } = require("../services/geminiService");

// 1. GET all schemes or filter by keyword/category
const getSchemes = async (req, res) => {
  const { keyword, language, category } = req.query;
  const fetchLimit = parseInt(req.query.limit) || 50;

  try {
    let query = {};
    let usingSmartSearch = false;

    // 1. Direct Category/Keyword handling
    if (category && category.trim() !== "") {
      const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.category = new RegExp(escapedCategory, "i");
    }

    if (keyword && keyword.trim() !== "") {
      const regex = new RegExp(keyword, "i");
      query.$or = [
        { name_en: regex }, { description_en: regex },
        { name_hi: regex }, { description_hi: regex },
        { name_mr: regex }, { description_mr: regex },
      ];
    }

    // Try finding with direct matching first (Fast path)
    let schemes = await Scheme.find(query).limit(fetchLimit);

    // 2. Smart Search Fallback (LLM)
    // If we have literally 0 results for a 'category' search, it might be a natural language query
    if (schemes.length === 0 && category && category.trim().length > 3) {
      console.log(`🤖 No direct results for "${category}", calling Smart Search...`);
      try {
        const analysis = await analyzeQuery(category);
        if (analysis && analysis.keywords && analysis.keywords.length > 0) {
          const smartKeywords = analysis.keywords.join(" ");

          // Use Mongo Text Index for smart search
          // This will search Name, Description, and Category fields (as defined in Scheme.js index)
          schemes = await Scheme.find(
            { $text: { $search: smartKeywords } },
            { score: { $meta: "textScore" } }
          )
            .sort({ score: { $meta: "textScore" } })
            .limit(fetchLimit);

          usingSmartSearch = schemes.length > 0;
        }
      } catch (llmErr) {
        console.error("Smart Search failed:", llmErr);
      }
    }

    res.json(schemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Search with Gemini API
const searchWithGeminiAPI = async (req, res) => {
  const { keyword, language = "en" } = req.query;

  if (!keyword || keyword.trim() === "") {
    return res.json({
      success: false,
      message: "Please provide a search keyword",
      schemes: []
    });
  }
  const genAI = new GoogleGenerativeAI("AIzaSyDSpSKwjpTy_w2Fw0r5LVnkaD91GDUd7IA");

  try {
    console.log(`🔍 Searching for: "${keyword}"`);

    // 1. FIRST: Search in local MongoDB
    let localResults = [];
    const regex = new RegExp(keyword, "i");

    if (language === "en") {
      localResults = await Scheme.find({
        $or: [{ name_en: regex }, { description_en: regex }]
      });
    } else if (language === "hi") {
      localResults = await Scheme.find({
        $or: [{ name_hi: regex }, { description_hi: regex }]
      });
    } else if (language === "mr") {
      localResults = await Scheme.find({
        $or: [{ name_mr: regex }, { description_mr: regex }]
      });
    }

    // 2. If found in local DB, return them
    if (localResults.length > 0) {
      return res.json({
        success: true,
        source: "local_database",
        count: localResults.length,
        schemes: localResults,
        message: `Found ${localResults.length} scheme(s) in local database`
      });
    }

    // 3. If NOT found locally, use GEMINI API for suggestions
    console.log("🌐 No local results, asking Gemini for suggestions...");

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a civic scheme expert. The user is searching for: "${keyword}" in ${language}.
      The scheme was not found in our database.
      
      List 3-5 real government schemes that closely match this search.
      
      Return JSON object with a "schemes" array, where each item has:
      - name (Exact official name)
      - description (1 sentence summary)
      - category (e.g. Health, Education, Welfare)
      - eligibility (Short eligibility summary)
      
      Example Item:
      {
        "name": "Pradhan Mantri Awas Yojana",
        "description": "Housing scheme for the poor.",
        "category": "Housing",
        "eligibility": "Annual income < 3 Lakhs"
      }
      
      IMPORTANT:
      - Do NOT make up fake schemes. Only real ones.
      - If unsure, return an empty array.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);

    // Transform formatting to match our frontend Scheme card expectation
    const externalResults = (data.schemes || []).map(s => ({
      _id: s.name, // CRITICAL: Use name as ID so eligibility route can LLM-generate details
      name_en: s.name,
      name_hi: s.name, // API usually returns English/mixed, keeping same for now or could prompt for translation
      name_mr: s.name,
      description_en: s.description,
      description_hi: s.description,
      description_mr: s.description,
      category_en: s.category,
      category_hi: s.category,
      category_mr: s.category,
      eligibility_en: s.eligibility,
      source: "gemini_suggestion",
      isExternal: true
    }));

    return res.json({
      success: true,
      source: "gemini_suggestion",
      count: externalResults.length,
      schemes: externalResults,
      message: externalResults.length > 0
        ? `Found ${externalResults.length} related schemes via AI`
        : `No relevant schemes found for "${keyword}"`
    });

  } catch (error) {
    console.error("Search error:", error);
    // Fallback if Gemini fails
    res.json({
      success: false,
      message: "Could not find schemes nearby. Please try a different verification.",
      schemes: []
    });
  }
};

// 3. Get scheme details
const getSchemeDetails = async (req, res) => {
  const { id } = req.params;
  const { language = "en" } = req.query;

  try {
    // Check if it's an external scheme
    if (id.startsWith("ext-")) {
      return res.json({
        success: true,
        scheme: {
          _id: id,
          name: "External Government Scheme",
          description: "This scheme data is from external source",
          eligibility: "Check official website for eligibility",
          contact: "Contact: 1800-XXX-XXXX",
          website: "https://www.india.gov.in",
          isExternal: true
        },
        language: language
      });
    }

    // Get from local DB
    const scheme = await Scheme.findById(id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found"
      });
    }

    // Return scheme in requested language
    const response = {
      _id: scheme._id,
      name: scheme[`name_${language}`],
      description: scheme[`description_${language}`],
      eligibility: scheme[`eligibility_${language}`],
      category: scheme[`category_${language}`],
      isExternal: false
    };

    res.json({
      success: true,
      scheme: response,
      language: language
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 4. Export ALL functions
module.exports = {
  getSchemes,           // ✅ This must be defined
  searchWithGeminiAPI,  // ✅ Renamed for consistency
  getSchemeDetails      // ✅ This is new
};