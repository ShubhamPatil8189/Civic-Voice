// Test script for Semantic Search Logic
const mongoose = require('mongoose');
require('dotenv').config();
const Scheme = require('./src/models/Scheme');

const testSearch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const keyword = "funeral expenses";
        console.log(`\n🔍 Testing Search for: "${keyword}"`);

        // Exact logic from controller
        const keywords = keyword.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const keywordRegex = keywords.map(w => new RegExp(w, "i"));

        let extraTerms = [];
        if (keyword.match(/funeral|death|burial|cremation/i)) extraTerms.push(/antye|antyesti|rites|assistance/i);

        const regex = new RegExp(keyword, "i");
        let query = {
            $or: [
                { name_en: regex }, { description_en: regex },
                { name_en: { $in: keywordRegex } },
                { description_en: { $in: keywordRegex } },
                { tags: { $in: keywordRegex } },
                ...(extraTerms.length > 0 ? [{ description_en: { $in: extraTerms } }] : [])
            ]
        };

        const schemes = await Scheme.find(query).select('name_en description_en').limit(5);

        console.log(`Found ${schemes.length} matches:`);
        schemes.forEach(s => console.log(`- ${s.name_en}`));

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

testSearch();
