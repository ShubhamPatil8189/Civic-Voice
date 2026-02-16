const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Import Scheme model
const Scheme = require('../src/models/Scheme');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civic_voice');
        console.log('✅ MongoDB Connected for CSV Import');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Parse CSV and import to MongoDB
const importCSV = async (csvFilePath, clearExisting = false) => {
    const schemes = [];
    const slugTracker = {}; // Track slugs to ensure uniqueness

    return new Promise((resolve, reject) => {
        console.log(`📖 Reading CSV file: ${csvFilePath}`);

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                try {
                    // Generate base slug
                    let baseSlug = row.slug || row.scheme_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `scheme-${schemes.length}`;

                    // Ensure slug uniqueness
                    let uniqueSlug = baseSlug;
                    if (slugTracker[baseSlug]) {
                        slugTracker[baseSlug]++;
                        uniqueSlug = `${baseSlug}-${slugTracker[baseSlug]}`;
                    } else {
                        slugTracker[baseSlug] = 1;
                    }

                    // Map CSV columns to Scheme model
                    const scheme = {
                        // Basic info
                        name: row.scheme_name || row.name || 'Untitled Scheme',
                        name_en: row.scheme_name || row.name || 'Untitled Scheme',
                        slug: uniqueSlug,

                        // Category
                        category: row.schemeCategory || row.category || 'General',

                        // Descriptions
                        description: row.details || row.description || '',
                        description_en: row.details || row.description || '',

                        // Level (state/central)
                        level: row.level || 'Central',
                        stateSpecific: (row.level?.toLowerCase() === 'state'),

                        // Benefits - parse if JSON string or array
                        benefits: parseArrayOrString(row.benefits),

                        // Documents - parse if JSON string or array
                        documents: parseArrayOrString(row.documents),

                        // Eligibility - parse if JSON string or object
                        eligibilityCriteria: parseEligibility(row.eligibility),

                        // Application process - parse if JSON string
                        applicationProcess: parseApplicationProcess(row.application),

                        // Timestamps
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    schemes.push(scheme);
                } catch (error) {
                    console.error('❌ Error parsing row:', error.message, row);
                }
            })
            .on('end', async () => {
                console.log(`✅ Parsed ${schemes.length} schemes from CSV`);

                try {
                    // Clear existing schemes if requested
                    if (clearExisting) {
                        console.log('🗑️  Clearing existing schemes...');
                        await Scheme.deleteMany({});
                        console.log('✅ Existing schemes cleared');
                    }

                    // Bulk insert schemes
                    console.log('💾 Inserting schemes into MongoDB...');
                    const result = await Scheme.insertMany(schemes, { ordered: false });
                    console.log(`✅ Successfully imported ${result.length} schemes`);

                    // Show sample
                    const sample = await Scheme.findOne().lean();
                    console.log('\n📄 Sample scheme:');
                    console.log(JSON.stringify(sample, null, 2));

                    resolve(result);
                } catch (error) {
                    console.error('❌ Error inserting schemes:', error.message);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('❌ Error reading CSV:', error);
                reject(error);
            });
    });
};

// Helper: Parse array or string
const parseArrayOrString = (value) => {
    if (!value) return [];

    // Already an array
    if (Array.isArray(value)) return value;

    // Try parsing as JSON
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [parsed.toString()];
    } catch (e) {
        // Split by comma, newline, or semicolon
        return value
            .split(/[,;\n]/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }
};

// Helper: Parse eligibility criteria
const parseEligibility = (value) => {
    if (!value) {
        return {
            minAge: 0,
            maxAge: 100,
            bplRequired: false,
            incomeLessThan: null,
            disabilityRequired: false,
            studentRequired: false,
            veteranRequired: false,
            householdType: 'Both',
            notCarOwner: false
        };
    }

    // Try parsing as JSON object
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'object') {
            return {
                minAge: parsed.minAge || parsed.min_age || 0,
                maxAge: parsed.maxAge || parsed.max_age || 100,
                bplRequired: parsed.bplRequired || parsed.bpl_required || false,
                incomeLessThan: parsed.incomeLessThan || parsed.income_less_than || null,
                disabilityRequired: parsed.disabilityRequired || parsed.disability_required || false,
                studentRequired: parsed.studentRequired || parsed.student_required || false,
                veteranRequired: parsed.veteranRequired || parsed.veteran_required || false,
                householdType: parsed.householdType || parsed.household_type || 'Both',
                notCarOwner: parsed.notCarOwner || parsed.not_car_owner || false
            };
        }
    } catch (e) {
        // If not JSON, try extracting age from text
        const ageMatch = value.match(/(\d+)\s*-\s*(\d+)\s*years?/i);
        return {
            minAge: ageMatch ? parseInt(ageMatch[1]) : 0,
            maxAge: ageMatch ? parseInt(ageMatch[2]) : 100,
            bplRequired: value.toLowerCase().includes('bpl'),
            incomeLessThan: null,
            disabilityRequired: value.toLowerCase().includes('disab'),
            studentRequired: value.toLowerCase().includes('student'),
            veteranRequired: false,
            householdType: 'Both',
            notCarOwner: false
        };
    }
};

// Helper: Parse application process
const parseApplicationProcess = (value) => {
    if (!value) {
        return { steps: [], totalSteps: 0 };
    }

    // Try parsing as JSON
    try {
        const parsed = JSON.parse(value);
        if (parsed.steps && Array.isArray(parsed.steps)) {
            return {
                steps: parsed.steps,
                totalSteps: parsed.steps.length
            };
        }
    } catch (e) {
        // Parse as text - split by numbers or newlines
        const stepTexts = value
            .split(/\n+|\d+\.\s+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        const steps = stepTexts.map((text, index) => ({
            stepNumber: index + 1,
            stepTitle: text.substring(0, 50),
            description: text,
            documents: [],
            estimatedTime: '',
            officialLinks: [],
            pitfalls: []
        }));

        return {
            steps: steps,
            totalSteps: steps.length
        };
    }

    return { steps: [], totalSteps: 0 };
};

// Main execution
const main = async () => {
    const args = process.argv.slice(2);
    const csvPath = args.find(arg => arg.startsWith('--file='))?.split('=')[1];
    const clearFlag = args.includes('--clear');
    const testMode = args.includes('--test');

    if (!csvPath) {
        console.error('❌ Usage: node csvImporter.js --file=path/to/schemes.csv [--clear] [--test]');
        console.log('\nOptions:');
        console.log('  --file=PATH   Path to CSV file (required)');
        console.log('  --clear       Clear existing schemes before import');
        console.log('  --test        Test mode - show parsed data without inserting');
        process.exit(1);
    }

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV file not found: ${csvPath}`);
        process.exit(1);
    }

    // Connect to database
    await connectDB();

    // Import CSV
    try {
        await importCSV(csvPath, clearFlag);
        console.log('\n✅ CSV import completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ CSV import failed:', error.message);
        process.exit(1);
    }
};

// Run if executed directly
if (require.main === module) {
    main();
}

// Export for use in other scripts
module.exports = { importCSV, connectDB };
