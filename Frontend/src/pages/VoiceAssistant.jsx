import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, FileText, ArrowRight, Mic, Square } from "lucide-react";
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
      setAssistantText(`Listening in ${languageConfig[language].label}...`);
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
      setAssistantText("Error listening. Please try typing instead.");
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
    setAssistantText(`Searching for "${text}"...`);
    
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/scheme/search?keyword=${encodeURIComponent(text)}&language=${language}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const schemes = data.schemes || [];
      setMatchedSchemes(schemes);
      
      if (schemes.length > 0) {
        if (data.source === "external_api") {
          setAssistantText(`Found ${schemes.length} external scheme(s) for "${text}"`);
        } else {
          setAssistantText(`Found ${schemes.length} scheme(s) from database`);
        }
      } else {
        setAssistantText(`No schemes found for "${text}"`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setAssistantText("Error connecting to server. Please try again.");
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
      setAssistantText("Stopped listening");
    } else {
      setQueryText("");
      setAssistantText("Speak now...");
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSchemes(queryText);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header variant="landing" />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-8 mb-12">
            <button
              onClick={handleMicClick}
              className={`p-5 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              }`}
            >
              {isListening ? (
                <Square className="h-7 w-7" />
              ) : (
                <Mic className="h-7 w-7" />
              )}
            </button>

            <div className="relative">
              <Button 
                onClick={() => setShowLangDropdown(!showLangDropdown)} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" /> 
                {languageConfig[language].label}
              </Button>

              {showLangDropdown && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-xl z-50 min-w-[120px]">
                  {Object.entries(languageConfig).map(([key, { label }]) => (
                    <button
                      key={key}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        language === key ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                      onClick={() => {
                        setLanguage(key);
                        setShowLangDropdown(false);
                        setAssistantText(`Language changed to ${label}`);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
              <div className="flex gap-2">
                <input
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder={
                    language === 'en' ? "Search government schemes..." :
                    language === 'hi' ? "सरकारी योजनाएं खोजें..." :
                    "सरकारी योजना शोधा..."
                  }
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={!queryText.trim() || isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            <div className="w-full max-w-2xl min-h-[40px]">
              <p className="text-gray-600 text-center">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    {assistantText}
                  </span>
                ) : assistantText || "Use voice or text to search government schemes"}
              </p>
            </div>
          </div>

          {matchedSchemes.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {language === 'en' ? 'Search Results' : 
                   language === 'hi' ? 'खोज परिणाम' : 
                   'शोध परिणाम'}
                  <span className="ml-3 text-lg font-normal text-gray-600">
                    ({matchedSchemes.length} found)
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Language:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {languageConfig[language].label}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedSchemes.map((s) => {
                  const schemeId = s._id?.$oid || s._id || s.id;

                  return (
                    <Link
                      key={schemeId}
                      to={`/eligibility/${schemeId}?lang=${language}`}
                      className="group card-wrap rounded-xl border p-1 bg-white hover:shadow-lg transition-all hover:scale-[1.02]"
                    >
                      <div className="glass-card p-6 h-full flex flex-col">
                        {s.isExternal && (
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              External Source
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {s[`name_${language}`] || s.name_en || "Scheme Name"}
                          </h3>
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 flex-grow">
                          {s[`description_${language}`] || s.description_en || "No description available"}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {s[`category_${language}`] || s.category_en || "Government"}
                          </span>
                          <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            View Details <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {!isLoading && queryText && matchedSchemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No schemes found for "{queryText}". Try different keywords.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VoiceAssistant;