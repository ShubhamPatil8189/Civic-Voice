import { Link } from "react-router-dom";
import { Volume2, Pause, FileText, CheckCircle2, AlertTriangle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import housingSchemeImage from "@/assets/housing-scheme.jpg";

const Summary = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">CVI</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/summary"
              className="text-sm font-medium text-primary"
            >
              My Summaries
            </Link>
            <Link
              to="/schemes"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Schemes
            </Link>
          </nav>

          <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 text-sm font-medium">U</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Civic Action Summary</h1>
          <p className="text-muted-foreground">
            A high-level overview of our conversation and your next steps.
          </p>
        </div>

        {/* Audio Controls */}
        <div className="flex gap-3 mb-8">
          <Button className="rounded-full gap-2">
            <Volume2 className="h-4 w-4" />
            Hear Summary
          </Button>
          <Button variant="outline" className="rounded-full gap-2">
            <Pause className="h-4 w-4" />
            Continue Later
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-xl">
          <div className="card-elevated p-5">
            <p className="text-sm text-muted-foreground mb-1">
              Eligibility Confidence
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">95%</span>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="card-elevated p-5">
            <p className="text-sm text-muted-foreground mb-1">
              Application Readiness
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">80%</span>
              <div className="flex-1 progress-bar ml-2">
                <div className="progress-bar-fill" style={{ width: "80%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scheme Recommendation */}
        <div className="card-elevated p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={housingSchemeImage}
              alt="Housing Support Scheme"
              className="w-full md:w-40 h-28 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  Top Recommendation
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Suggested Scheme: Low Income Housing Support
              </h2>
              <p className="text-muted-foreground text-sm mb-3">
                Based on our conversation, you qualify for this regional housing
                and utility assistance program.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary">
                  High Confidence Match: Based on household income and zip code.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Missing Information Reminder */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h2 className="font-semibold text-lg">Missing Information Reminder</h2>
          </div>
          <div className="space-y-3">
            <div className="info-card-warning flex items-start gap-3">
              <FileText className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h3 className="font-medium">Proof of Address</h3>
                <p className="text-sm text-warning-foreground">
                  Please have a recent utility bill or bank statement ready for
                  the next step.
                </p>
              </div>
            </div>
            <div className="card-elevated p-4 flex items-start gap-3 border-l-4 border-l-success">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h3 className="font-medium">Next Step: Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Say "Start Verification" when you are ready to upload or
                  dictate your details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Listening State */}
        <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center bg-primary/5">
          <div className="mic-button mb-4">
            <Mic className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            Listening for "Help me finish"
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Civic Voice Interface (CVI) • Accessible Government Services
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Summary;
