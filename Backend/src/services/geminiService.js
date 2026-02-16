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

exports.analyzeIntent = async (text, history = [], contextSchemes = []) => {
  const historyText = history
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  const prompt = `
You are a civic assistant helping citizens understand government schemes.
The user may speak in Hindi, Marathi, English, or a mix. Understand the intent even if informal.

Conversation so far:
${historyText || "None"}

Current user message: "${text}"

Context (Potential Schemes Found):
${JSON.stringify(history.contextSchemes || [])}

Based on the entire conversation, determine:
- The user's core intent (e.g., "pension enquiry", "education loan", "check eligibility", "how to apply").
- If the user is asking for a specific procedure (e.g., "how do I apply?"), treat it as a "navigation" intent.
- Evaluate eligibility based on user details provided in conversation or profile.
- If you need more information, provide a ONE-SENTENCE follow-up question.
- Provide a helpful, natural language explanation (max 2-3 sentences) that directly answers the user.

Return ONLY a JSON object with these fields:
{
  "intent": "string",
  "missing_fields": ["string"],
  "confidence": number,
  "suggested_schemes": [{"name": "string", "reason": "string"}],
  "follow_up_question": "string",
  "explanation": "string",
  "navigation_step": "string or null" // e.g., "Step 1: Gather Documents" if explaining a process
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
      explanation: "I'm having trouble understanding. Please try again.",
      navigation_step: null
    };
  }
};