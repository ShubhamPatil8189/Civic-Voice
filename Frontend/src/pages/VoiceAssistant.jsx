import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Globe, FileText, ArrowRight, Mic, Square, Search, Filter, Sparkles, Waves, Zap,
  Brain, AlertCircle, CheckCircle, XCircle, HelpCircle, ListChecks, MessageSquare,
  Send, User, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const languageConfig = {
  en: { label: "English", code: "en-US" },
  hi: { label: "Hindi", code: "hi-IN" },
  mr: { label: "Marathi", code: "mr-IN" },
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Generate or retrieve a persistent session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem("voice_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("voice_session_id", sessionId);
  }
  return sessionId;
};

const getValidLanguage = (lang) => {
  if (!lang) return "en";
  if (languageConfig[lang]) return lang;
  const prefix = lang.split("-")[0];
  if (languageConfig[prefix]) return prefix;
  return "en";
};

const VoiceAssistant = () => {
  const { t, i18n } = useTranslation();
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const initialLang = getValidLanguage(i18n.language || localStorage.getItem("lang"));
  const [language, setLanguage] = useState(initialLang);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [queryText, setQueryText] = useState("");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null);

  // Conversation history
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const sessionId = getSessionId(); // persistent session ID

  const quickSuggestions = [
    { label: t('suggestions.pension'), query: "pension" },
    { label: t('suggestions.health'), query: "health" },
    { label: t('suggestions.farmer'), query: "farmer" },
    { label: t('suggestions.education'), query: "education" },
    { label: t('suggestions.housing'), query: "housing" },
  ];

  useEffect(() => {
    localStorage.setItem("lang", language);
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAssistantText(t('voice.not_supported'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = languageConfig[language].code;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setAssistantText(t('voice.listening_in', { label: languageConfig[language].label }));
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
      setAssistantText(t('voice.error_listening'));
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSchemes = async (text) => {
    if (!text || text.trim() === "") {
      setAssistantText(t('voice.please_speak'));
      return;
    }

    // Add user message to history
    setMessages(prev => [...prev, { role: "user", content: text }]);

    setIsLoading(true);
    setAnimateCards(false);
    setGeminiResponse(null);
    setAssistantText(t('voice.searching', { query: text }));

    try {
      const res = await fetch(`${BACKEND_URL}/api/voice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, sessionId })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      setAssistantText(data.explanation || "Response received.");
      setMatchedSchemes(data.matchedSchemes || []);

      if (data.intentData) {
        setGeminiResponse({
          intentData: data.intentData,
          eligibility: data.eligibility,
          explanation: data.explanation,
          transcript: data.transcript
        });
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.explanation,
          followUp: data.intentData.follow_up_question,
          schemes: data.intentData.suggested_schemes,
          intentData: data.intentData,
          eligibility: data.eligibility
        }]);
      } else {
        // Database match – add brief message
        setMessages(prev => [...prev, {
          role: "assistant",
          content: t('schemes.found', { count: data.matchedSchemes.length })
        }]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setAssistantText(t('voice.server_error'));
      setMatchedSchemes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      setAssistantText(t('voice.not_supported'));
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setAssistantText(t('voice.stopped'));
    } else {
      setQueryText("");
      setAssistantText(t('voice.speak_now'));
      try { recognitionRef.current.start(); }
      catch (error) { setAssistantText(t('voice.mic_error')); }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSchemes(queryText);
    setQueryText("");
  };

  const handleQuickReply = (reply) => {
    setQueryText(reply);
    fetchSchemes(reply);
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
        <div className="max-w-4xl mx-auto">
          {/* Simple Hero */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('app.subtitle')}
            </p>
          </div>

          {/* Mic & Language Row */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${isListening ? 'animate-ping bg-red-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'} opacity-20`}></div>
              <button
                onClick={handleMicClick}
                className={`relative p-8 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${isListening
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-200'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl'
                  }`}
              >
                {isListening ? (
                  <Square className="h-12 w-12 text-white" />
                ) : (
                  <Mic className="h-12 w-12 text-white" />
                )}
              </button>
              <p className="mt-2 text-sm font-medium text-gray-700">
                {isListening ? t('voice.listening') : t('voice.click_to_speak')}
              </p>
            </div>

            <div className="relative">
              <Button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 bg-white/80"
              >
                <Globe className="h-4 w-4 text-blue-600" />
                <span>{languageConfig[language]?.label || "English"}</span>
              </Button>
              {showLangDropdown && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white border rounded-xl shadow-lg z-50 min-w-[120px]">
                  {Object.entries(languageConfig).map(([key, { label }]) => (
                    <button
                      key={key}
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${language === key ? 'bg-blue-50 font-semibold' : ''
                        }`}
                      onClick={() => {
                        setLanguage(key);
                        setShowLangDropdown(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {quickSuggestions.map((sugg) => (
              <Button
                key={sugg.label}
                variant="outline"
                size="lg"
                onClick={() => {
                  setQueryText(sugg.query);
                  fetchSchemes(sugg.query);
                }}
                className="rounded-full px-6 py-3 text-base border-2 hover:border-blue-300 hover:bg-blue-50"
              >
                {sugg.label}
              </Button>
            ))}
          </div>

          {/* Chat History */}
          {messages.length > 0 && (
            <div className="mb-8 space-y-4 max-h-96 overflow-y-auto p-4 bg-white/70 rounded-2xl border border-gray-200">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-4",
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  )}>
                    {msg.role === "assistant" && msg.intentData ? (
                      <div>
                        <p className="mb-2">{msg.content}</p>
                        {msg.followUp && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.followUp.split('?').map((part, i) => part.trim() && (
                              <Button
                                key={i}
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickReply(part + "?")}
                                className="text-xs bg-purple-50 hover:bg-purple-100"
                              >
                                {part}?
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
              <div className="relative flex gap-3 p-1 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                <div className="flex-1 flex items-center pl-5">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    className="flex-1 py-4 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder={t('voice.type_placeholder')}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={!queryText.trim() || isLoading} className="rounded-xl px-8 py-4 m-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  {isLoading ? t('voice.searching_btn') : <Zap className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </form>

          {/* Database Scheme Cards */}
          {matchedSchemes.length > 0 && (
            <>
              <p className="text-center text-lg font-medium text-gray-700 mb-4">
                {t('schemes.found', { count: matchedSchemes.length })}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {matchedSchemes.map((s, index) => {
                  const schemeId = s._id?.$oid || s._id || s.id || `scheme-${index}`;
                  return (
                    <Link
                      key={schemeId}
                      to={`/eligibility/${schemeId}?lang=${language}`}
                      className="block p-6 bg-white rounded-xl border hover:shadow-lg transition"
                    >
                      <h3 className="font-bold text-lg mb-2">{s.name || s.name_en}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{s.description || s.description_en}</p>
                      <span className="text-blue-600 font-medium flex items-center gap-1">
                        {t('schemes.check_eligibility')} <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Gemini Suggested Schemes (if any) */}
          {geminiResponse?.intentData?.suggested_schemes?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">{t('voice.suggested')}</h3>
              <div className="space-y-3">
                {geminiResponse.intentData.suggested_schemes.map((scheme, idx) => (
                  <Link
                    key={idx}
                    to={`/eligibility/${encodeURIComponent(scheme.name)}?lang=${language}`}
                    className="block p-4 bg-white rounded-xl border hover:shadow-lg transition"
                  >
                    <h4 className="font-semibold text-gray-800">{scheme.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{scheme.reason}</p>
                    <span className="text-blue-600 text-sm font-medium flex items-center gap-1 mt-2">
                      {t('schemes.view_details')} <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Gemini Card (optional) – you can keep or remove */}
          {geminiResponse && !matchedSchemes.length && (
            <div className="mb-8 animate-fadeInUp">
              <div className="glass-card rounded-2xl p-6 border border-purple-100">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" /> {t('voice.detailed_analysis')}
                </h3>
                <p className="text-gray-700 mb-2"><span className="font-semibold">{t('voice.intent')}:</span> {geminiResponse.intentData.intent}</p>
                {geminiResponse.intentData.confidence && (
                  <p className="text-sm text-gray-600">{t('voice.confidence')}: {(geminiResponse.intentData.confidence * 100).toFixed(0)}%</p>
                )}
                {geminiResponse.intentData.missing_fields?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">{t('voice.missing_info')}:</p>
                    <ul className="list-disc pl-5">
                      {geminiResponse.intentData.missing_fields.map((f, i) => (
                        <li key={i} className="text-sm">{f.replace(/_/g, ' ')}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {geminiResponse.intentData.suggested_schemes?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">{t('voice.suggested')}:</p>
                    <ul className="list-disc pl-5">
                      {geminiResponse.intentData.suggested_schemes.map((s, i) => (
                        <li key={i} className="text-sm"><span className="font-medium">{s.name}</span> – {s.reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {geminiResponse.intentData.follow_up_question && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                    <p className="text-purple-800"><span className="font-bold">{t('voice.follow_up')}:</span> {geminiResponse.intentData.follow_up_question}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes blob { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0,0) scale(1); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .glass-card { background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85)); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default VoiceAssistant;