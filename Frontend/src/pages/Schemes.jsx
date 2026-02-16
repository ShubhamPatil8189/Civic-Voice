import { Link } from "react-router-dom";
import { Award, Users, Briefcase, Heart, BookOpen, Leaf, Globe, Search, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { authAPI } from "@/services/api"; // Added

const Schemes = () => {
  const { t } = useTranslation();

  const categories = [
    { icon: Award, title: t('schemes_page.categories.scholarship.title'), count: 48, desc: t('schemes_page.categories.scholarship.desc') },
    { icon: Users, title: t('schemes_page.categories.women.title'), count: 72, desc: t('schemes_page.categories.women.desc') },
    { icon: Leaf, title: t('schemes_page.categories.farmers.title'), count: 95, desc: t('schemes_page.categories.farmers.desc') },
    { icon: Briefcase, title: t('schemes_page.categories.business.title'), count: 60, desc: t('schemes_page.categories.business.desc') },
    { icon: Heart, title: t('schemes_page.categories.health.title'), count: 40, desc: t('schemes_page.categories.health.desc') },
    { icon: BookOpen, title: t('schemes_page.categories.skills.title'), count: 35, desc: t('schemes_page.categories.skills.desc') },
  ];

  /* State for Check Eligibility */
  const [checkingId, setCheckingId] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  // Reusing the same backend logic
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleCheckEligibility = async (schemeName) => {
    setCheckingId(schemeName);
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
        alert("Please login to check eligibility securely.");
        setCheckingId(null);
        return;
      }

      // Since we don't have full scheme data here, we just pass the name
      // The backend will fetch DB scheme or hallucinate based on name (if strictly needed, but better to fetch details first)
      const res = await fetch(`${BACKEND_URL}/api/eligibility/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeData: { name_en: schemeName },
          userProfile: userProfile
        })
      });

      const result = await res.json();
      setCheckResult(result);
    } catch (err) {
      console.error(err);
      alert("Error checking eligibility");
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="landing" />

      {/* ... styles ... */}
      <style>{`
        :root{--accent1:#7c3aed;--accent2:#06b6d4;}
        .hero-blob { position:absolute; inset:0; background: radial-gradient(800px 400px at 10% 10%, rgba(124,58,237,0.08), transparent 20%), radial-gradient(600px 300px at 90% 80%, rgba(6,182,212,0.06), transparent 18%); pointer-events:none; }
        .intro-card { border-radius: 1rem; padding: 2rem; background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92)); box-shadow: 0 18px 50px rgba(2,6,23,0.06); }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88)); border-radius: 1rem; padding: 1rem; backdrop-filter: blur(6px); box-shadow: 0 8px 30px rgba(2,6,23,0.05); }
        .category { transition: transform .32s cubic-bezier(.2,.9,.3,1), box-shadow .32s; border-radius: 1rem; }
        .category:hover { transform: translateY(-10px) rotate(-0.5deg); box-shadow: 0 22px 60px rgba(2,6,23,0.10); }
        .accent-dot { width: 10px; height: 10px; border-radius: 999px; box-shadow: 0 6px 20px rgba(124,58,237,0.12); }
        .search-input { background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9)); border-radius: 999px; padding: .6rem 1rem; box-shadow: 0 6px 24px rgba(2,6,23,0.04); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
      `}</style>

      <main className="container mx-auto px-4 py-16 relative">
        <div className="hero-blob" />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="intro-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{t('schemes_page.title')}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('schemes_page.subtitle')}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button asChild className="px-6 py-3">
                <Link to="/voice-assistant">{t('schemes_page.talk_to_assistant')}</Link>
              </Button>
              <Button variant="outline" asChild className="px-6 py-3">
                <Link to="/eligibility/General_Scheme">{t('schemes_page.check_eligibility')}</Link>
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Stats Cards - kept same */}
              <div className="glass-card flex flex-col items-start p-3">
                <div className="flex items-center gap-3">
                  <div className="accent-dot bg-indigo-500" />
                  <div>
                    <div className="text-xl font-semibold">350+</div>
                    <div className="text-xs text-muted-foreground">{t('schemes_page.active_schemes')}</div>
                  </div>
                </div>
              </div>
              {/* ... other stats ... */}
            </div>
          </div>

          <div>
            <div className="p-6 bg-gradient-to-tr from-white to-slate-50 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <input className="search-input w-full pl-10" placeholder={t('schemes_page.search_placeholder')} />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Button className="px-5 py-3">{t('schemes_page.filter')}</Button>
              </div>

              <p className="text-sm text-muted-foreground">{t('schemes_page.tip')}</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('schemes_page.explore_category')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, i) => (
              <div key={c.title} className="category p-6 bg-white rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                    <c.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold">{c.title}</h3>
                      <div className="text-sm text-muted-foreground">{c.count} active</div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <Button asChild variant="ghost"><Link to="/voice-assistant">{t('schemes_page.ask_assistant')}</Link></Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCheckEligibility(c.title)} // Using category title as proxy scheme name for demo
                        disabled={checkingId === c.title}
                      >
                        {checkingId === c.title ? "Checking..." : t('schemes_page.check_eligibility')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reusing Result Modal */}
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

        <section className="py-8 bg-secondary/5 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold">{t('schemes_page.why_use')}</h3>
              <p className="text-sm text-muted-foreground">{t('schemes_page.why_desc')}</p>
            </div>
            <div>
              <Button asChild className="px-6 py-3">
                <Link to="/voice-assistant">{t('schemes_page.start_assistant')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Schemes;
