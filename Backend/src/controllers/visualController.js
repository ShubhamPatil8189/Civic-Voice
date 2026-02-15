const sendVisualGuide = require("../services/visualGuideService");

exports.sendGuide = async (req, res) => {
  try {
    const { phone, guideType } = req.body;

    if (!phone || !guideType) {
      return res.status(400).json({
        success: false,
        message: "Phone and guideType required"
      });
    }

    const result = await sendVisualGuide(phone, guideType);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }

    res.json({
      success: true,
      message: "Visual guide sent successfully."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
