import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, Languages, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MicButton from "@/components/ui/MicButton";
import StatusCard from "@/components/ui/StatusCard";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">Civic Assistant</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-full gap-2">
              <Globe className="h-4 w-4" />
              Language: EN
            </Button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Languages className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 flex flex-col">
        {/* Interface Label */}
        <div className="text-center mb-8">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Civic Voice Interface
          </span>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
          {/* User Message */}
          <div className="text-center mb-8">
            <span className="text-xs font-medium text-warning uppercase tracking-wider">
              You Said
            </span>
            <p className="text-lg italic text-muted-foreground mt-2">
              "I'm looking for student scholarship programs in my district for
              vocational training."
            </p>
          </div>

          {/* Assistant Response */}
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Assistant
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2 text-balance">
              I can help with that. Are you currently enrolled in a
              government-recognized institution, or planning to apply?
            </h2>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-16">
            <StatusCard
              label="Status"
              value="Information incomplete"
              sublabel="Need institution details"
              variant="warning"
            />
            <StatusCard
              label="Confidence"
              value="Medium"
              sublabel="Refining district results"
              variant="warning"
            />
          </div>
        </div>

        {/* Mic Button */}
        <div className="flex flex-col items-center gap-2 pb-8">
          <MicButton
            size="lg"
            label={isListening ? "Listening..." : "Hold to Speak"}
            isListening={isListening}
            onClick={handleMicClick}
          />
        </div>

        {/* Navigation to next page */}
        <div className="flex justify-center pb-4">
          <Link to="/eligibility">
            <Button variant="outline" className="gap-2">
              Continue to Eligibility <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default VoiceAssistant;
