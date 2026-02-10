const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true
    },
    userMessage: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
