import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  UserCheck, 
  Calendar, 
  MapPin, 
  Shield, 
  Download, 
  Globe, 
  BookOpen,
  Target,
  BadgeCheck,
  AlertCircle
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EligibilityPage = () => {
  const { schemeId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  const [activeTab, setActiveTab] = useState("eligibility");

  useEffect(() => {
    const handleStorageChange = () => {
      const lang = localStorage.getItem("lang") || "en";
      setLanguage(lang);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchEligibility = async () => {
      setLoading(true);
      try {
        // The backend will handle both DB and LLM schemes
        const res = await fetch(
          `${BACKEND_URL}/api/eligibility/${encodeURIComponent(schemeId)}?lang=${language}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEligibility();
  }, [schemeId, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading scheme details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-8 rounded-2xl bg-white shadow-lg border border-gray-100 max-w-md">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h2>
            <p className="text-gray-600 mb-6">The requested scheme information is not available.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { name, description, eligibilityCriteria = [], requiredDocuments = [], benefits = [], category } = data;

  const languageLabels = {
    en: { label: "English", flag: "🇺🇸" },
    hi: { label: "Hindi", flag: "🇮🇳" },
    mr: { label: "Marathi", flag: "🇮🇳" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="max-w-6xl mx-auto">
            <Link 
              to="/voice-assistant" 
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Link>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/20 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Official Government Scheme</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{name}</h1>
                <p className="text-xl text-blue-100 max-w-3xl">{description}</p>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-white" />
                    <span className="text-white font-medium">
                      {languageLabels[language]?.flag} {languageLabels[language]?.label}
                    </span>
                  </div>
                </div>
                
                {category && (
                  <div className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <span className="text-white font-medium">{category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("eligibility")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                activeTab === "eligibility"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <UserCheck className="h-5 w-5" />
              Eligibility Criteria
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                activeTab === "documents"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <FileText className="h-5 w-5" />
              Required Documents
            </button>
            <button
              onClick={() => setActiveTab("benefits")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                activeTab === "benefits"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <Target className="h-5 w-5" />
              Scheme Benefits
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Eligibility Tab */}
              {activeTab === "eligibility" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100">
                          <UserCheck className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">Eligibility Criteria</h2>
                          <p className="text-gray-600">Check if you qualify for this scheme</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {eligibilityCriteria.map((criterion, index) => (
                          <div 
                            key={index} 
                            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-all border border-blue-100 group"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <p className="text-gray-800 font-medium">{criterion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-blue-100 p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Note:</span> All criteria must be satisfied to be eligible for the scheme.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100">
                          <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">Required Documents</h2>
                          <p className="text-gray-600">Prepare these documents for application</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requiredDocuments.map((doc, index) => (
                          <div 
                            key={index} 
                            className="group flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-white hover:from-purple-100 transition-all border border-purple-100"
                          >
                            <div className="flex-shrink-0">
                              <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow transition-shadow">
                                <FileText className="h-5 w-5 text-purple-600" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-1">Document {index + 1}</h3>
                              <p className="text-gray-700">{doc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100 p-6">
                      <button className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                        <Download className="h-4 w-4" />
                        Download Document Checklist
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Benefits Tab */}
              {activeTab === "benefits" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                          <Target className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">Scheme Benefits</h2>
                          <p className="text-gray-600">What you get from this scheme</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                          <div 
                            key={index} 
                            className="group flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-green-50 to-white hover:from-green-100 transition-all border border-green-100"
                          >
                            <div className="flex-shrink-0">
                              <div className="p-2 rounded-lg bg-white shadow-sm">
                                <BadgeCheck className="h-5 w-5 text-green-600" />
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-800 font-medium">{benefit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
                    <span className="text-gray-600">Eligibility Points</span>
                    <span className="font-bold text-blue-600">{eligibilityCriteria.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50">
                    <span className="text-gray-600">Documents Required</span>
                    <span className="font-bold text-purple-600">{requiredDocuments.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                    <span className="text-gray-600">Benefits</span>
                    <span className="font-bold text-green-600">{benefits.length}</span>
                  </div>
                </div>
              </div>

              {/* Application Process */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Application Process</h3>
                <div className="space-y-3">
                  {[
                    { step: 1, title: "Check Eligibility", desc: "Verify you meet all criteria" },
                    { step: 2, title: "Gather Documents", desc: "Collect required documents" },
                    { step: 3, title: "Online Application", desc: "Fill application form" },
                    { step: 4, title: "Submit & Track", desc: "Submit and track status" }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{item.step}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  Start Application
                </button>
              </div>

              {/* Need Help */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-800">Need Help?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Our support team is available to help you with the application process.
                </p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold border border-blue-200 hover:bg-blue-50 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Apply?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Check your eligibility and start your application process now. Our system will guide you through each step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition-all">
                  Check My Eligibility
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all">
                  Download Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EligibilityPage;