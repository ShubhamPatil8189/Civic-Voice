const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    name_en: { type: String },
    name_hi: { type: String },
    name_mr: { type: String },

    category: { type: String, required: true, index: true }, // Added index for fast lookups
    level: { type: String, default: "Central" },

    description: { type: String, required: true },
    description_en: { type: String },
    description_hi: { type: String },
    description_mr: { type: String },

    slug: { type: String, unique: true },

    eligibilityCriteria: {
        minAge: { type: Number, default: 0 },
        maxAge: { type: Number, default: 100 },
        bplRequired: { type: Boolean, default: false },
        incomeLessThan: { type: Number, default: null },
        disabilityRequired: { type: Boolean, default: false },
        studentRequired: { type: Boolean, default: false },
        veteranRequired: { type: Boolean, default: false },
        householdType: { type: String, enum: ["Rural", "Urban", "Both"], default: "Both" },
        notCarOwner: { type: Boolean, default: false }
    },
    benefits: [String],
    documents: [String],
    applicationProcess: {
        steps: [
            {
                stepNumber: Number,
                stepTitle: String,
                description: String,
                documents: [String],
                estimatedTime: String,
                officialLinks: [String],
                pitfalls: [String]
            }
        ],
        totalSteps: Number
    },
    officialWebsite: String,
    deadline: Date,
    stateSpecific: { type: Boolean, default: false },
    states: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add text index for search
schemeSchema.index({
    name_en: "text", name_hi: "text", name_mr: "text",
    description_en: "text", description_hi: "text", description_mr: "text",
    category: "text"
});

module.exports = mongoose.model('Scheme', schemeSchema);