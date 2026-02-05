const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    language: {
      type: String,
      enum: ["en", "hi", "mr"],
      default: "en",
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Session", sessionSchema);
