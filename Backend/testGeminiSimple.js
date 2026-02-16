require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Gemini API...");
    console.log("Key:", process.env.GEMINI_API_KEY ? "Loaded (starts with " + process.env.GEMINI_API_KEY.substring(0, 5) + ")" : "Not Loaded");

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Sending request to gemini-1.5-flash...");
        const result = await model.generateContent("Say 'Hello, Gemini is working!'");
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ SUCCESS!");
        console.log("Response:", text);
    } catch (error) {
        console.error("\n❌ ERROR:");
        console.error(error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
        }
    }
}

testGemini();
