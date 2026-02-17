// Test LLM-Enhanced Eligibility Endpoint
const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testEligibilityEndpoint() {
    console.log('🧪 Testing LLM-Enhanced Eligibility Endpoint\n');

    // Test 1: Get a scheme ID from search first
    console.log('Step 1: Searching for "health" schemes...');
    const searchRes = await axios.get(`${BACKEND_URL}/api/scheme/search?keyword=health`);

    if (!searchRes.data.schemes || searchRes.data.schemes.length === 0) {
        console.log('❌ No schemes found. Please import CSV data first.');
        return;
    }

    const testScheme = searchRes.data.schemes[0];
    console.log(`✅ Found scheme: ${testScheme.name_en || testScheme.name}`);
    console.log(`   Scheme ID: ${testScheme._id}\n`);

    // Test 2: Get detailed info from eligibility endpoint
    console.log('Step 2: Fetching detailed scheme info...');
    const detailRes = await axios.get(`${BACKEND_URL}/api/eligibility/${testScheme._id}?lang=en`);

    console.log('\n📊 Scheme Details:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Name: ${detailRes.data.name}`);
    console.log(`\nDescription:\n${detailRes.data.description}`);
    console.log(`\nCategory: ${detailRes.data.category}`);

    console.log(`\n✅ Eligibility Criteria (${detailRes.data.eligibilityCriteria.length}):`);
    detailRes.data.eligibilityCriteria.forEach((c, i) => console.log(`   ${i + 1}. ${c}`));

    console.log(`\n💰 Benefits (${detailRes.data.benefits.length}):`);
    detailRes.data.benefits.forEach((b, i) => console.log(`   ${i + 1}. ${b}`));

    console.log(`\n📄 Required Documents (${detailRes.data.requiredDocuments.length}):`);
    detailRes.data.requiredDocuments.forEach((d, i) => console.log(`   ${i + 1}. ${d}`));

    if (detailRes.data.steps && detailRes.data.steps.length > 0) {
        console.log(`\n📋 Application Steps (${detailRes.data.steps.length}):`);
        detailRes.data.steps.forEach((s, i) => {
            console.log(`   ${i + 1}. ${s.title || s.stepTitle}`);
            console.log(`      ${s.action || s.description}`);
        });
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('\n✅ Test Complete!');
}

testEligibilityEndpoint().catch(err => {
    console.error('❌ Test failed:', err.message);
    if (err.response) {
        console.error('Response:', err.response.data);
    }
});
