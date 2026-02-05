const Scheme = require("../models/Scheme");

const getSchemes = async (req, res) => {
  const schemes = await Scheme.find();
  res.json(schemes);
};

module.exports = { getSchemes };
