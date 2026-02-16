const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Force API Key for testing context
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "REDACTED_GEMINI_API_KEY";

const { analyzeQuery } = require('./src/services/geminiService');
const Scheme = require('./src/models/Scheme');

async function testSmartSearch() {
    try {
        console.log('🔌 Connecting to DB...');
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not found in .env");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.\n');

        // Test Case 1: Scheme Search (Indirect/Synonym)
        const query1 = "I need money for my daughter's wedding";
        console.log(`\n🧪 Test 1: "${query1}"`);

        // 1. Analyze
        const analysis1 = await analyzeQuery(query1);
        console.log("🧠 Analysis:", analysis1);

        // 2. Search Logic
        if (analysis1.intent === "scheme_search") {
            const searchConditions = analysis1.keywords.flatMap(kw => {
                const regex = new RegExp(kw, "i");
                return [
                    { name_en: regex }, { description_en: regex }
                ];
            });

            const count = await Scheme.countDocuments({ $or: searchConditions });
            console.log(`🔎 Found ${count} potential matches in DB using keywords: ${analysis1.keywords.join(", ")}`);
        }

        // Test Case 2: General Doubt
        const query2 = "What is the capital of India?";
        console.log(`\n🧪 Test 2: "${query2}"`);

        const analysis2 = await analyzeQuery(query2);
        console.log("🧠 Analysis:", analysis2);

        if (analysis2.intent === "general_doubt") {
            console.log("✅ Correctly identified as general doubt. Skipped DB search.");
        } else {
            console.log("❌ Failed to identify general doubt.");
        }

    } catch (err) {
        console.error("❌ Test Failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected.');
    }
}

testSmartSearch();
