import { Link } from "react-router-dom";
import { Globe, Users, Lightbulb, ShieldCheck, Clock, Award } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Civic Voice Interface</h1>
            <p className="text-lg text-muted-foreground mb-6">
              We make government schemes discoverable and understandable for every citizen — in local
              languages, with voice-first interactions and step-by-step guidance that reduces friction and paperwork.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Button asChild className="px-6 py-3"> 
                <Link to="/voice-assistant">Try Voice Assistant</Link>
              </Button>
              <Button variant="outline" asChild className="px-6 py-3"> 
                <Link to="/schemes">Explore Schemes</Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="stat flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-semibold">Integrated Access</div>
                <div className="text-sm text-muted-foreground">Single place to find schemes, eligibility and steps.</div>
              </div>
            </div>

            <div className="stat flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white shadow">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-semibold">Citizen-Centric</div>
                <div className="text-sm text-muted-foreground">Built for accessibility, local languages and low-bandwidth contexts.</div>
              </div>
            </div>

            <div className="stat flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white shadow">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-semibold">Secure & Private</div>
                <div className="text-sm text-muted-foreground">Minimal data storage and explicit consent for any personal details.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Our Mission</h2>
          <div className="max-w-3xl mx-auto text-center text-muted-foreground">
            <p className="mb-4">To break down barriers between citizens and government support — by providing clear, conversational, and localized access to schemes and services.</p>
            <p>We focus on inclusion: farmers, women, children, entrepreneurs and vulnerable communities should be able to find help quickly, without navigating complex portals.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Facts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card-hover p-6 bg-white rounded-2xl text-center">
              <div className="text-3xl font-bold">350+</div>
              <div className="text-sm text-muted-foreground">Active schemes indexed</div>
            </div>
            <div className="card-hover p-6 bg-white rounded-2xl text-center">
              <div className="text-3xl font-bold">120k+</div>
              <div className="text-sm text-muted-foreground">Beneficiaries reached</div>
            </div>
            <div className="card-hover p-6 bg-white rounded-2xl text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-sm text-muted-foreground">Satisfaction in guided flows</div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">How we work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 glass-card">
              <Lightbulb className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Discovery</h3>
              <p className="text-sm text-muted-foreground">We map schemes, eligibility rules and common applicant journeys so citizens get accurate answers fast.</p>
            </div>
            <div className="p-6 glass-card">
              <Clock className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Guided Steps</h3>
              <p className="text-sm text-muted-foreground">Stepwise, localized instructions reduce mistakes and the need to revisit offices.</p>
            </div>
            <div className="p-6 glass-card">
              <Award className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">We connect users to phone and in-person help where automated flows can't complete the process.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Get involved</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground mb-4">If you represent a local government body or an NGO and want to keep scheme information up to date, reach out — we prioritize verified partners.</p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild><Link to="/contact">Contact Us</Link></Button>
              <Button variant="outline" asChild><Link to="/summary">View Your Summary</Link></Button>
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
