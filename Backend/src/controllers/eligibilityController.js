import Scheme from "../models/Scheme.js";

export const getEligibilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || "en";

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    res.json({
      name: scheme[`name_${lang}`],
      description: scheme[`description_${lang}`],
      eligibilityCriteria: [
        `Category: ${scheme[`category_${lang}`]}`,
        `Benefit: ${scheme[`benefits_${lang}`]}`
      ],
      requiredDocuments: scheme.documentsRequired || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
