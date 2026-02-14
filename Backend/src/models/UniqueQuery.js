const mongoose = require("mongoose");

const uniqueQuerySchema = new mongoose.Schema({
    normalizedQuery: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    originalQuery: {
        type: String,
        required: true
    },
    searchCount: {
        type: Number,
        default: 1
    },
    language: {
        type: String,
        default: "en"
    },
    relatedQueries: [{
        type: String
    }],
    lastSearched: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("UniqueQuery", uniqueQuerySchema);
