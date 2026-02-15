const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: false, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
