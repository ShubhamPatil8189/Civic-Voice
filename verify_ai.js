require("dotenv").config({ path: "Backend/.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("🔑 Testing Gemini API Key...");
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
        console.error("❌ No API KEY found in Backend/.env");
        return;
    }
    console.log("Key found:", key.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        console.log("📡 Sending test prompt...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("✅ API Success! Response:", text);
    } catch (error) {
        console.error("❌ API Failed:", error.message);
        if (error.message.includes("403")) {
            console.error("👉 Check if the API key is valid and has Generative AI API enabled.");
        }
    }
}

testGemini();
