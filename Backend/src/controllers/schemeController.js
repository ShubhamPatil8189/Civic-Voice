const Scheme = require("../models/Scheme");

// GET all schemes or filter by keyword
const getSchemes = async (req, res) => {
  const { keyword, language } = req.query;

  try {
    let schemes;
    if (!keyword || keyword.trim() === "") {
      schemes = await Scheme.find();
    } else {
      const regex = new RegExp(keyword, "i");
      if (language === "en") {
        schemes = await Scheme.find({ $or: [{ name_en: regex }, { description_en: regex }] });
      } else if (language === "hi") {
        schemes = await Scheme.find({ $or: [{ name_hi: regex }, { description_hi: regex }] });
      } else if (language === "mr") {
        schemes = await Scheme.find({ $or: [{ name_mr: regex }, { description_mr: regex }] });
      } else {
        schemes = await Scheme.find({
          $or: [
            { name_en: regex }, { description_en: regex },
            { name_hi: regex }, { description_hi: regex },
            { name_mr: regex }, { description_mr: regex },
          ],
        });
      }
    }
    res.json(schemes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getSchemes };
