const express = require("express");
const router = express.Router();
const Scheme = require("../models/Scheme");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use a stable model – change to "gemini-1.5-pro" if you have access
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to extract JSON from Gemini response (handles markdown and extra text)
function extractJSON(text) {
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
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
  } else if (name.includes("farmer") || name.includes("agriculture")) {
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
  } else if (name.includes("loan") || name.includes("credit")) {
    category = "Loan";
    description = "Subsidized loan for small businesses.";
    eligibility = ["Age 18–55", "Business plan", "No default history"];
    benefits = ["Loan up to ₹5 lakh at 4% interest", "Moratorium period"];
    documents = ["Business plan", "Identity proof", "Bank statements"];
  }

  // If language is Hindi or Marathi, we'd ideally translate, but keep as is for now
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
    const lang = req.query.lang || "en"; // 'en', 'hi', 'mr'
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
    let llmData = null;
    try {
      // Language instruction
      let languageInstruction = "";
      if (lang === "hi") {
        languageInstruction = "Respond in Hindi.";
      } else if (lang === "mr") {
        languageInstruction = "Respond in Marathi.";
      } else {
        languageInstruction = "Respond in English.";
      }

      const prompt = `
You are a civic assistant. Generate detailed, realistic information about the Indian government scheme named "${schemeId}".
${languageInstruction}
Include the following fields in JSON format:
{
  "name": "string",
  "description": "string (a brief overview of the scheme)",
  "category": "string (e.g., Pension, Health, Education, Agriculture, Housing, etc.)",
  "eligibilityCriteria": ["string", "string", ...] (list 2-4 specific criteria),
  "benefits": ["string", "string", ...] (list 2-4 specific benefits),
  "requiredDocuments": ["string", "string", ...] (list 2-4 specific documents)
}
Make the content realistic and factual. Use actual government scheme details if you know them. If the scheme name is unknown, create a plausible but realistic scheme based on the name.
Return ONLY the JSON object.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const output = response.text();
      console.log(`Gemini raw output (${lang}):`, output); // Debug

      const safeJSON = extractJSON(output);
      llmData = JSON.parse(safeJSON);
    } catch (geminiErr) {
      console.error("Gemini error:", geminiErr.message);
      // If first attempt fails, try one more time with a simpler prompt
      try {
        const simplePrompt = `
Generate realistic details for an Indian government scheme called "${schemeId}".
Return JSON with fields: name, description, category, eligibilityCriteria (array), benefits (array), requiredDocuments (array).
Use ${lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}.
        `;
        const result = await model.generateContent(simplePrompt);
        const response = await result.response;
        const output = response.text();
        const safeJSON = extractJSON(output);
        llmData = JSON.parse(safeJSON);
      } catch (secondErr) {
        console.error("Second Gemini attempt also failed:", secondErr.message);
        // Use intelligent fallback based on scheme name
        llmData = generateFallbackData(schemeId, lang);
      }
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

module.exports = router;