import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Globe, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-gray-800">Civic Assistant</span>
          </Link>

          {/* Language Dropdown */}
          <div className="relative">
            <Button
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowLangDropdown((prev) => !prev)}
            >
              <Globe className="h-4 w-4" /> {languageConfig[language].label}{" "}
              <ArrowDown className="h-3 w-3" />
            </Button>
            {showLangDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border rounded shadow z-10">
                {Object.entries(languageConfig).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => handleLanguageSelect(key)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      language === key ? "font-semibold" : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto py-8 flex flex-col items-center px-4">
        {/* Text Input */}
        <form onSubmit={handleTextSubmit} className="flex gap-2 mb-4 w-full max-w-xl">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Type your query..."
            className="border rounded px-3 py-2 flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        {/* Spoken/Assistant Text */}
        {spokenText && (
          <p className="mb-2 italic text-gray-600">You said/typed: "{spokenText}"</p>
        )}
        {assistantText && (
          <h2 className="mb-4 font-semibold text-gray-800">{assistantText}</h2>
        )}

        {/* Scheme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
          {matchedSchemes.map((s) => (
            <Link
              key={s._id}
              to={`/eligibility/${s._id}`}
              className="border p-4 rounded shadow bg-white hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg text-gray-800">
                {language === "en" ? s.name_en : language === "hi" ? s.name_hi : s.name_mr}
              </h3>
              <p className="text-gray-600 mt-1">
                {language === "en"
                  ? s.description_en
                  : language === "hi"
                  ? s.description_hi
                  : s.description_mr}
              </p>
              <p className="font-medium mt-2">
                Benefits:{" "}
                {language === "en"
                  ? s.benefits_en
                  : language === "hi"
                  ? s.benefits_hi
                  : s.benefits_mr}
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Documents: {s.documentsRequired.join(", ")}
              </p>
            </Link>
          ))}
        </div>

        {/* Mic Button */}
        <div className="flex flex-col items-center mt-6">
          <MicButton
            size="lg"
            label={isListening ? "Listening..." : "Tap to Speak"}
            isListening={isListening}
            onClick={handleMicClick}
          />
        </div>
      </main>
    </div>
  );
};

export default VoiceAssistant;
