const Scheme = require("../models/Scheme");

// GET ALL SCHEMES
exports.getSchemes = async (req, res) => {
  try {
    const lang = req.query.lang || "en";   // default english

    const schemes = await Scheme.find();

    const formattedSchemes = schemes.map((scheme) => {
      return {
        _id: scheme._id,
        name: scheme[`name_${lang}`],
        description: scheme[`description_${lang}`],
        category: scheme[`category_${lang}`],
      };
    });

    res.json(formattedSchemes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE SCHEME (WITH ELIGIBILITY)
exports.getSchemeById = async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    const formattedScheme = {
      _id: scheme._id,
      name: scheme[`name_${lang}`],
      description: scheme[`description_${lang}`],
      category: scheme[`category_${lang}`],
      eligibility: scheme[`eligibility_${lang}`],
    };

    res.json(formattedScheme);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
