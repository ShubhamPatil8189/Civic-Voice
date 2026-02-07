import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BACKEND_URL = "http://localhost:5000";

const EligibilityPage = () => {
  const { schemeId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track selected language dynamically
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "hi" || "en" || "mr"
  );

  // Listen to localStorage changes (for instant language switching)
  useEffect(() => {
    const handleStorageChange = () => {
      const lang = localStorage.getItem("lang") || "mr" || "hi" || "en";
      setLanguage(lang);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch eligibility data whenever schemeId or language changes
  useEffect(() => {
    const fetchEligibility = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/eligibility/${schemeId}?lang=${language}`
        );
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchEligibility();
  }, [schemeId, language]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!data) return <div className="p-10 text-center">No data found</div>;

  // Backend already returns the correct language, so just use these fields
  const { name, description, eligibilityCriteria, requiredDocuments } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{name}</h1>
        <p className="mb-6 text-gray-700">{description}</p>

        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">
            {language === "en"
              ? "Eligibility Criteria"
              : language === "hi"
              ? "पात्रता मापदंड"
              : "पात्रता निकष"}
          </h2>
          <ul className="list-disc ml-6">
            {eligibilityCriteria?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">
            {language === "en"
              ? "Required Documents"
              : language === "hi"
              ? "आवश्यक दस्तावेज़"
              : "आवश्यक कागदपत्रे"}
          </h2>
          <ul className="list-disc ml-6">
            {requiredDocuments?.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EligibilityPage;
