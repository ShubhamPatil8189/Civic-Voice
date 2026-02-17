// Comprehensive Gemini Model Check
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkModels() {
    console.log("🔍 Testing API Key:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + "..." : "MISSING");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    console.log("\nAttempting to generate content with common models...\n");

    for (const modelName of models) {
        try {
            process.stdout.write(`Testing ${modelName.padEnd(25)}: `);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            console.log("✅ WORKS!");
        } catch (error) {
            if (error.message.includes("404")) {
                console.log("❌ 404 Not Found (Invalid model or API not enabled)");
            } else if (error.message.includes("429")) {
                console.log("⚠️  429 Quota Exceeded (Model exists but quota full)");
            } else {
                console.log(`❌ Error: ${error.message.substring(0, 50)}...`);
            }
        }
    }
}

checkModels();
