const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  name_en: String,
  name_hi: String,
  name_mr: String,

  description_en: String,
  description_hi: String,
  description_mr: String,

  category_en: String,
  category_hi: String,
  category_mr: String,

  eligibility_en: String,
  eligibility_hi: String,
  eligibility_mr: String,
});

module.exports = mongoose.model("Scheme", schemeSchema);
