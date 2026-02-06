import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, ArrowDown, Search, FileText, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MicButton from "@/components/ui/MicButton";

const languageConfig = {
  en: { label: "English", code: "en-US" },
  hi: { label: "Hindi", code: "hi-IN" },
  mr: { label: "Marathi", code: "mr-IN" },
};

const BACKEND_URL = "http://localhost:5000";

const VoiceAssistant = () => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [language, setLanguage] = useState("en");
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  // Setup voice recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = languageConfig[language].code;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => {
      setIsListening(false);
      setAssistantText("Error in recognition.");
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setSpokenText(text);
      await fetchSchemes(text);
    };

    recognitionRef.current = recognition;
  }, [language]);

  // Fetch matching schemes from backend
  const fetchSchemes = async (text) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/voice/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      const data = await res.json();
      setMatchedSchemes(data.session?.matchedSchemes || []);
      const reply = data.session?.matchedSchemes?.length
        ? `Found ${data.session.matchedSchemes.length} scheme(s).`
        : "No matching schemes found.";
      setAssistantText(reply);
      speak(reply);
    } catch (err) {
      console.error(err);
      setAssistantText("Error fetching schemes.");
    }
  };

  // Speak text using Web Speech API
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = languageConfig[language].code;
    window.speechSynthesis.speak(utter);
  };

  // Handle mic button click
  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else {
      setSpokenText("");
      setAssistantText("");
      setMatchedSchemes([]);
      recognitionRef.current.start();
    }
  };

  // Handle text input submission
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setSpokenText(queryText);
    await fetchSchemes(queryText);
  };

  // Handle language selection
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setShowLangDropdown(false);
    setMatchedSchemes([]);
    setAssistantText("");
    setSpokenText("");
    setQueryText("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <Header variant="landing" />

      <style>{`
        :root{--accent1:#7c3aed;--accent2:#06b6d4;}
        .card-wrap { padding: 2px; border-radius: 1rem; background: linear-gradient(90deg,var(--accent1),var(--accent2)); }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85)); border-radius: calc(1rem - 2px); padding: 1.2rem; backdrop-filter: blur(6px); box-shadow: 0 6px 18px rgba(2,6,23,0.04); transition: transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s; }
        .glass-card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 12px 24px rgba(2,6,23,0.08); }
        .page-badge { background: linear-gradient(90deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05)); padding: .45rem .75rem; border-radius: .75rem; font-weight:600; }
        .feature-title { background: linear-gradient(135deg,#8b5cf6,#06b6d4); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .hero-card { background: linear-gradient(135deg, rgba(124,58,237,0.04), rgba(6,182,212,0.02)); border-radius: 1rem; padding: 1.6rem; box-shadow: 0 6px 18px rgba(99,102,241,0.04); }
        .mic-ring { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-ring { 0%, 100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7); } 50% { box-shadow: 0 0 0 10px rgba(124, 58, 237, 0); } }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="hero-card max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Speak Your <span className="feature-title">Question</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Use your voice to discover government schemes and civic services tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        
        {/* Centered Mic Section */}
        <div className="flex flex-col items-center justify-center gap-8 mb-12">
          <div className="flex flex-col items-center gap-6">
            {/* Mic Button - Centered */}
            <div className={`relative ${isListening ? "mic-ring" : ""}`}>
              <div className="rounded-full p-2">
                <MicButton
                  size="lg"
                  label={isListening ? "Listening..." : "Tap to Speak"}
                  isListening={isListening}
                  onClick={handleMicClick}
                  className="h-20 w-20"
                />
              </div>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown((p) => !p)}
                className="px-4 py-2 rounded-full border border-primary/30 bg-white/60 backdrop-blur hover:bg-white/80 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Globe className="h-4 w-4" /> {languageConfig[language].label}
                <ArrowDown className="h-3 w-3" />
              </button>
              {showLangDropdown && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-40 rounded-xl bg-white shadow-lg border overflow-hidden z-10">
                  {Object.entries(languageConfig).map(([key, { label }]) => (
                    <button
                      key={key}
                      onClick={() => handleLanguageSelect(key)}
                      className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Text Input */}
          <form
            onSubmit={handleTextSubmit}
            className="w-full max-w-2xl"
          >
            <div className="card-wrap rounded-xl">
              <div className="glass-card flex items-center gap-3 p-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Or type your question here..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder-muted-foreground"
                />
                <Button type="submit" size="sm" className="rounded-lg">
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Conversation Display */}
        {(spokenText || assistantText) && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="card-wrap rounded-xl">
              <div className="glass-card p-6">
                {spokenText && (
                  <div className="mb-4 pb-4 border-b border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">You said:</p>
                    <p className="text-lg font-semibold text-foreground">{spokenText}</p>
                  </div>
                )}
                {assistantText && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assistant:</p>
                    <p className="text-lg text-primary font-semibold">{assistantText}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {matchedSchemes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              <span className="feature-title">Matching Schemes</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedSchemes.map((s) => (
                <Link
                  key={s._id}
                  to={`/eligibility/${s._id}`}
                  className="group card-wrap rounded-xl"
                >
                  <div className="glass-card p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {language === "en" ? s.name_en : language === "hi" ? s.name_hi : s.name_mr}
                      </h3>
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 flex-grow">
                      {language === "en"
                        ? s.description_en
                        : language === "hi"
                        ? s.description_hi
                        : s.description_mr}
                    </p>

                    <div className="mb-3 pb-3 border-t border-border/40">
                      <p className="text-xs text-muted-foreground mb-1">Benefits:</p>
                      <p className="text-sm font-medium text-foreground">
                        {language === "en"
                          ? s.benefits_en
                          : language === "hi"
                          ? s.benefits_hi
                          : s.benefits_mr}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {s.documentsRequired.slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                      {s.documentsRequired.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{s.documentsRequired.length - 3} more</span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!spokenText && !assistantText && matchedSchemes.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start Exploring Schemes</h3>
            <p className="text-muted-foreground">
              Tap the microphone above or type your question to discover government schemes tailored to you.
            </p>
          </div>
        )}
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default VoiceAssistant;
