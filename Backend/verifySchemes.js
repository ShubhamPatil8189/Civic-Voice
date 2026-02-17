// Quick script to verify schemes in database
require('dotenv').config();
const mongoose = require('mongoose');

async function verify() {
    try {
        // Connect using .env MONGO_URI
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/civic_voice';
        console.log('Connecting to:', uri.includes('@') ? uri.split('@')[1].split('/')[0] + '/...' : uri);

        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB\n');

        // Create Scheme model
        const Scheme = mongoose.model('Scheme', new mongoose.Schema({}, { strict: false }));

        // Count total schemes
        const total = await Scheme.countDocuments();
        console.log(`📊 Total schemes in database: ${total}\n`);

        if (total > 0) {
            // Show 5 sample schemes
            console.log('📄 Sample schemes:');
            const samples = await Scheme.find().limit(5).lean();
            samples.forEach((scheme, i) => {
                console.log(`\n${i + 1}. ${scheme.name || scheme.name_en}`);
                console.log(`   Slug: ${scheme.slug}`);
                console.log(`   Category: ${scheme.category}`);
                console.log(`   Level: ${scheme.level}`);
            });

            // Show counts by level
            const centralCount = await Scheme.countDocuments({ level: /central/i });
            const stateCount = await Scheme.countDocuments({ level: /state/i });
            console.log(`\n📈 Breakdown:`);
            console.log(`   Central schemes: ${centralCount}`);
            console.log(`   State schemes: ${stateCount}`);
        } else {
            console.log('⚠️  No schemes found! Try importing the CSV again.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verify();
