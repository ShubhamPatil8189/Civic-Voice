const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from current directory
dotenv.config({ path: path.join(__dirname, ".env") });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not set in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const candidates = [
        "gemini-flash-latest",
        "gemini-pro-latest",
        "gemini-2.0-flash-lite-001",
        "gemini-1.5-flash-latest"
    ];

    console.log("Testing generation with candidates...");

    for (const modelName of candidates) {
        try {
            console.log(`\n👉 Testing: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            const response = await result.response;
            console.log(`✅ SUCCESS: ${modelName} works!`);
            console.log(`Response: ${response.text()}`);

            // If one works, we usually want to stop, but let's see all options.
        } catch (error) {
            console.log(`❌ FAILED: ${modelName}`);
            // Log brief error to avoid clutter
            let msg = error.message;
            if (msg.includes("404")) msg = "404 Not Found";
            if (msg.includes("429")) msg = "429 Quota Exceeded";
            console.log(`Error: ${msg}`);
        }
    }
}

testModels();
