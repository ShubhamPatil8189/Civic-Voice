import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Languages, FootprintsIcon, FileX, MonitorX, ArrowRight, ShieldCheck, Landmark } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MicButton from "@/components/ui/MicButton";
import FeatureCard from "@/components/ui/FeatureCard";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Languages,
      title: t('landing.features.ask_language.title'),
      description: t('landing.features.ask_language.desc'),
    },
    {
      icon: FootprintsIcon,
      title: t('landing.features.step_assistance.title'),
      description: t('landing.features.step_assistance.desc'),
    },
    {
      icon: FileX,
      title: t('landing.features.no_paperwork.title'),
      description: t('landing.features.no_paperwork.desc'),
    },
    {
      icon: MonitorX,
      title: t('landing.features.no_portal.title'),
      description: t('landing.features.no_portal.desc'),
    },
  ];

  const pages = [
    {
      path: "/voice-assistant",
      title: t('landing.voice_assistant.title'),
      description: t('landing.voice_assistant.desc'),
    },
    {
      path: "/eligibility",
      title: t('landing.eligibility_check.title'),
      description: t('landing.eligibility_check.desc'),
    },
    {
      path: "/steps",
      title: t('landing.guide.title'),
      description: t('landing.guide.desc'),
    },
    {
      path: "/summary",
      title: t('landing.summary.title'),
      description: t('landing.summary.desc'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Official-style Header */}
      <Header variant="landing" />

      {/* custom styles for animations & glass gradients */}
      <style>{`
        :root{--accent1:#7c3aed;--accent2:#06b6d4;}
        .fancy-hero { background: linear-gradient(135deg, rgba(124,58,237,0.04), rgba(6,182,212,0.02)); border-radius: 1rem; padding: 1.6rem; box-shadow: 0 6px 18px rgba(99,102,241,0.04); }
        .card-wrap { padding: 2px; border-radius: 1rem; background: linear-gradient(90deg,var(--accent1),var(--accent2)); }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85)); border-radius: calc(1rem - 2px); padding: 1.2rem; backdrop-filter: blur(6px); box-shadow: 0 6px 18px rgba(2,6,23,0.04); transition: transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s; }
        .glass-card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 12px 24px rgba(2,6,23,0.08); }
        .float { animation: float 8s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
        .icon-badge { display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:12px; background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.9)); box-shadow: inset 0 -2px 6px rgba(0,0,0,0.03); transition: transform .18s; }
        .icon-badge:hover { transform: rotate(-3deg) scale(1.03); }
        .nav-card { transition: transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s; border-radius: 1rem; overflow: hidden; }
        .nav-card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 12px 24px rgba(2,6,23,0.08); }
        .page-badge { background: linear-gradient(90deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05)); padding: .45rem .75rem; border-radius: .75rem; font-weight:600; }
        .feature-title { background: linear-gradient(135deg,#8b5cf6,#06b6d4); -webkit-background-clip: text; background-clip: text; color: transparent; }

        
      `}</style>

      {/* Hero Section */}
      <section className="relative py-14 md:py-20 border-b">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - glassy fancy card */}
          <div>
            <div className="fancy-hero">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 text-sm font-medium">
                <Landmark className="h-4 w-4" />
                {t('landing.official_badge')}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {t('landing.gateway_to')} <span className="text-gradient bg-clip-text feature-title">{t('landing.gov_schemes')}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mb-6">
                {t('landing.hero_description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                <LanguageSelector />
                <Link to="/voice-assistant">
                  <div className="card-wrap rounded-xl">
                    <div className="glass-card flex items-center gap-3">
                      <MicButton size="lg" label={t('landing.voice_assistant.title')} />
                      <div className="text-sm text-muted-foreground">{t('landing.speak_naturally')}</div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                {t('landing.secure_reliable')}
              </div>
            </div>
          </div>

          {/* Right Illustration with float */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-50 to-indigo-50 blur-sm opacity-30"></div>
            <div className="card-wrap rounded-2xl overflow-hidden">
              <div className="glass-card relative p-4">
                <img
                  src="/civic-illustration.jpg"
                  alt="Civic Services Illustration"
                  className="relative rounded-2xl border bg-white p-4 transition-transform duration-500"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-14 bg-secondary/10">
        <div className="container">
          <h2 className="text-xl font-semibold text-center mb-8">
            {t('landing.explore_modules')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="group nav-card"
              >
                <div className="card-wrap rounded-xl">
                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="page-badge mb-2">{page.title}</div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {page.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {page.description}
                        </p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t('landing.designed_for')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('landing.designed_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card-wrap rounded-2xl">
                <div className="glass-card p-6">
                  <div className="mb-4">
                    <div className="icon-badge">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 feature-title">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
