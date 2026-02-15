const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function extractJSON(text) {
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

exports.analyzeIntent = async (text, history = []) => {
  const historyText = history
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  const prompt = `
You are a civic assistant helping citizens understand government schemes.
The user may speak in Hindi, Marathi, English, or a mix. Understand the intent even if informal.

Conversation so far:
${historyText || "None"}

Current user message: "${text}"

Based on the entire conversation, determine:
- The user's core intent (e.g., "pension enquiry", "education loan", "housing scheme", "health insurance").
- What information is missing to check eligibility (list fields like age, income, state, gender, etc.).
- A confidence score (0 to 1) for your intent inference.
- If you can already suggest specific schemes, list them with a short reason.
- If you need more information, provide a follow‑up question to ask the user next.
- Finally, give a helpful explanation that guides the user.

Return ONLY a JSON object with these fields:
{
  "intent": "string",
  "missing_fields": ["string"],
  "confidence": number,
  "suggested_schemes": [{"name": "string", "reason": "string"}],
  "follow_up_question": "string",
  "explanation": "string"
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const output = response.text();
  const safeJSON = extractJSON(output);

  try {
    return JSON.parse(safeJSON);
  } catch (err) {
    console.error("Gemini JSON parse failed:", safeJSON);
    return {
      intent: "UNKNOWN",
      missing_fields: [],
      confidence: 0,
      suggested_schemes: [],
      follow_up_question: "I didn't understand. Could you please rephrase?",
      explanation: "I'm having trouble understanding. Please try again."
    };
  }
};