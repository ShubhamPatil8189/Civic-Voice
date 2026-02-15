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

import { useTranslation } from "react-i18next";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const EligibilityPage = () => {
  const { t, i18n } = useTranslation();
  const { schemeId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("eligibility");



  useEffect(() => {
    const fetchEligibility = async () => {
      setLoading(true);
      try {
        // The backend will handle both DB and LLM schemes
        const res = await fetch(
          `${BACKEND_URL}/api/eligibility/${encodeURIComponent(schemeId)}?lang=${i18n.language}`
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
                          <h2 className="text-2xl font-bold text-gray-800">{t('eligibility_page.eligibility_tab.title')}</h2>
                          <p className="text-gray-600">{t('eligibility_page.eligibility_tab.subtitle')}</p>
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
                          <span className="font-semibold">Note:</span> {t('eligibility_page.eligibility_tab.note')}
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

              {/* Application Process */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t('eligibility_page.sidebar.application_process')}</h3>
                <div className="space-y-3">
                  {(t('eligibility_page.sidebar.steps', { returnObjects: true }) || []).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  {t('eligibility_page.sidebar.start_application')}
                </button>
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
                <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition-all">
                  {t('eligibility_page.cta.check_btn')}
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all">
                  {t('eligibility_page.cta.download_btn')}
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