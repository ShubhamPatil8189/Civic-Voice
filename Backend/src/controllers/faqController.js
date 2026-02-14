const FAQ = require("../models/FAQ");
const VoiceSession = require("../models/VoiceSession");
const UniqueQuery = require("../models/UniqueQuery");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// 1. Get FAQs with pagination
const getFAQs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        const faqs = await FAQ.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await FAQ.countDocuments();

        res.json({
            faqs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalFaqs: total,
                hasMore: skip + faqs.length < total
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// 2. Generate Smart FAQs using top queries by search count
const generateSmartFAQs = async (req, res) => {
    try {
        // A. Fetch top 4 unique queries sorted by search count
        const topQueries = await UniqueQuery.find()
            .sort({ searchCount: -1 })
            .limit(4)
            .select("originalQuery searchCount relatedQueries");

        if (topQueries.length === 0) {
            return res.json({ message: "No queries found to analyze.", newFaqs: [] });
        }

        console.log('📊 Top queries by popularity:');
        topQueries.forEach((q, i) => {
            console.log(`   ${i + 1}. "${q.originalQuery}" (searched ${q.searchCount} times)`);
        });

        // B. Try AI-powered generation first
        let newFaqsData = [];
        let aiSuccess = false;

        try {
            // Prepare context with search counts for better AI understanding
            const queryContext = topQueries
                .map((q, i) => `${i + 1}. "${q.originalQuery}" (searched ${q.searchCount} times, related: ${q.relatedQueries.slice(0, 2).join(', ') || 'none'})`)
                .join("\n");

            const prompt = `
      You are analyzing user search queries from a government scheme assistance app.
      
      TOP SEARCHED QUERIES (by popularity):
      ${queryContext}

      Based on these popular searches, identify the 3 most important recurring topics or user needs.
      Generate helpful FAQs that address these common concerns.
      
      Generate a JSON response with an array of objects. Each object should have:
      - "question": A clear, concise question in English that users are asking.
      - "answer": A helpful, detailed answer in English (assume you are the Civic-Voice assistant helping citizens).
      - "category": A 1-word category (e.g., Eligibility, Documents, Application, Benefits)
      
      Output ONLY valid JSON array format like: [{"question":"...", "answer":"...", "category":"..."}]
      `;

            // Use fetch to call Gemini API directly (more reliable than SDK)
            const API_KEY = process.env.Google_Gemini_API_Key;
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            let cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
            newFaqsData = JSON.parse(cleanJson);

            if (!Array.isArray(newFaqsData)) {
                newFaqsData = [newFaqsData];
            }
            aiSuccess = true;
        } catch (aiError) {
            console.log("AI generation failed, using fallback logic:", aiError.message);

            // C. FALLBACK: Use top queries directly
            newFaqsData = topQueries.slice(0, 3).map(query => ({
                question: `What schemes or information are available for "${query.originalQuery}"?`,
                answer: `Based on ${query.searchCount} search${query.searchCount > 1 ? 'es' : ''}, many users are looking for information about "${query.originalQuery}". Use the Voice Assistant to search for this topic and explore detailed eligibility criteria, required documents, and application steps for relevant schemes.${query.relatedQueries.length > 0 ? ` Related searches include: ${query.relatedQueries.slice(0, 2).join(', ')}.` : ''}`,
                category: "Popular"
            }));
        }

        // D. Save to Database (avoid duplicates)
        const savedFaqs = [];
        for (const faq of newFaqsData) {
            if (!faq.question || !faq.answer) continue;

            const exists = await FAQ.findOne({ question: faq.question });
            if (!exists) {
                const newFaq = await FAQ.create({
                    question: faq.question,
                    answer: faq.answer,
                    category: faq.category || "General",
                    isAutoGenerated: true
                });
                savedFaqs.push(newFaq);
            }
        }

        res.json({
            success: true,
            message: `Generated ${savedFaqs.length} new FAQ${savedFaqs.length !== 1 ? 's' : ''}.${aiSuccess ? ' (AI-powered)' : ' (Query-based)'}`,
            newFaqs: savedFaqs,
            method: aiSuccess ? 'ai' : 'fallback'
        });

    } catch (err) {
        console.error("FAQ Generation Error:", err);
        res.status(500).json({
            success: false,
            message: "Error generating FAQs",
            error: err.message
        });
    }
};

module.exports = { getFAQs, generateSmartFAQs };
