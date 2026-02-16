const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

// Helper to clean formatting if JSON mode still includes backticks (unlikely but safe)
function extractJSON(text) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

// Generate fallback data based on scheme name keywords (used if Gemini fails)
function generateFallbackData(schemeName, lang) {
  // ... existing fallback code ...
  const name = schemeName.toLowerCase();
  let category = "General";
  let description = "Government scheme for citizen welfare.";
  let eligibility = ["Check official website for eligibility"];
  let benefits = ["Financial assistance", "Government support"];
  let documents = ["Identity proof", "Address proof"];

  if (name.includes("pension") || name.includes("old age")) {
    category = "Pension";
    description = "Monthly pension for senior citizens.";
    eligibility = ["Age 60 years or above", "BPL card holder", "No regular income"];
    benefits = ["₹1500 per month pension", "Medical allowance"];
    documents = ["Age proof", "BPL certificate", "Bank account details"];
  } else if (name.includes("health") || name.includes("medical") || name.includes("insurance")) {
    category = "Health";
    description = "Health insurance coverage for families.";
    eligibility = ["Family income below ₹3 lakh", "Resident of the state"];
    benefits = ["Cashless treatment up to ₹5 lakh", "Free medicines"];
    documents = ["Income certificate", "Aadhar card", "Ration card"];
  } else if (name.includes("education") || name.includes("student") || name.includes("scholarship")) {
    category = "Education";
    description = "Scholarship for meritorious students.";
    eligibility = ["Family income below ₹2.5 lakh", "Minimum 60% marks", "Enrolled in recognized institution"];
    benefits = ["Tuition fee reimbursement up to ₹10,000", "Monthly stipend"];
    documents = ["Income certificate", "Marksheets", "College ID"];
  } else if (name.includes("farmer") || name.includes("agriculture") || name.includes("kisan")) {
    category = "Agriculture";
    description = "Financial assistance for small farmers.";
    eligibility = ["Landholding up to 2 hectares", "Farmer ID card", "No default on previous loans"];
    benefits = ["Direct cash transfer of ₹6,000 per year", "Subsidized seeds and fertilizers"];
    documents = ["Land records", "Farmer ID", "Bank passbook"];
  } else if (name.includes("housing") || name.includes("awas") || name.includes("house")) {
    category = "Housing";
    description = "Subsidy for affordable housing.";
    eligibility = ["EWS/LIG category", "No pucca house", "Annual income below ₹3 lakh"];
    benefits = ["Subsidy up to ₹2.5 lakh", "Low-interest loan"];
    documents = ["Income certificate", "Aadhar card", "Property documents"];
  } else if (name.includes("loan") || name.includes("credit") || name.includes("business")) {
    category = "Loan";
    description = "Subsidized loan for small businesses.";
    eligibility = ["Age 18–55", "Business plan", "No default history"];
    benefits = ["Loan up to ₹5 lakh at 4% interest", "Moratorium period"];
    documents = ["Business plan", "Identity proof", "Bank statements"];
  }

  return {
    name: schemeName,
    description,
    category,
    eligibilityCriteria: eligibility,
    benefits,
    requiredDocuments: documents
  };
}

// Unified endpoint – handles both MongoDB ObjectIds and plain scheme names
router.get("/:schemeId", async (req, res) => {
  try {
    const { schemeId } = req.params;
    const lang = req.query.lang || "en";
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(schemeId);

    // 1️⃣ Database scheme
    if (isObjectId) {
      const scheme = await Scheme.findById(schemeId);
      if (!scheme) return res.status(404).json({ message: "Scheme not found" });

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
    // First, try fallback logic to see if we have hardcoded data for speed
    // But user wants LLM for specific details, so we use LLM primarily.

    let llmData = null;
    try {
      const prompt = `
        You are a civic assistant. Generate detailed information for the scheme: "${schemeId}" in ${lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}.
        
        Return JSON object with:
        - name
        - description (2 sentences)
        - category (Health, Education, Agriculture, etc.)
        - eligibilityCriteria (Array of strings, 3-5 bullets)
        - benefits (Array of strings, 3-5 bullets)
        - requiredDocuments (Array of strings, 3-5 bullets)
        
        If precise details are unknown, hallu... I mean, infer plausible details based on the scheme name.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const output = response.text();
      // console.log("Gemini Output:", output);

      llmData = JSON.parse(extractJSON(output));

    } catch (geminiErr) {
      console.error("Gemini failed, using fallback:", geminiErr.message);
      llmData = generateFallbackData(schemeId, lang);
    }

    // Ensure all fields exist
    llmData._id = schemeId;
    llmData.name = llmData.name || schemeId;
    llmData.description = llmData.description || "Government scheme for citizen welfare.";
    llmData.category = llmData.category || "General";
    llmData.eligibilityCriteria = llmData.eligibilityCriteria?.length ? llmData.eligibilityCriteria : ["Check official website"];
    llmData.benefits = llmData.benefits?.length ? llmData.benefits : ["Financial assistance"];
    llmData.requiredDocuments = llmData.requiredDocuments?.length ? llmData.requiredDocuments : ["Identity proof", "Address proof"];

    return res.json(llmData);

  } catch (err) {
    console.error("Unhandled error in eligibility route:", err);
    // Ultimate fallback – always return something
    return res.json({
      _id: req.params.schemeId,
      name: req.params.schemeId,
      description: "Service temporarily unavailable. Please try again later.",
      category: "General",
      eligibilityCriteria: ["Please check official sources"],
      benefits: ["Please check official sources"],
      requiredDocuments: ["Please check official sources"]
    });
  }
});

// 3️⃣ Check Eligibility logic (Rule + LLM)
router.post("/check", async (req, res) => {
  try {
    const { schemeData, userProfile } = req.body;

    if (!schemeData || !userProfile) {
      return res.status(400).json({
        status: "Error",
        reason: "Missing scheme data or user profile."
      });
    }

    // Import the engine dynamically or ensure it's required at top
    const { checkEligibility } = require("../services/eligibilityEngine");

    // Construct a "scheme" object that the engine expects
    // If schemeData has an ID, we might want to fetch it fully, but for now use what's passed
    // schemeData can be the full scheme object from frontend

    // The engine expects: { name_en, description_en, eligibility_en }
    // Frontend might pass: { name, description, eligibilityCriteria }
    // Let's normalize it
    const normalizedScheme = {
      name_en: schemeData.name || schemeData.name_en,
      description_en: schemeData.description || schemeData.description_en,
      eligibility_en: Array.isArray(schemeData.eligibilityCriteria)
        ? schemeData.eligibilityCriteria.join(". ")
        : (schemeData.eligibility || "")
    };

    const result = await checkEligibility("check_eligibility", userProfile, normalizedScheme);

    return res.json(result);

  } catch (err) {
    console.error("Eligibility check error:", err);
    res.status(500).json({
      status: "Error",
      reason: "Internal server error during check."
    });
  }
});

module.exports = router;