const dotenv = require("dotenv");
const path = require("path");

// Load .env from current directory
dotenv.config({ path: path.join(__dirname, ".env") });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is not set in .env");
    process.exit(1);
}

async function listModels() {
    try {
        console.log(`Checking models with key: ${apiKey.substring(0, 5)}...`);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            const text = await response.text();
            console.error(`API Error: ${response.status} ${response.statusText}`);
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
            });
        } else {
            console.log("No models found.");
        }

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

listModels();
