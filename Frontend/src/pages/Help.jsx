import { Link } from "react-router-dom";
import { Search, MessageCircle, Phone, Mail, Zap, BookOpen, AlertCircle, Home } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      q: "How do I find schemes I'm eligible for?",
      a: "Use the Voice Assistant to describe your situation (e.g., 'I'm a farmer looking for subsidies'), or visit the Schemes page and browse by category. The platform will match you with relevant programs.",
      category: "Getting Started"
    },
    {
      q: "What languages are supported?",
      a: "We currently support English, Hindi, and Marathi. You can change language from the language selector in the navbar.",
      category: "Features"
    },
    {
      q: "How do I check my eligibility?",
      a: "Click 'Check Eligibility' on any scheme card. Answer simple questions about your income, location, age and occupation. Results are instant.",
      category: "Eligibility"
    },
    {
      q: "Can I save my progress?",
      a: "Yes. Visit the Action Summary page to view your previous queries, matched schemes and next steps. No login required.",
      category: "Account & Progress"
    },
    {
      q: "Is my data secure?",
      a: "We collect minimal personal data and only with your explicit consent. We never share your information with third parties without permission.",
      category: "Privacy & Security"
    },
    {
      q: "How do I apply for a scheme after finding it?",
      a: "Visit the Application Guide for step-by-step instructions, required documents, and links to official portals or offline application centers.",
      category: "Application"
    },
    {
      q: "Can I use this platform on mobile?",
      a: "Yes. The platform is fully optimized for mobile and works on both iOS and Android browsers.",
      category: "Technical"
    },
    {
      q: "What if the Voice Assistant doesn't understand me?",
      a: "Try the text input option instead, or contact our support team. We're continuously improving our voice recognition.",
      category: "Troubleshooting"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers, troubleshoot issues, or get in touch with our team.
            </p>

            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQs (e.g., 'eligibility', 'language', 'mobile')..."
                className="search-input w-full pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="tel:1800-SCHEMES" className="support-card text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-muted-foreground">1800-SCHEMES (24/7)</p>
            </a>

            <a href="mailto:help@civicvoice.gov" className="support-card text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">help@civicvoice.gov</p>
            </a>

            <div className="support-card text-center">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Chat</h3>
              <p className="text-sm text-muted-foreground">Live chat available 9am–6pm</p>
            </div>

            <div className="support-card text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Status</h3>
              <p className="text-sm text-muted-foreground">Check system uptime</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <details key={i} className="faq-item group cursor-pointer">
                  <summary className="flex items-start gap-4 outline-none select-none">
                    <div className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">
                      {faq.category}
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
                <p className="text-muted-foreground">No FAQs match your search. Try different keywords.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/voice-assistant" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Voice Assistant</div>
              <div className="text-xs text-muted-foreground">Ask in your language</div>
            </Link>

            <Link to="/schemes" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <BookOpen className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Browse Schemes</div>
              <div className="text-xs text-muted-foreground">Explore by category</div>
            </Link>

            <Link to="/eligibility" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <AlertCircle className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Check Eligibility</div>
              <div className="text-xs text-muted-foreground">Get instant answers</div>
            </Link>

            <Link to="/" className="p-4 bg-white rounded-lg border border-border/40 hover:border-primary hover:shadow-md transition text-center">
              <Home className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm">Home</div>
              <div className="text-xs text-muted-foreground">Back to start</div>
            </Link>
          </div>
        </section>

        <section className="py-8 bg-secondary/5 rounded-xl p-6">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">Our support team is here to assist. Reach out via phone, email or chat anytime.</p>
            <div className="flex gap-3 justify-center">
              <Button asChild><a href="tel:1800-SCHEMES">Call Now</a></Button>
              <Button variant="outline" asChild><a href="mailto:help@civicvoice.gov">Send Email</a></Button>
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
