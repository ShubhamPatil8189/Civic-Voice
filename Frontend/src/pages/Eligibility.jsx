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
  AlertCircle,
  XCircle // Added
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { useTranslation } from "react-i18next";
import axios from "axios";
import { authAPI } from "@/services/api"; // Added

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EligibilityPage = () => {
  const { t, i18n } = useTranslation();
  const { schemeId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("eligibility");
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState(null);

  const handleCheckEligibility = async () => {
    setChecking(true);
    try {
      // Fetch Real User Profile
      let userProfile = {};
      try {
        const userRes = await authAPI.getCurrentUser();
        if (userRes.data && userRes.data.user) {
          userProfile = userRes.data.user;
        } else {
          throw new Error("User not found");
        }
      } catch (authErr) {
        // If not logged in, we could redirect or ask for login
        // For now, let's just alert
        alert("Please login to check eligibility securely.");
        // Optional: Redirect to login
        // window.location.href = "/login"; 
        // Or facilitate a quick login modal 
        // For now, continuing with empty profile which might still work for some checks or fail gracefully
        setChecking(false);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/eligibility/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeData: { ...data, eligibilityCriteria: eligibilityCriteria },
          userProfile: userProfile
        })
      });

      const result = await res.json();
      setCheckResult(result);
    } catch (err) {
      console.error("Check failed", err);
      alert("Something went wrong while checking eligibility.");
    } finally {
      setChecking(false);
    }
  };

  // Fetch scheme + steps from backend
  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/eligibility/${schemeId}?lang=${i18n.language}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [schemeId, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">{t('eligibility_page.loading')}</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('eligibility_page.no_data.title')}</h2>
            <p className="text-gray-600 mb-6">{t('eligibility_page.no_data.desc')}</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all">
              <ArrowLeft className="h-4 w-4" />
              {t('eligibility_page.back_to_home')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    name,
    description,
    eligibilityCriteria: rawEligibilityCriteria,
    requiredDocuments: rawRequiredDocuments,
    benefits: rawBenefits,
    category,
    steps: rawSteps,
    officialWebsite
  } = data;

  // Defensive array checks to prevent crashes
  const eligibilityCriteria = Array.isArray(rawEligibilityCriteria) ? rawEligibilityCriteria : [];
  const requiredDocuments = Array.isArray(rawRequiredDocuments) ? rawRequiredDocuments : [];
  const benefits = Array.isArray(rawBenefits) ? rawBenefits : [];
  const steps = Array.isArray(rawSteps) ? rawSteps : [];

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
              {t('eligibility_page.back_to_search')}
            </Link>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/20 backdrop-blur-sm">
                  <Shield className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">{t('eligibility_page.official_scheme')}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{name}</h1>
                <p className="text-xl text-blue-100 max-w-3xl">{description}</p>

                {/* Apply Now Button - Prominent */}
                {officialWebsite && (
                  <a
                    href={officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <Globe className="h-5 w-5" />
                    Apply Now - Official Website
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <div className="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-white" />
                    <span className="text-white font-medium">
                      {languageLabels[i18n.language]?.flag} {languageLabels[i18n.language]?.label}
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
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${activeTab === "eligibility"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
                }`}
            >
              <UserCheck className="h-5 w-5" />
              {t('eligibility_page.tabs.eligibility')}
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${activeTab === "documents"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
                }`}
            >
              <FileText className="h-5 w-5" />
              {t('eligibility_page.tabs.documents')}
            </button>
            <button
              onClick={() => setActiveTab("benefits")}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${activeTab === "benefits"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
                }`}
            >
              <Target className="h-5 w-5" />
              {t('eligibility_page.tabs.benefits')}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Eligibility Tab */}
              {activeTab === "eligibility" && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 space-y-6">
                  {eligibilityCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white hover:from-blue-100 transition-all border border-blue-100 group">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <p className="text-gray-800 font-medium">{criterion}</p>
                    </div>
                  ))}
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
                          <h2 className="text-2xl font-bold text-gray-800">{t('eligibility_page.documents_tab.title')}</h2>
                          <p className="text-gray-600">{t('eligibility_page.documents_tab.subtitle')}</p>
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
                              <h3 className="font-semibold text-gray-800 mb-1">{t('eligibility_page.documents_tab.doc_label')} {index + 1}</h3>
                              <p className="text-gray-700">{doc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100 p-6">
                      <button className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                        <Download className="h-4 w-4" />
                        {t('eligibility_page.documents_tab.download_checklist')}
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
                          <h2 className="text-2xl font-bold text-gray-800">{t('eligibility_page.benefits_tab.title')}</h2>
                          <p className="text-gray-600">{t('eligibility_page.benefits_tab.subtitle')}</p>
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
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t('eligibility_page.sidebar.quick_stats')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
                    <span className="text-gray-600">{t('eligibility_page.sidebar.stats.eligibility')}</span>
                    <span className="font-bold text-blue-600">{eligibilityCriteria.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50">
                    <span className="text-gray-600">{t('eligibility_page.sidebar.stats.documents')}</span>
                    <span className="font-bold text-purple-600">{requiredDocuments.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                    <span className="text-gray-600">{t('eligibility_page.sidebar.stats.benefits')}</span>
                    <span className="font-bold text-green-600">{benefits.length}</span>
                  </div>
                </div>
              </div>

              {/* Application Steps */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t('eligibility_page.sidebar.application_process')}</h3>
                <div className="space-y-3">
                  {steps && steps.length > 0 ? (
                    steps.map((step, index) => (
                      <div key={step._id || index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{step.title || step.stepTitle || `Step ${index + 1}`}</p>
                          <p className="text-sm text-gray-600">{step.action || step.description || ""}</p>
                          {step.location && <p className="text-sm text-gray-500"><em>Location:</em> {step.location}</p>}
                          {step.why && <p className="text-sm text-gray-500"><em>Why:</em> {step.why}</p>}
                          {step.estimatedTime && <p className="text-sm text-gray-500"><em>Time:</em> {step.estimatedTime}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Visit the official website for detailed application process.</p>
                  )}
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-white">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-800">{t('eligibility_page.sidebar.need_help.title')}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {t('eligibility_page.sidebar.need_help.desc')}
                </p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold border border-blue-200 hover:bg-blue-50 transition-colors">
                  {t('eligibility_page.sidebar.need_help.btn')}
                </button>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">{t('eligibility_page.cta.title')}</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                {t('eligibility_page.cta.desc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCheckEligibility}
                  disabled={checking}
                  className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {checking ? "Checking..." : t('eligibility_page.cta.check_btn')}
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all">
                  {t('eligibility_page.cta.download_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal/Alert */}
      {checkResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setCheckResult(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>

            <div className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto ${checkResult.status === "Eligible" ? "bg-green-100 text-green-600" :
              checkResult.status === "Not Eligible" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"
              }`}>
              {checkResult.status === "Eligible" ? <CheckCircle className="h-8 w-8" /> :
                checkResult.status === "Not Eligible" ? <XCircle className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
            </div>

            <h3 className="text-2xl font-bold text-center mb-2">{checkResult.status}</h3>
            <p className="text-center text-gray-600 mb-6">{checkResult.reason}</p>

            <button
              onClick={() => setCheckResult(null)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Okay, understood
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EligibilityPage;
