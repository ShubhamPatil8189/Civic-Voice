// Quick test to see which Gemini models your API key supports
require('dotenv').config();

const API_KEY = process.env.Google_Gemini_API_Key;

async function testModel(modelName) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: "Say 'hello' in JSON format: {\"message\": \"hello\"}" }]
                    }]
                })
            }
        );

        if (response.ok) {
            console.log(`✅ ${modelName} - WORKS!`);
            const data = await response.json();
            console.log(`   Response: ${data.candidates[0].content.parts[0].text.substring(0, 50)}`);
        } else {
            console.log(`❌ ${modelName} - Failed: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.log(`❌ ${modelName} - Error: ${err.message}`);
    }
}

async function runTests() {
    console.log('Testing Gemini models with your API key...\n');

    await testModel('gemini-pro');
    await testModel('gemini-1.5-pro');
    await testModel('gemini-1.5-flash');
    await testModel('gemini-1.5-flash-latest');
    await testModel('gemini-1.0-pro');

    console.log('\nTest complete!');
}

runTests();
