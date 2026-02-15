import { Link } from "react-router-dom";
import { Globe, Users, Lightbulb, ShieldCheck, Clock, Award } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="landing" />

      <style>{` 
        .hero-blob { position:absolute; inset:0; background: radial-gradient(600px 300px at 10% 10%, rgba(124,58,237,0.06), transparent 18%), radial-gradient(400px 220px at 90% 80%, rgba(6,182,212,0.04), transparent 16%); pointer-events:none; }
        .glass-hero { border-radius: 1rem; padding: 2.25rem; background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94)); box-shadow: 0 24px 60px rgba(2,6,23,0.06); }
        .stat { background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92)); border-radius: .75rem; padding: .8rem; box-shadow: 0 10px 30px rgba(2,6,23,0.04); }
        .card-hover { transition: transform .36s cubic-bezier(.2,.9,.2,1), box-shadow .36s; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 30px 80px rgba(2,6,23,0.10); }
      `}</style>

      <main className="container mx-auto px-4 py-16 relative">
        <div className="hero-blob" />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="glass-hero">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about_page.title')}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t('about_page.description')}
            </p>

            <div className="flex gap-3 flex-wrap">
              <Button asChild className="px-6 py-3">
                <Link to="/voice-assistant">{t('about_page.try_voice')}</Link>
              </Button>
              <Button variant="outline" asChild className="px-6 py-3">
                <Link to="/schemes">{t('about_page.explore_schemes')}</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="stat flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-semibold">{t('about_page.integrated_access.title')}</div>
                <div className="text-sm text-muted-foreground">{t('about_page.integrated_access.desc')}</div>
              </div>
            </div>

            <div className="stat flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white shadow">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-semibold">{t('about_page.citizen_centric.title')}</div>
                <div className="text-sm text-muted-foreground">{t('about_page.citizen_centric.desc')}</div>
              </div>
            </div>

            <div className="stat flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white shadow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-semibold">{t('about_page.secure_private.title')}</div>
                <div className="text-sm text-muted-foreground">{t('about_page.secure_private.desc')}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('about_page.mission_title')}</h2>
          <div className="max-w-3xl mx-auto text-center text-muted-foreground">
            <p className="mb-4">{t('about_page.mission_desc_1')}</p>
            <p>{t('about_page.mission_desc_2')}</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('about_page.quick_facts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card-hover p-6 bg-white rounded-2xl text-center">
              <div className="text-3xl font-bold">{t('about_page.facts.schemes.count')}</div>
              <div className="text-sm text-muted-foreground">{t('about_page.facts.schemes.label')}</div>
            </div>
            <div className="card-hover p-6 bg-white rounded-2xl text-center">
              <div className="text-3xl font-bold">{t('about_page.facts.beneficiaries.count')}</div>
              <div className="text-sm text-muted-foreground">{t('about_page.facts.beneficiaries.label')}</div>
            </div>
            <div className="card-hover p-6 bg-white rounded-2xl text-center">
              <div className="text-3xl font-bold">{t('about_page.facts.satisfaction.count')}</div>
              <div className="text-sm text-muted-foreground">{t('about_page.facts.satisfaction.label')}</div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('about_page.how_we_work')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 glass-card">
              <Lightbulb className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{t('about_page.work_steps.discovery.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('about_page.work_steps.discovery.desc')}</p>
            </div>
            <div className="p-6 glass-card">
              <Clock className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{t('about_page.work_steps.guided.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('about_page.work_steps.guided.desc')}</p>
            </div>
            <div className="p-6 glass-card">
              <Award className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{t('about_page.work_steps.support.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('about_page.work_steps.support.desc')}</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('about_page.get_involved')}</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground mb-4">{t('about_page.involved_desc')}</p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild><Link to="/contact">{t('about_page.contact_us')}</Link></Button>
              <Button variant="outline" asChild><Link to="/summary">{t('about_page.view_summary')}</Link></Button>
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

export default About;
