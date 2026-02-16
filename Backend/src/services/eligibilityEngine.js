const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 1. Rule Matcher (Fast & Cheap)
const checkRules = (scheme, user) => {
  // If scheme has structured criteria (future proofing), check them here.
  // For now, we only have description text, so we rely more on LLM.
  // However, we can check basic hardcoded logic if the scheme name matches known patterns.

  const name = (scheme.name_en || "").toLowerCase();

  if (name.includes("pension") || name.includes("old age")) {
    if (user.age && user.age < 60) return { eligible: false, reason: "Minimum age for pension is usually 60." };
  }

  if (name.includes("student") || name.includes("scholarship")) {
    if (user.age && user.age > 35) return { eligible: false, reason: "Scholarships are typically for students under 35." };
  }

  return null; // No decisive rule result
};

// 2. LLM Reasoner (Comprehensive)
const checkLLM = async (scheme, user) => {
  const prompt = `
    Task: Determine eligibility for a government scheme.
    
    Scheme: "${scheme.name_en}"
    Description: "${scheme.description_en}"
    Criteria Payload: "${scheme.eligibility_en || ''}"

    User Profile:
    - Age: ${user.age || "Unknown"}
    - Income: ${user.income || "Unknown"}
    - Location: ${user.location || user.state || "Unknown"}
    - Occupation: ${user.occupation || "Unknown"}
    - BPL Card Holder: ${user.bplCardHolder ? "Yes" : "No"}
    - Disability: ${user.disability ? "Yes" : "No"}
    - Student: ${user.student ? "Yes" : "No"}
    - Veteran: ${user.veteran ? "Yes" : "No"}
    - Household Type: ${user.householdType || "Unknown"}
    - Car Owner: ${user.carOwner ? "Yes" : "No"}

    Based STRICTLY on the description, is the user eligible?
    - If eligible, say "Eligible".
    - If not, say "Not Eligible" and give the specific reason (e.g. "Income too high").
    - If data is missing (e.g. scheme needs Age but user didn't provide it), say "Potentially Eligible" and list what is missing.

    Return JSON: { "status": "Eligible" | "Not Eligible" | "Potentially Eligible", "reason": "string" }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Eligibility Engine LLM Error:", e);
    return { status: "Unknown", reason: "Could not verify details." };
  }
};

exports.checkEligibility = async (intent, user = {}, specificScheme = null) => {
  // If a specific scheme is selected (e.g. from DB match), check that.
  if (specificScheme) {
    // 1. Try Rules
    const ruleResult = checkRules(specificScheme, user);
    if (ruleResult) return ruleResult;

    // 2. Try LLM
    return await checkLLM(specificScheme, user);
  }

  // Fallback for generic intent (Legacy behavior or generic advice)
  return {
    status: "General Advice",
    reason: "Please select a specific scheme to check eligibility."
  };
};