const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: { responseMimeType: "application/json" }
});

// Helper to clean formatting if JSON mode still includes backticks (unlikely but safe)
function extractJSON(text) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

// Generate fallback data based on scheme name keywords (used if Gemini fails)
function generateFallbackData(schemeName, lang) {
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

const Step = require("../models/Step"); // Import Step model

// Unified endpoint – handles both MongoDB ObjectIds and plain scheme names
router.get("/:schemeId", async (req, res) => {
  try {
    const { schemeId } = req.params;
    const lang = req.query.lang || "en";
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(schemeId);

    // 1️⃣ Database scheme - Enhanced with LLM Analysis
    if (isObjectId) {
      const scheme = await Scheme.findById(schemeId).lean();
      if (!scheme) return res.status(404).json({ message: "Scheme not found" });

      const steps = scheme.applicationProcess?.steps || [];
      const isStepsMessy = steps.length === 1 && (steps[0].description || steps[0].stepTitle || "").length > 300;

      const hasRichData = scheme.eligibilityCriteria &&
        (Array.isArray(scheme.benefits) && scheme.benefits.length > 0) &&
        (Array.isArray(scheme.documents) && scheme.documents.length > 0) &&
        !isStepsMessy;

      if (hasRichData) {
        // console.log(`✅ Using rich CSV data for scheme: ${scheme.name_en || scheme.name}`);
        const getField = (field) => scheme[`${field}_${lang}`] || scheme[`${field}_en`] || scheme[field] || "";
        const summarizeLocally = (text) => {
          if (!text) return "";
          if (text.length < 300) return text;
          const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
          return sentences.slice(0, 2).join(" ") + (sentences.length > 2 ? ".." : "");
        };

        const rawDescription = getField("description");
        const cleanDescription = summarizeLocally(rawDescription);

        let eligibilityCriteria = [];
        if (scheme.eligibilityCriteria) {
          const ec = scheme.eligibilityCriteria;
          if (ec.minAge || ec.maxAge) eligibilityCriteria.push(`Age: ${ec.minAge || 0} - ${ec.maxAge || 100} years`);
          if (ec.incomeLessThan) eligibilityCriteria.push(`Annual Income: Less than ₹${ec.incomeLessThan.toLocaleString('en-IN')}`);
          if (ec.bplRequired) eligibilityCriteria.push("BPL Card Required");
          if (ec.householdType && ec.householdType !== "Both") eligibilityCriteria.push(`Household Type: ${ec.householdType}`);
          if (ec.studentRequired) eligibilityCriteria.push("Must be a Student");
          if (ec.disabilityRequired) eligibilityCriteria.push("Disability Certificate Required");
        }

        const cleanSteps = steps.map((s, i) => ({
          stepTitle: s.stepTitle || `Step ${i + 1}`,
          description: s.description || s.action || "",
          estimatedTime: s.estimatedTime || ""
        }));

        return res.json({
          _id: scheme._id,
          name: getField("name"),
          description: cleanDescription,
          category: scheme.category || "Government Scheme",
          eligibilityCriteria: eligibilityCriteria.length > 0 ? eligibilityCriteria : ["Open to all eligible citizens"],
          benefits: Array.isArray(scheme.benefits) ? scheme.benefits : [],
          requiredDocuments: scheme.documents || scheme.documentsRequired || [],
          steps: cleanSteps,
          officialWebsite: scheme.officialWebsite || null
        });
      }

      // If CSV data is incomplete, use LLM for enrichment
      // console.log(`🧠 Using LLM to enrich incomplete data for: ${scheme.name_en || scheme.name}`);

      try {
        const prompt = `You are analyzing a government scheme from the database. Provide clear information.
        
Scheme: ${scheme.name_en || scheme.name}
Description: ${scheme.description_en || scheme.description}
Existing Steps: ${JSON.stringify(scheme.applicationProcess?.steps || [])}

Task: Generate 3-4 CONCISE Application Steps. If existing steps are detailed, summarize them.
Return JSON: { "applicationSteps": [{ "stepTitle": "Title", "description": "Desc", "estimatedTime": "Time" }] }
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = extractJSON(response.text());
        const llmData = JSON.parse(jsonText);

        const steps = llmData.applicationSteps || [];

        return res.json({
          _id: scheme._id,
          name: scheme.name_en || scheme.name,
          description: scheme.description_en || scheme.description,
          category: scheme.category,
          eligibilityCriteria: scheme.eligibilityCriteria, // Use existing if not enriching fully
          benefits: scheme.benefits || [],
          requiredDocuments: scheme.documents || [],
          steps: steps,
          officialWebsite: scheme.officialWebsite || null
        });

      } catch (llmError) {
        // Fallback to raw data if LLM fails for enrichment
        // ... (simplified fallback logic for brevity/robustness)
        return res.json({
          _id: scheme._id,
          name: scheme.name_en || scheme.name,
          description: scheme.description_en || scheme.description,
          steps: []
        });
      }
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
        - applicationSteps (Array of objects looking like: { "stepTitle": "Step Name", "description": "Action to take", "estimatedTime": "Time" })
        
        IMPORTANT: You MUST provide "applicationSteps" so the user knows how to apply.
        If precise details are unknown, infer plausible standard government procedures (e.g., "Visit official website", "Register", "Upload documents").
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const output = response.text();
      // console.log("Gemini Output:", output);

      llmData = JSON.parse(extractJSON(output));

      // Map applicationSteps to 'steps' for frontend compatibility
      const steps = Array.isArray(llmData.applicationSteps) ? llmData.applicationSteps : [];

      // Ensure all list fields are actually arrays to prevent frontend crashes
      llmData.eligibilityCriteria = Array.isArray(llmData.eligibilityCriteria) ? llmData.eligibilityCriteria : [];
      llmData.benefits = Array.isArray(llmData.benefits) ? llmData.benefits : [];
      llmData.requiredDocuments = Array.isArray(llmData.requiredDocuments) ? llmData.requiredDocuments : [];
      llmData.steps = steps;

    } catch (geminiErr) {
      console.error("Gemini failed, using fallback:", geminiErr.message);
      llmData = generateFallbackData(schemeId, lang);
      // Add generic steps to fallback
      llmData.steps = [
        { stepTitle: "Check Official Website", description: "Visit the respective department website for details.", estimatedTime: "5 mins" },
        { stepTitle: "Visit Local Office", description: "Contact your nearest Tehsil or Ward office.", estimatedTime: "1 hour" }
      ];
    }

    // Ensure ID is set
    llmData._id = schemeId;

    return res.json(llmData);

  } catch (err) {
    console.error("Route error:", err);
    return res.status(500).json({ error: "Server error" });
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

// 4️⃣ Suggest Alternatives (LLM)
router.post("/suggest-alternatives", async (req, res) => {
  try {
    const { userProfile, originalSchemeName, category } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: "Missing user profile" });
    }

    const prompt = `
      You are a smart civic assistant.
      The user applied for the scheme: "${originalSchemeName}" (Category: ${category}) but was found NOT ELIGIBLE.
      
      User Profile: ${JSON.stringify(userProfile)}
      
      Suggest 3 ALTERNATIVE government schemes (Central or State) that:
      1. Are in the same or similar category (e.g. if they wanted a loan, suggest other loans/grants).
      2. The user is highly likely to be ELIGIBLE for based on their profile.
      
      Return JSON object with key "suggestions":
      [
        {
          "name": "Scheme Name",
          "reason": "Why they are eligible (1 sentence)",
          "category": "Scheme Category"
        }
      ]
      
      IMPORTANT:
      - Only real schemes.
      - Return exactly 3 suggestions.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = extractJSON(response.text());
    const data = JSON.parse(jsonText);

    res.json({
      success: true,
      suggestions: data.suggestions || []
    });

  } catch (error) {
    console.error("Alternative suggestion error:", error);
    // Fallback: Return empty list rather than crash
    res.json({ success: false, suggestions: [] });
  }
});

module.exports = router;