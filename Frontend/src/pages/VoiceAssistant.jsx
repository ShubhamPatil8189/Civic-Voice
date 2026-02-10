import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, FileText, ArrowRight, Mic, Square, Search, Filter, Sparkles, Waves, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const languageConfig = {
  en: { label: "English", code: "en-US" },
  hi: { label: "Hindi", code: "hi-IN" },
  mr: { label: "Marathi", code: "mr-IN" },
};

const BACKEND_URL = "http://localhost:5000";

const VoiceAssistant = () => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAssistantText("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = languageConfig[language].code;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setAssistantText(`🎤 Listening in ${languageConfig[language].label}... Speak now!`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setQueryText(text);
      await fetchSchemes(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setAssistantText("⚠️ Error listening. Please try typing instead.");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [language]);

  const fetchSchemes = async (text) => {
    if (!text || text.trim() === "") {
      setAssistantText("Please speak or type something to search");
      return;
    }
    
    setIsLoading(true);
    setAnimateCards(false);
    setAssistantText(`🔍 Searching for "${text}"...`);
    
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/voice/process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            language: language
          })
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const schemes = data.session?.matchedSchemes || [];
      
      // Add animation delay for cards
      setTimeout(() => {
        setMatchedSchemes(schemes);
        setAnimateCards(true);
      }, 100);
      
      if (schemes.length > 0) {
        setAssistantText(`✨ Found ${schemes.length} scheme(s) for "${text}"`);
      } else {
        setAssistantText(`📭 No schemes found for "${text}"`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setAssistantText("🌐 Error connecting to server. Please try again.");
      setMatchedSchemes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      setAssistantText("Voice recognition not available");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setAssistantText("⏹️ Stopped listening");
    } else {
      setQueryText("");
      setAssistantText("🎤 Speak now...");
      try {
        recognitionRef.current.start();
      } catch (error) {
        setAssistantText("⚠️ Microphone error. Please try typing.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSchemes(queryText);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Header variant="landing" />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">AI Voice Assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Voice Search Government Schemes
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Speak in your preferred language to discover relevant government schemes instantly
            </p>
          </div>

          {/* Search Interface */}
          <div className="glass-card rounded-3xl p-8 mb-16 shadow-2xl border border-white/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-8">
              {/* Voice Button with Animation */}
              <div className="relative">
                <div className={`absolute inset-0 rounded-full ${isListening ? 'animate-ping bg-red-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'} opacity-20`}></div>
                <button
                  onClick={handleMicClick}
                  className={`relative p-6 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-200' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Square className="h-10 w-10 text-white" />
                      <Waves className="absolute h-14 w-14 text-white/30 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <Mic className="h-10 w-10 text-white" />
                      <div className="absolute -inset-4 rounded-full border-2 border-blue-300/30 animate-pulse"></div>
                    </>
                  )}
                </button>
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {isListening ? "Click to Stop" : "Click to Speak"}
                  </p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <Button 
                  onClick={() => setShowLangDropdown(!showLangDropdown)} 
                  variant="outline"
                  className="flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Globe className="h-5 w-5 text-blue-600" /> 
                  <span className="font-semibold">{languageConfig[language].label}</span>
                  <div className="ml-2 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </Button>

                {showLangDropdown && (
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 min-w-[160px] overflow-hidden">
                    {Object.entries(languageConfig).map(([key, { label }]) => (
                      <button
                        key={key}
                        className={`block w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all ${
                          language === key ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-semibold' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          setLanguage(key);
                          setShowLangDropdown(false);
                          setAssistantText(`🌐 Language changed to ${label}`);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${language === key ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`}></div>
                          {label}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                  <div className="relative flex gap-3 p-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                    <div className="flex-1 flex items-center pl-5">
                      <Search className="h-5 w-5 text-gray-400 mr-3" />
                      <input
                        className="flex-1 py-4 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg"
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        placeholder={
                          language === 'en' ? "Type your query or speak to search..." :
                          language === 'hi' ? "अपना प्रश्न टाइप करें या बोलकर खोजें..." :
                          "तुमचा प्रश्न टाइप करा किंवा बोलून शोधा..."
                        }
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={!queryText.trim() || isLoading}
                      className="rounded-xl px-8 py-4 m-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Searching...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Search
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              {/* Assistant Message */}
              <div className="w-full max-w-2xl">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${
                  isLoading ? 'bg-blue-50 border border-blue-100' : 
                  matchedSchemes.length > 0 ? 'bg-green-50 border border-green-100' :
                  'bg-gray-50 border border-gray-100'
                }`}>
                  <p className="text-center font-medium">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-700">{assistantText}</span>
                      </span>
                    ) : (
                      <span className={`flex items-center justify-center gap-2 ${
                        matchedSchemes.length > 0 ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {matchedSchemes.length > 0 ? '✨' : '💡'} {assistantText || "💬 Speak or type to search government schemes"}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQueryText("farmer")}
                  className="rounded-full px-4 py-2 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  👨‍🌾 Farmer Schemes
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQueryText("health")}
                  className="rounded-full px-4 py-2 border-2 hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  🏥 Health Insurance
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQueryText("education")}
                  className="rounded-full px-4 py-2 border-2 hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  📚 Education
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQueryText("housing")}
                  className="rounded-full px-4 py-2 border-2 hover:border-orange-300 hover:bg-orange-50 transition-all"
                >
                  🏠 Housing
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {matchedSchemes.length > 0 && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {language === 'en' ? 'Found Schemes' : 
                     language === 'hi' ? 'मिली योजनाएं' : 
                     'सापडलेल्या योजना'}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Click on any scheme to check eligibility and apply
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
                    <Filter className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {matchedSchemes.length} schemes found
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      {languageConfig[language].label}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Animated Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matchedSchemes.map((s, index) => {
                  const schemeId = s._id?.$oid || s._id || s.id || `scheme-${index}`;
                  const delay = index * 100;

                  return (
                    <Link
                      key={schemeId}
                      to={`/eligibility/${schemeId}?lang=${language}`}
                      className={`group block ${animateCards ? 'animate-fadeInUp' : 'opacity-0'}`}
                      style={{ animationDelay: `${delay}ms` }}
                    >
                      <div className="h-full rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2">
                        {/* Card Header with Gradient */}
                        <div className="relative h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
                        
                        <div className="p-6">
                          {/* Scheme Icon */}
                          <div className="mb-4 flex items-center justify-between">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                              Government Scheme
                            </div>
                          </div>

                          {/* Scheme Name */}
                          <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {s.name || s.name_en || "Government Scheme"}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                            {s.description || s.description_en || "Government initiative for citizen welfare and development."}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                              {languageConfig[language].label}
                            </span>
                            <span className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full font-medium">
                              Official
                            </span>
                            {s.category && (
                              <span className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium">
                                {s.category}
                              </span>
                            )}
                          </div>

                          {/* CTA Button */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-500">Check eligibility</span>
                            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                              View Details 
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* No Results Message */}
          {!isLoading && queryText && matchedSchemes.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No schemes found</h3>
                  <p className="text-gray-600 mb-6">
                    No schemes found for "<span className="font-semibold">{queryText}</span>". Try different keywords like: farmer, health, education, housing
                  </p>
                  <Button 
                    onClick={() => setQueryText("")}
                    variant="outline"
                    className="rounded-full px-6"
                  >
                    Try Another Search
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {/* Custom Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;