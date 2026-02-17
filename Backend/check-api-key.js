// Test API key validity
require('dotenv').config();

const API_KEY = process.env.Google_Gemini_API_Key;

async function checkAPIKey() {
    console.log(`Testing API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}\n`);

    // Test 1: List available models
    console.log('Test 1: Listing available models...');
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Key is valid!');
            console.log(`   Found ${data.models ? data.models.length : 0} available models:\n`);

            if (data.models) {
                data.models.forEach(model => {
                    console.log(`   - ${model.name}`);
                });
            }
        } else {
            console.log(`❌ API Key issue: ${response.status} ${response.statusText}`);
            const errorData = await response.text();
            console.log(`   Error details: ${errorData}`);
        }
    } catch (err) {
        console.log(`❌ Network error: ${err.message}`);
    }
}

checkAPIKey();
