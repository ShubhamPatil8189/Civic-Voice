import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, BarChart3, AlertTriangle, Mic, ArrowRight, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

const BACKEND_URL = "http://localhost:5000";

const Eligibility = () => {
  const { schemeId } = useParams(); // Get schemeId from URL
  const [scheme, setScheme] = useState(null);
  const [language, setLanguage] = useState("en"); // Default language
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        setError(null);
        // We pass the current language as a query parameter to fetch multilingual data
        const res = await fetch(`${BACKEND_URL}/api/eligibility/${schemeId}?lang=${language}`);
        
        if (!res.ok) {
          throw new Error("Scheme details not found on the server.");
        }

        const data = await res.json();
        setScheme(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      }
    };

    if (schemeId) {
      fetchEligibility();
    }
  }, [schemeId, language]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <Link to="/voice-assistant">
          <Button>Go Back to Search</Button>
        </Link>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
           <div className="h-8 w-32 bg-gray-200 rounded"></div>
           <p className="text-gray-500">Loading scheme details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="app" />

      <main className="flex-1 container mx-auto py-8 px-4 max-w-5xl">
        
        {/* Language Quick Switcher */}
        <div className="flex justify-end mb-4 gap-2">
          {['en', 'hi', 'mr'].map((lang) => (
            <Button 
              key={lang}
              variant={language === lang ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage(lang)}
              className="uppercase text-xs"
            >
              <Globe className="h-3 w-3 mr-1" /> {lang}
            </Button>
          ))}
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/voice-assistant" className="hover:text-foreground transition-colors">
            Schemes
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{scheme.name}</span>
        </nav>

        {/* Page Title & Description */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">{scheme.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {scheme.description}
          </p>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Eligibility Criteria Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold text-xl">Eligibility Criteria</h2>
            </div>
            <div className="bg-white border rounded-xl shadow-sm p-6 flex-1">
              <ul className="space-y-3">
                {scheme.eligibilityCriteria && scheme.eligibilityCriteria.map((item, index) => (
                  <li key={index} className="flex gap-3 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span className="text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Required Documents Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h2 className="font-bold text-xl">Required Documents</h2>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 flex-1">
              <ul className="space-y-3">
                {scheme.requiredDocuments && scheme.requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex gap-3 text-orange-800">
                    <span className="font-bold text-orange-400">•</span>
                    <span className="text-sm md:text-base font-medium">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
          <Link to="/voice-assistant">
            <Button size="lg" className="rounded-full gap-2 px-8 bg-blue-600 hover:bg-blue-700 h-14 shadow-lg">
              <Mic className="h-5 w-5" />
              Continue by voice
            </Button>
          </Link>
          <Link to="/steps">
            <Button size="lg" variant="outline" className="rounded-full gap-2 px-8 h-14 border-2">
              View Next Steps <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Eligibility;