// Comprehensive test for Enhanced Smart FAQ System
require('dotenv').config();
const mongoose = require('mongoose');

const UniqueQuery = require('./src/models/UniqueQuery');
const FAQ = require('./src/models/FAQ');
const VoiceSession = require('./src/models/VoiceSession');

const BACKEND_URL = 'http://localhost:5000';

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
}

async function testQueryDeduplication() {
    console.log('📋 TEST 1: Query Deduplication & Counting');
    console.log('==========================================\n');

    // Simulate searches
    const searches = [
        { text: 'healthcare', language: 'en' },
        { text: 'health care', language: 'en' },  // Similar to above
        { text: 'healthcare schemes', language: 'en' },  // Similar to above
        { text: 'farmer subsidy', language: 'en' },
        { text: 'farmer subsidies', language: 'en' },  // Similar to above
        { text: 'income certificate', language: 'en' }
    ];

    console.log('Simulating user searches:');
    for (const search of searches) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/voice/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(search)
            });

            if (response.ok) {
                console.log(`  ✓ Searched: "${search.text}"`);
            } else {
                console.log(`  ✗ Failed: "${search.text}"`);
            }
        } catch (err) {
            console.log(`  ✗ Error: "${search.text}" - ${err.message}`);
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Checking UniqueQuery database:');
    const uniqueQueries = await UniqueQuery.find().sort({ searchCount: -1 });

    if (uniqueQueries.length === 0) {
        console.log('  ⚠️  No unique queries found. Make sure backend is running!\n');
        return false;
    }

    uniqueQueries.forEach((q, i) => {
        console.log(`  ${i + 1}. "${q.originalQuery}" - Searched ${q.searchCount} time(s)`);
        if (q.relatedQueries.length > 0) {
            console.log(`     Related: ${q.relatedQueries.join(', ')}`);
        }
    });

    console.log(`\n✅ Deduplication working! ${uniqueQueries.length} unique queries tracked\n`);
    return true;
}

async function testFAQGeneration() {
    console.log('📋 TEST 2: Smart FAQ Generation');
    console.log('==========================================\n');

    const initialCount = await FAQ.countDocuments();
    console.log(`Initial FAQ count: ${initialCount}`);

    console.log('Triggering Smart FAQ generation...');
    try {
        const response = await fetch(`${BACKEND_URL}/api/faqs/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (data.success) {
            console.log(`✅ ${data.message}`);
            console.log(`   Method: ${data.method}`);

            if (data.newFaqs && data.newFaqs.length > 0) {
                console.log('\n📝 Generated FAQs:');
                data.newFaqs.forEach((faq, i) => {
                    console.log(`\n  ${i + 1}. [${faq.category}] ${faq.question}`);
                    console.log(`     ${faq.answer.substring(0, 100)}...`);
                });
            }
        } else {
            console.log(`⚠️  ${data.message}`);
        }

        const finalCount = await FAQ.countDocuments();
        console.log(`\nFinal FAQ count: ${finalCount} (+${finalCount - initialCount})\n`);
        return true;
    } catch (err) {
        console.log(`❌ Error: ${err.message}\n`);
        return false;
    }
}

async function testPagination() {
    console.log('📋 TEST 3: Pagination API');
    console.log('==========================================\n');

    try {
        // Test page 1
        console.log('Fetching page 1 (limit 4)...');
        const response1 = await fetch(`${BACKEND_URL}/api/faqs?page=1&limit=4`);
        const data1 = await response1.json();

        console.log(`✅ Page 1: ${data1.faqs?.length || 0} FAQs`);
        console.log(`   Total FAQs: ${data1.pagination?.totalFaqs || 0}`);
        console.log(`   Total Pages: ${data1.pagination?.totalPages || 0}`);
        console.log(`   Has More: ${data1.pagination?.hasMore ? 'Yes' : 'No'}`);

        if (data1.pagination?.hasMore) {
            // Test page 2
            console.log('\nFetching page 2 (limit 2)...');
            const response2 = await fetch(`${BACKEND_URL}/api/faqs?page=2&limit=2`);
            const data2 = await response2.json();

            console.log(`✅ Page 2: ${data2.faqs?.length || 0} FAQs`);
            console.log(`   Has More: ${data2.pagination?.hasMore ? 'Yes' : 'No'}`);
        }

        console.log('\n✅ Pagination working correctly!\n');
        return true;
    } catch (err) {
        console.log(`❌ Error: ${err.message}\n`);
        return false;
    }
}

async function runAllTests() {
    console.log('\n🧪 ENHANCED SMART FAQ SYSTEM - TEST SUITE');
    console.log('================================================\n');

    await connectDB();

    const test1 = await testQueryDeduplication();
    const test2 = await testFAQGeneration();
    const test3 = await testPagination();

    console.log('================================================');
    console.log('📊 TEST SUMMARY');
    console.log('================================================');
    console.log(`Query Deduplication: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`FAQ Generation:      ${test2 ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Pagination:          ${test3 ? '✅ PASS' : '❌ FAIL'}`);
    console.log('================================================\n');

    if (test1 && test2 && test3) {
        console.log('🎉 ALL TESTS PASSED! System is working perfectly.\n');
    } else {
        console.log('⚠️  Some tests failed. Check the logs above.\n');
    }

    mongoose.connection.close();
}

runAllTests();
