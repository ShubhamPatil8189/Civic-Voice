const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  schemeId: {
    type: String,
    required: true,
    unique: true
  },
  steps: [
    {
      stepNumber: Number,
      title: String,
      action: String,
      location: String,
      why: String,
      estimatedTime: String,
      difficulty: String
    }
  ]
});

module.exports = mongoose.model("Step", stepSchema);
