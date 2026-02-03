import { useState } from "react";
import { Link } from "react-router-dom";
import { Languages, FootprintsIcon, FileX, MonitorX, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MicButton from "@/components/ui/MicButton";
import FeatureCard from "@/components/ui/FeatureCard";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languages = ["English", "Hindi", "Marathi"];

  const features = [
    {
      icon: Languages,
      title: "Ask Anything",
      description:
        "Inquire about any government scheme in your native language naturally.",
    },
    {
      icon: FootprintsIcon,
      title: "Step-by-Step Guidance",
      description:
        "We guide you through eligibility and application processes clearly and simply.",
    },
    {
      icon: FileX,
      title: "No Forms",
      description:
        "Say goodbye to complex paperwork and tedious manual data entry.",
    },
    {
      icon: MonitorX,
      title: "No Portals",
      description:
        "Direct access to information without navigating dozens of official websites.",
    },
  ];

  const pages = [
    {
      path: "/voice-assistant",
      title: "Voice Assistant",
      description: "Start a conversation with our AI assistant",
    },
    {
      path: "/eligibility",
      title: "Eligibility Details",
      description: "See why schemes apply to you",
    },
    {
      path: "/steps",
      title: "Step-by-Step Guide",
      description: "Follow guided application steps",
    },
    {
      path: "/summary",
      title: "Action Summary",
      description: "Review your civic action summary",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="hero-section py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            <span className="italic">Speak.</span>{" "}
            <span className="italic">Understand.</span>{" "}
            <span className="italic">Act.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Access government schemes and civic services through a simple
            conversation in your native language.
          </p>

          <LanguageSelector
            languages={languages}
            selected={selectedLanguage}
            onSelect={setSelectedLanguage}
            className="mb-12"
          />

          <Link to="/voice-assistant">
            <MicButton size="lg" label="Start Speaking" />
          </Link>
        </div>
      </section>

      {/* Quick Navigation to All Pages */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h2 className="text-xl font-semibold text-center mb-6">Explore All Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="card-elevated p-4 hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Simplify Your Civic Experience
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Navigate government services without the complexity of traditional
              forms and portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
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
