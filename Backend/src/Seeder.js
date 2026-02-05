import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "./models/Scheme.js"; // Make sure path is correct

dotenv.config();

const updatedSchemes = [
  {
    _id: "698409eabdc3eb7d3a8ca403",
    name_en: "Disability Assistance Scheme",
    name_hi: "अपंग सहायता योजना",
    name_mr: "अपंग सहायता योजना",
    category_en: "Disability",
    category_hi: "विकलांगता",
    category_mr: "विकलांगता",
    description_en: "Support for persons with disabilities.",
    description_hi: "विकलांग व्यक्तियों के लिए सहायता।",
    description_mr: "विकलांग व्यक्तींसाठी सहाय्यता.",
    benefits_en: "₹2000 per month assistance",
    benefits_hi: "₹2000 प्रति माह सहायता",
    benefits_mr: "₹2000 प्रति महिना सहाय्यता",
    documentsRequired: ["Disability certificate", "ID proof", "Address proof"]
  },
  {
    _id: "698409f7bdc3eb7d3a8ca405",
    name_en: "Free Ration Scheme",
    name_hi: "मुफ़्त राशन योजना",
    name_mr: "मुफ्त अन्नधान्य योजना",
    category_en: "Food Security",
    category_hi: "खाद्य सुरक्षा",
    category_mr: "अन्न सुरक्षा",
    description_en: "Free food grains for eligible families.",
    description_hi: "योग्य परिवारों के लिए मुफ्त अनाज।",
    description_mr: "योग्य कुटुंबांसाठी मोफत धान्य.",
    benefits_en: "Free wheat and rice monthly",
    benefits_hi: "मुफ़्त गेहूँ और चावल प्रति माह",
    benefits_mr: "मुफत गहू व तांदूळ दर महिना",
    documentsRequired: ["Ration card", "Address proof"]
  },
  {
    _id: "69840a06bdc3eb7d3a8ca407",
    name_en: "Unemployment Allowance Scheme",
    name_hi: "बेरोज़गारी भत्ता योजना",
    name_mr: "बेरोजगारी भत्ता योजना",
    category_en: "Employment",
    category_hi: "रोज़गार",
    category_mr: "रोजगार",
    description_en: "Financial aid for unemployed youth.",
    description_hi: "बेरोज़गार युवाओं के लिए वित्तीय सहायता।",
    description_mr: "बेरोजगार तरुणांसाठी आर्थिक सहाय्यता.",
    benefits_en: "₹2500 per month allowance",
    benefits_hi: "₹2500 प्रति माह भत्ता",
    benefits_mr: "₹2500 प्रति महिना भत्ता",
    documentsRequired: ["ID proof", "Employment proof", "Bank account"]
  },
  {
    _id: "69840a17bdc3eb7d3a8ca409",
    name_en: "PM Awas Yojana",
    name_hi: "प्रधानमंत्री आवास योजना",
    name_mr: "प्रधानमंत्री आवास योजना",
    category_en: "Housing",
    category_hi: "आवास",
    category_mr: "गृहव्यवस्था",
    description_en: "Affordable housing for economically weaker sections.",
    description_hi: "आर्थिक रूप से कमजोर वर्गों के लिए सस्ती आवास योजना।",
    description_mr: "आर्थिकदृष्ट्या दुर्बळ घटकांसाठी स्वस्त गृहनिर्माण.",
    benefits_en: "Subsidy up to ₹2.5 lakh",
    benefits_hi: "₹2.5 लाख तक सब्सिडी",
    benefits_mr: "₹2.5 लाख पर्यंत सबसिडी",
    documentsRequired: ["Income certificate", "ID proof", "Property documents"]
  },
  {
    _id: "69840a28bdc3eb7d3a8ca40a",
    name_en: "Senior Citizen Pension Scheme",
    name_hi: "वरिष्ठ नागरिक पेंशन योजना",
    name_mr: "जेष्ठ नागरिक पेन्शन योजना",
    category_en: "Pension",
    category_hi: "पेंशन",
    category_mr: "पेन्शन",
    description_en: "Monthly pension for senior citizens.",
    description_hi: "वरिष्ठ नागरिकों के लिए मासिक पेंशन।",
    description_mr: "जेष्ठ नागरिकांसाठी मासिक पेन्शन.",
    benefits_en: "₹1500 per month",
    benefits_hi: "₹1500 प्रति माह",
    benefits_mr: "₹1500 प्रति महिना",
    documentsRequired: ["ID proof", "Age proof", "Bank account"]
  },
  {
    _id: "69840a39bdc3eb7d3a8ca40b",
    name_en: "Education Assistance Scheme",
    name_hi: "शिक्षा सहायता योजना",
    name_mr: "शिक्षण सहाय्यता योजना",
    category_en: "Education",
    category_hi: "शिक्षा",
    category_mr: "शिक्षण",
    description_en: "Financial support for students.",
    description_hi: "छात्रों के लिए वित्तीय सहायता।",
    description_mr: "विद्यार्थ्यांसाठी आर्थिक सहाय्यता.",
    benefits_en: "Tuition fee support up to ₹5000",
    benefits_hi: "₹5000 तक ट्यूशन शुल्क सहायता",
    benefits_mr: "₹5000 पर्यंत शिक्षण शुल्क सहाय्यता",
    documentsRequired: ["Student ID", "Fee receipt", "ID proof"]
  },
  {
    _id: "69840a4abd-c3eb7d3a8ca40c",
    name_en: "Healthcare Support Scheme",
    name_hi: "स्वास्थ्य सहायता योजना",
    name_mr: "आरोग्य सहाय्यता योजना",
    category_en: "Healthcare",
    category_hi: "स्वास्थ्य",
    category_mr: "आरोग्य",
    description_en: "Medical support for families.",
    description_hi: "परिवारों के लिए चिकित्सा सहायता।",
    description_mr: "कुटुंबांसाठी वैद्यकीय सहाय्यता.",
    benefits_en: "Cashless treatment up to ₹5000",
    benefits_hi: "₹5000 तक कैशलेस इलाज",
    benefits_mr: "₹5000 पर्यंत रोकड-राहत उपचार",
    documentsRequired: ["ID proof", "Medical certificate"]
  },
  {
    _id: "69840a5bbdc3eb7d3a8ca40d",
    name_en: "Women Empowerment Scheme",
    name_hi: "महिला सशक्तिकरण योजना",
    name_mr: "स्त्री सशक्तीकरण योजना",
    category_en: "Women",
    category_hi: "महिला",
    category_mr: "महिला",
    description_en: "Support programs for women empowerment.",
    description_hi: "महिला सशक्तिकरण के लिए सहायता कार्यक्रम।",
    description_mr: "स्त्रिया सशक्तीकरणासाठी सहाय्यता कार्यक्रम.",
    benefits_en: "Skill training & financial aid",
    benefits_hi: "कौशल प्रशिक्षण और वित्तीय सहायता",
    benefits_mr: "कौशल्य प्रशिक्षण व आर्थिक सहाय्यता",
    documentsRequired: ["ID proof", "Address proof"]
  },
  {
    _id: "69840a6cbdc3eb7d3a8ca40e",
    name_en: "Child Nutrition Scheme",
    name_hi: "बाल पोषण योजना",
    name_mr: "बाल पोषण योजना",
    category_en: "Child Welfare",
    category_hi: "बाल कल्याण",
    category_mr: "बाल कल्याण",
    description_en: "Nutritional support for children.",
    description_hi: "बच्चों के लिए पोषण सहायता।",
    description_mr: "मुलेसाठी पौष्टिक सहाय्यता.",
    benefits_en: "Free food & supplements",
    benefits_hi: "मुफ़्त भोजन और पूरक",
    benefits_mr: "मोफत अन्न व पूरक",
    documentsRequired: ["Birth certificate", "ID proof"]
  },
  {
    _id: "69840a7dbdc3eb7d3a8ca40f",
    name_en: "Disaster Relief Scheme",
    name_hi: "आपदा राहत योजना",
    name_mr: "आपत्ती मदत योजना",
    category_en: "Relief",
    category_hi: "राहत",
    category_mr: "राहत",
    description_en: "Assistance for disaster-affected families.",
    description_hi: "आपदा प्रभावित परिवारों के लिए सहायता।",
    description_mr: "आपत्ती प्रभावित कुटुंबांसाठी सहाय्यता.",
    benefits_en: "Immediate cash & food aid",
    benefits_hi: "तत्काल नकद और भोजन सहायता",
    benefits_mr: "तत्काळ रोख व अन्न सहाय्यता",
    documentsRequired: ["ID proof", "Address proof"]
  }
];

async function updateSchemes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const scheme of updatedSchemes) {
      const { _id, ...updateData } = scheme;
      await Scheme.updateOne({ _id }, { $set: updateData }, { upsert: true });
      console.log(`Updated scheme: ${_id}`);
    }

    console.log("All schemes updated successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error updating schemes:", err);
  }
}

updateSchemes();
