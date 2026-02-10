const mongoose = require("mongoose");

const voiceSessionSchema = new mongoose.Schema({
  spokenText: String,
  detectedLanguage: String,
  extractedData: Object,
  matchedSchemes: Array,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("VoiceSession", voiceSessionSchema);
