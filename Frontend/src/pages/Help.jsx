import { Link } from "react-router-dom";
import { Search, MessageCircle, Phone, Mail, Zap, BookOpen, AlertCircle, Home } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Help = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = t('help_page.faqs', { returnObjects: true });

  const filteredFaqs = Array.isArray(faqs) ? faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="landing" />

      <style>{`
        .hero-blob { position:absolute; inset:0; background: radial-gradient(800px 400px at 10% 10%, rgba(124,58,237,0.08), transparent 20%), radial-gradient(600px 300px at 90% 80%, rgba(6,182,212,0.06), transparent 18%); pointer-events:none; }
        .glass-hero { border-radius: 1rem; padding: 2.25rem; background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94)); box-shadow: 0 24px 60px rgba(2,6,23,0.06); }
        .search-input { background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.95)); border-radius: 999px; padding: .8rem 1.2rem; box-shadow: 0 8px 24px rgba(2,6,23,0.05); border: 1px solid rgba(2,6,23,0.04); }
        .faq-item { background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92)); border-radius: 1rem; padding: 1.5rem; box-shadow: 0 6px 18px rgba(2,6,23,0.04); transition: all .3s; }
        .faq-item:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(2,6,23,0.08); }
        .support-card { border-radius: 1rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255,255,255,0.92)); box-shadow: 0 10px 30px rgba(2,6,23,0.05); transition: transform .3s; }
        .support-card:hover { transform: translateY(-6px); }
      `}</style>

      <main className="container mx-auto px-4 py-16 relative flex-1">
        <div className="hero-blob" />

        <section className="max-w-3xl mx-auto mb-12">
          <div className="glass-hero text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('help_page.title')}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('help_page.subtitle')}
            </p>

            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('help_page.search_placeholder')}
                className="search-input w-full pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('help_page.quick_support')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="tel:1800-SCHEMES" className="support-card text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{t('help_page.support_channels.call.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('help_page.support_channels.call.desc')}</p>
            </a>

            <a href="mailto:help@civicvoice.gov" className="support-card text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{t('help_page.support_channels.email.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('help_page.support_channels.email.desc')}</p>
            </a>

            <div className="support-card text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{t('help_page.support_channels.chat.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('help_page.support_channels.chat.desc')}</p>
            </div>

            <div className="support-card text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{t('help_page.support_channels.status.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('help_page.support_channels.status.desc')}</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('help_page.faq_title')}</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <details key={i} className="faq-item group cursor-pointer">
                  <summary className="flex items-start gap-4 outline-none select-none">
                    <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">
                      {faq.c}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-open:text-primary transition-colors">{faq.q}</h3>
                    </div>
                  </summary>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">{t('help_page.no_faqs')}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">{t('help_page.quick_links.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/voice-assistant" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">{t('help_page.quick_links.voice.title')}</div>
              <div className="text-xs text-muted-foreground">{t('help_page.quick_links.voice.desc')}</div>
            </Link>

            <Link to="/schemes" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <BookOpen className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">{t('help_page.quick_links.schemes.title')}</div>
              <div className="text-xs text-muted-foreground">{t('help_page.quick_links.schemes.desc')}</div>
            </Link>

            <Link to="/eligibility" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <AlertCircle className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">{t('help_page.quick_links.eligibility.title')}</div>
              <div className="text-xs text-muted-foreground">{t('help_page.quick_links.eligibility.desc')}</div>
            </Link>

            <Link to="/" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <Home className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">{t('help_page.quick_links.home.title')}</div>
              <div className="text-xs text-muted-foreground">{t('help_page.quick_links.home.desc')}</div>
            </Link>
          </div>
        </section>

        <section className="py-8 bg-secondary/5 rounded-xl p-6">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">{t('help_page.still_need_help')}</h3>
            <p className="text-muted-foreground mb-4">{t('help_page.help_desc')}</p>
            <div className="flex gap-3 justify-center">
              <Button asChild><a href="tel:1800-SCHEMES">{t('help_page.support_channels.call.btn')}</a></Button>
              <Button variant="outline" asChild><a href="mailto:help@civicvoice.gov">{t('help_page.support_channels.email.btn')}</a></Button>
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

export default Help;
