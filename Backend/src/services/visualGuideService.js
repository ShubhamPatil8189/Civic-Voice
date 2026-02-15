const client = require("../config/twilio");

const sendVisualGuide = async (phone, guideType) => {
  try {
    let imageUrl = "";
    let caption = "";

    switch (guideType) {
      case "application_number":
        imageUrl = `${process.env.BASE_URL}/public/guides/application-number.png`;
        caption = "The Application Number field is circled in red.";
        break;

      case "income_certificate":
        imageUrl = `${process.env.BASE_URL}/public/guides/income-certificate.png`;
        caption = "Here is where you upload the income certificate.";
        break;

      default:
        throw new Error("Invalid guide type");
    }

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${phone}`,
      body: caption,
      mediaUrl: [imageUrl],
    });

    return { success: true };
  } catch (error) {
    console.error("Visual Guide Error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendVisualGuide;
