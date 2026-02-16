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

    // 1️⃣ Database scheme - Enhanced with LLM Analysis
    if (isObjectId) {
      const scheme = await Scheme.findById(schemeId).lean();
      if (!scheme) return res.status(404).json({ message: "Scheme not found" });

      const steps = scheme.applicationProcess?.steps || [];
      // Detect if steps are "messy" (e.g., one giant paragraph instead of actual steps)
      const isStepsMessy = steps.length === 1 && (steps[0].description || steps[0].stepTitle || "").length > 300;

      // Check if we have rich CSV data AND it's clean enough to use directly
      const hasRichData = scheme.eligibilityCriteria &&
        (Array.isArray(scheme.benefits) && scheme.benefits.length > 0) &&
        (Array.isArray(scheme.documents) && scheme.documents.length > 0) &&
        !isStepsMessy; // Only use CSV if steps aren't a mess

      // If CSV data is comprehensive and CLEAN, use it directly (ZERO API calls)
      if (hasRichData) {
        console.log(`✅ Using rich CSV data for scheme: ${scheme.name_en || scheme.name}`);

        const getField = (field) => scheme[`${field}_${lang}`] || scheme[`${field}_en`] || scheme[field] || "";

        // Helper to summarize long descriptions locally (free!)
        const summarizeLocally = (text) => {
          if (!text) return "";
          if (text.length < 300) return text;
          // Take first 2 sentences
          const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
          return sentences.slice(0, 2).join(" ") + (sentences.length > 2 ? ".." : "");
        };

        const rawDescription = getField("description");
        const cleanDescription = summarizeLocally(rawDescription);

        // Format eligibility criteria
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

        // Ensure steps usually have a title
        const cleanSteps = steps.map((s, i) => ({
          stepTitle: s.stepTitle || `Step ${i + 1}`,
          description: s.description || s.action || "",
          estimatedTime: s.estimatedTime || ""
        }));

        return res.json({
          _id: scheme._id,
          name: getField("name"),
          description: cleanDescription, // Summarized
          category: scheme.category || "Government Scheme",
          eligibilityCriteria: eligibilityCriteria.length > 0 ? eligibilityCriteria : ["Open to all eligible citizens"],
          benefits: Array.isArray(scheme.benefits) ? scheme.benefits : [],
          requiredDocuments: scheme.documents || scheme.documentsRequired || [],
          steps: cleanSteps,
          officialWebsite: scheme.officialWebsite || null
        });
      }

      // If CSV data is incomplete, use LLM for enrichment (1 API call per scheme)
      console.log(`🧠 Using LLM to enrich incomplete data for: ${scheme.name_en || scheme.name}`);

      try {
        const prompt = `You are analyzing a government scheme from the database. Your job is to provide clear, actionable information.

**Scheme Data from Database:**
Name: ${scheme.name_en || scheme.name || "Unknown"}
Description: ${scheme.description_en || scheme.description || "No description"}
Category: ${scheme.category || "N/A"}
Level: ${scheme.level || "Central"}
State: ${scheme.states && scheme.states.length > 0 ? scheme.states[0] : "N/A"}
Eligibility: ${JSON.stringify(scheme.eligibilityCriteria || {})}
Benefits: ${JSON.stringify(scheme.benefits || [])}
Documents: ${JSON.stringify(scheme.documents || [])}
Existing Application Process: ${JSON.stringify(scheme.applicationProcess?.steps || [])}

**Task 1 - Construct Official Website URL:**
Based on the scheme name, category, and level, construct the most likely official URL:
- For Central schemes: Use https://www.india.gov.in or ministry-specific URLs
- For AICTE/Education: Use https://www.aicte-india.org
- For State schemes: Use the state government portal (e.g., https://maharashtra.gov.in)
- For specific ministries: Construct based on scheme name (e.g., PM Kisan -> https://pmkisan.gov.in)

**Task 2 - Generate 3-4 CONCISE Application Steps:**
If "Existing Application Process" has detailed steps, SUMMARIZE them into 3-4 short steps.
Otherwise, create logical steps based on the scheme type.

**Output Format (JSON only, no markdown):**
{
  "name": "Scheme name",
  "description": "2 sentence summary",
  "eligibilityCriteria": ["Who can apply - be specific"],
  "benefits": ["What you get"],
  "requiredDocuments": ["Documents needed"],
  "applicationSteps": [
    {"stepTitle": "Visit Portal", "description": "Go to official website and register", "estimatedTime": "5 mins"},
    {"stepTitle": "Fill Form", "description": "Complete application with documents", "estimatedTime": "15 mins"},
    {"stepTitle": "Submit & Track", "description": "Submit application and note reference number", "estimatedTime": "2 mins"}
  ],
  "officialWebsite": "https://most-likely-url-based-on-scheme-name.gov.in"
}

**Critical Rules:**
1. Keep steps to exactly 3-4 items (max 10 words per description)
2. Use actual government URL patterns (pmkisan.gov.in, aicte-india.org, etc.)
3. Make educated guesses for URLs based on scheme name
4. Don't say "Not available" - construct the most logical URL

Return ONLY valid JSON, no markdown or explanations.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const llmData = JSON.parse(jsonText);

        return res.json({
          _id: scheme._id,
          name: llmData.name || scheme.name_en,
          description: llmData.description || scheme.description_en,
          category: scheme.category,
          eligibilityCriteria: llmData.eligibilityCriteria || [],
          benefits: llmData.benefits || [],
          requiredDocuments: llmData.requiredDocuments || [],
          steps: llmData.applicationSteps || [],
          officialWebsite: llmData.officialWebsite || scheme.officialWebsite || null
        });

      } catch (llmError) {
        console.error("⚠️ LLM enrichment failed, using enhanced raw data:", llmError.message);

        // Helper to summarize long descriptions locally (same as above)
        const summarizeLocally = (text) => {
          if (!text) return "";
          if (text.length < 300) return text;
          const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
          return sentences.slice(0, 2).join(" ") + (sentences.length > 2 ? ".." : "");
        };

        const getField = (field) => scheme[`${field}_${lang}`] || scheme[`${field}_en`] || scheme[field] || "";

        const rawDescription = getField("description");
        const cleanDescription = summarizeLocally(rawDescription);

        const eligibilityRaw = scheme.eligibilityCriteria || {};
        const eligibilityCriteria = [
          eligibilityRaw.minAge ? `Age: ${eligibilityRaw.minAge}-${eligibilityRaw.maxAge || 100}` : null,
          eligibilityRaw.incomeLessThan ? `Income < ₹${eligibilityRaw.incomeLessThan}` : null
        ].filter(Boolean);

        // Attempt to clean steps locally if they exist
        const steps = scheme.applicationProcess?.steps || [];
        let cleanSteps = [];

        if (steps.length > 0) {
          cleanSteps = steps.map((s, i) => ({
            stepTitle: s.stepTitle || `Step ${i + 1}`,
            description: s.description || s.action || "",
            estimatedTime: s.estimatedTime || ""
          }));

          // If it's one giant step, try to split it blindly by "Step" or numbers if possible, 
          // otherwise just truncate it for display safety or leave it (user prefers messy over nothing?)
          // User actually complained about it being messy. Let's try to split by periods for a "list" view.
          if (cleanSteps.length === 1 && cleanSteps[0].description.length > 300) {
            const chunks = cleanSteps[0].description.split(/(?=\bStep\b|\b\d+\.\s)/g).filter(c => c.length > 10);
            if (chunks.length > 1) {
              cleanSteps = chunks.map((c, i) => ({
                stepTitle: `Step ${i + 1}`,
                description: c.trim(),
                estimatedTime: ""
              }));
            }
          }
        }

        return res.json({
          _id: scheme._id,
          name: getField("name"),
          description: cleanDescription, // Summarized
          category: scheme.category,
          eligibilityCriteria: eligibilityCriteria.length > 0 ? eligibilityCriteria : ["Check official website"],
          benefits: Array.isArray(scheme.benefits) ? scheme.benefits : [],
          requiredDocuments: scheme.documents || [],
          steps: cleanSteps,
          officialWebsite: scheme.officialWebsite || null
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