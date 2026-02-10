import { Link } from "react-router-dom";
import { Award, Users, Briefcase, Heart, BookOpen, Leaf, Globe, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const categories = [
  { icon: Award, title: "Scholarships & Education", count: 48, desc: "Support for students, skill training and vocational programs." },
  { icon: Users, title: "Women & Child", count: 72, desc: "Health, nutrition, empowerment and safety schemes." },
  { icon: Leaf, title: "Farmers & Agriculture", count: 95, desc: "Crop support, subsidies, equipment and training." },
  { icon: Briefcase, title: "Small Business", count: 60, desc: "Loans, MSME support, incubation and market access." },
  { icon: Heart, title: "Health & Welfare", count: 40, desc: "Insurance, maternal care and preventive health programs." },
  { icon: BookOpen, title: "Livelihood & Skills", count: 35, desc: "Skill development, apprenticeships and job links." },
];

const Schemes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="landing" />

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
                <h1 className="text-3xl md:text-4xl font-bold">Public Schemes — practical support for everyone</h1>
                <p className="text-sm text-muted-foreground mt-1">From health and education to agriculture and small business support — discover schemes that make a tangible difference.</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button asChild className="px-6 py-3">
                <Link to="/voice-assistant">Talk to Voice Assistant</Link>
              </Button>
              <Button variant="outline" asChild className="px-6 py-3">
                <Link to="/eligibility">Check Eligibility</Link>
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-card flex flex-col items-start p-3">
                <div className="flex items-center gap-3">
                  <div className="accent-dot bg-indigo-500" />
                  <div>
                    <div className="text-xl font-semibold">350+</div>
                    <div className="text-xs text-muted-foreground">Active schemes</div>
                  </div>
                </div>
              </div>
              <div className="glass-card flex flex-col items-start p-3">
                <div className="flex items-center gap-3">
                  <div className="accent-dot bg-cyan-400" />
                  <div>
                    <div className="text-xl font-semibold">120k+</div>
                    <div className="text-xs text-muted-foreground">Beneficiaries helped</div>
                  </div>
                </div>
              </div>
              <div className="glass-card flex flex-col items-start p-3">
                <div className="flex items-center gap-3">
                  <div className="accent-dot bg-emerald-400" />
                  <div>
                    <div className="text-xl font-semibold">95</div>
                    <div className="text-xs text-muted-foreground">Farmer programs</div>
                  </div>
                </div>
              </div>
              <div className="glass-card flex flex-col items-start p-3">
                <div className="flex items-center gap-3">
                  <div className="accent-dot bg-amber-400" />
                  <div>
                    <div className="text-xl font-semibold">72</div>
                    <div className="text-xs text-muted-foreground">Women & child</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="p-6 bg-gradient-to-tr from-white to-slate-50 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <input className="search-input w-full pl-10" placeholder="Search schemes, beneficiaries, keywords..." />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Button className="px-5 py-3">Filter</Button>
              </div>

              <p className="text-sm text-muted-foreground">Tip: Try queries like “farmer subsidy”, “women entrepreneurship”, or “school scholarship”</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Explore by Category</h2>
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
                      <Button asChild variant="ghost"><Link to="/voice-assistant">Ask Assistant</Link></Button>
                      <Button asChild variant="outline"><Link to="/eligibility">Check Eligibility</Link></Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-8 bg-secondary/5 rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold">Why use this platform?</h3>
              <p className="text-sm text-muted-foreground">Quick discovery, minimal paperwork, and step-by-step guidance — built to put citizens first.</p>
            </div>
            <div>
              <Button asChild className="px-6 py-3"> 
                <Link to="/voice-assistant">Start Guided Voice Assistant</Link>
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
