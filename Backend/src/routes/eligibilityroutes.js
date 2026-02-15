const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function extractJSON(text) {
  // Remove markdown code fences and trim
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  // Find first { and last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

// Ensure the parsed object has all required fields, fill missing with placeholders
function validateLLMData(data, schemeName, lang) {
  const defaultText = {
    en: "Please check official sources",
    hi: "कृपया आधिकारिक स्रोत देखें",
    mr: "कृपया अधिकृत स्रोत पहा"
  };
  const defaultDesc = {
    en: "Information is being processed. Please try again later or visit the official government website.",
    hi: "जानकारी संसाधित की जा रही है। कृपया बाद में पुनः प्रयास करें या आधिकारिक सरकारी वेबसाइट देखें।",
    mr: "माहिती प्रक्रियेत आहे. कृपया नंतर पुन्हा प्रयत्न करा किंवा अधिकृत सरकारी वेबसाइट पहा."
  };
  const fallback = defaultText[lang] || defaultText.en;
  const fallbackDesc = defaultDesc[lang] || defaultDesc.en;

  return {
    name: data.name || schemeName,
    description: data.description || fallbackDesc,
    category: data.category || "General",
    eligibilityCriteria: Array.isArray(data.eligibilityCriteria) && data.eligibilityCriteria.length > 0
      ? data.eligibilityCriteria
      : [fallback],
    benefits: Array.isArray(data.benefits) && data.benefits.length > 0
      ? data.benefits
      : [fallback],
    requiredDocuments: Array.isArray(data.requiredDocuments) && data.requiredDocuments.length > 0
      ? data.requiredDocuments
      : [fallback]
  };
}

router.get("/:schemeId", async (req, res) => {
  try {
    const { schemeId } = req.params;
    const lang = req.query.lang || "en";
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(schemeId);

    // 1️⃣ Database scheme
    if (isObjectId) {
      const scheme = await Scheme.findById(schemeId);
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }

      const getField = (field) => scheme[`${field}_${lang}`] || scheme[`${field}_en`] || scheme[field] || "";
      const eligibilityCriteria = getField("eligibility").split("\n").filter(Boolean);
      const benefits = getField("benefits").split("\n").filter(Boolean);

      return res.json({
        _id: scheme._id,
        name: getField("name"),
        description: getField("description"),
        category: getField("category"),
        eligibilityCriteria,
        benefits,
        requiredDocuments: scheme.documentsRequired || []
      });
    }

    // 2️⃣ LLM-generated scheme (plain name)
    let llmData;
    try {
      // Language instruction
      let languageInstruction = "";
      if (lang === "hi") {
        languageInstruction = "All text fields must be in Hindi.";
      } else if (lang === "mr") {
        languageInstruction = "All text fields must be in Marathi.";
      } else {
        languageInstruction = "All text fields must be in English.";
      }

      const prompt = `
You are a civic assistant. Generate detailed information about the Indian government scheme named "${schemeId}".
${languageInstruction}
Include the following fields in JSON format:
{
  "name": "string",
  "description": "string",
  "category": "string",
  "eligibilityCriteria": ["string"],
  "benefits": ["string"],
  "requiredDocuments": ["string"]
}
Make the content realistic, factual, and helpful. If the exact scheme is not known, create a plausible one based on common government schemes (e.g., education loans, health insurance, pension, housing, etc.). Provide at least two items in each array.
Return ONLY the JSON object.
`;

      // Set a timeout to avoid hanging
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini timeout")), 10000))
      ]);

      const response = await result.response;
      const output = response.text();
      console.log(`Gemini raw output (${lang}):`, output);

      const safeJSON = extractJSON(output);
      let parsed;
      try {
        parsed = JSON.parse(safeJSON);
      } catch (parseErr) {
        console.error("Failed to parse Gemini output:", safeJSON);
        parsed = {};
      }
      llmData = validateLLMData(parsed, schemeId, lang);
    } catch (geminiErr) {
      console.error("Gemini error:", geminiErr.message);
      // Fallback data in the requested language
      llmData = validateLLMData({}, schemeId, lang);
    }

    llmData._id = schemeId;
    return res.json(llmData);

  } catch (err) {
    console.error("Unhandled error in eligibility route:", err);
    // Ultimate fallback – return 200 with dummy data so frontend never breaks
    const lang = req.query.lang || "en";
    const fallback = {
      en: {
        name: req.params.schemeId,
        description: "Service temporarily unavailable. Please try again later.",
        category: "General",
        eligibilityCriteria: ["Please check official sources"],
        benefits: ["Please check official sources"],
        requiredDocuments: ["Please check official sources"]
      },
      hi: {
        name: req.params.schemeId,
        description: "सेवा अस्थायी रूप से अनुपलब्ध है। कृपया बाद में पुनः प्रयास करें।",
        category: "सामान्य",
        eligibilityCriteria: ["कृपया आधिकारिक स्रोत देखें"],
        benefits: ["कृपया आधिकारिक स्रोत देखें"],
        requiredDocuments: ["कृपया आधिकारिक स्रोत देखें"]
      },
      mr: {
        name: req.params.schemeId,
        description: "सेवा तात्पुरती अनुपलब्ध आहे. कृपया नंतर पुन्हा प्रयत्न करा.",
        category: "सामान्य",
        eligibilityCriteria: ["कृपया अधिकृत स्रोत पहा"],
        benefits: ["कृपया अधिकृत स्रोत पहा"],
        requiredDocuments: ["कृपया अधिकृत स्रोत पहा"]
      }
    };
    const langFallback = fallback[lang] || fallback.en;
    return res.json({
      _id: req.params.schemeId,
      ...langFallback
    });
  }
});

module.exports = router;