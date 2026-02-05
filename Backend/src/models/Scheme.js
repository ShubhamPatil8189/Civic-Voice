const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema(
  {
    name_en: String,
    name_hi: String,
    name_mr: String,

    category_en: String,
    category_hi: String,
    category_mr: String,

    description_en: String,
    description_hi: String,
    description_mr: String,

    benefits_en: String,
    benefits_hi: String,
    benefits_mr: String,

    documentsRequired: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme", SchemeSchema);
