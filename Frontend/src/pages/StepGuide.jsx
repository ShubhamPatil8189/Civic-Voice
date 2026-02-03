import { Link } from "react-router-dom";
import { Building2, FileText, CreditCard, FileCheck, Mic, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepItem from "@/components/ui/StepItem";
import { Button } from "@/components/ui/button";

const StepGuide = () => {
  const steps = [
    {
      number: 1,
      icon: Building2,
      title: "Visit the local Taluka office",
      description:
        "Why this step is needed: Required for initial physical verification of your residence details.",
      estimatedTime: "2 hours",
    },
    {
      number: 2,
      icon: FileText,
      title: "Submit identity proof documents",
      description:
        "Why this step is needed: Needed to validate your residency and citizenship status for the scheme eligibility.",
      estimatedTime: "30 mins",
    },
    {
      number: 3,
      icon: CreditCard,
      title: "Pay the registration fee",
      description:
        "Why this step is needed: Mandatory processing fee to finalize your application in the government portal.",
      estimatedTime: "15 mins",
    },
    {
      number: 4,
      icon: FileCheck,
      title: "Collect your acknowledgment receipt",
      description:
        "Why this step is needed: This is your official proof of submission. Keep it safe for tracking your status.",
      estimatedTime: "5 mins",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="app" />

      <main className="flex-1 container py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">What you should do next</h1>
          <p className="text-muted-foreground">
            Follow these steps to complete your application for the Government
            Housing Scheme.
          </p>
        </div>

        {/* Steps Card */}
        <div className="card-elevated p-8 mb-12 max-w-3xl mx-auto">
          <div className="space-y-0">
            {steps.map((step, index) => (
              <StepItem
                key={step.number}
                number={step.number}
                icon={step.icon}
                title={step.title}
                description={step.description}
                estimatedTime={step.estimatedTime}
                isCompleted={false}
                isActive={index === 0}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link to="/voice-assistant">
            <Button size="lg" className="rounded-full gap-2 px-8">
              <Mic className="h-5 w-5" />
              Explain a step using voice
            </Button>
          </Link>
          <Link to="/summary">
            <Button size="lg" variant="outline" className="rounded-full gap-2 px-8">
              View Summary <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Click and speak to get detailed help about any step above
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default StepGuide;
