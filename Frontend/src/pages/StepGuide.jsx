import { Link } from "react-router-dom";
import { Building2, FileText, CreditCard, FileCheck, Mic, ArrowRight, CheckCircle, Clock, AlertCircle, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepItem from "@/components/ui/StepItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const StepGuide = () => {
  const steps = [
    {
      number: 1,
      icon: Building2,
      title: "Check Eligibility Criteria",
      description:
        "Verify that you meet all the basic eligibility requirements including age, income, residency, and other scheme-specific criteria.",
      estimatedTime: "20 mins",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    },
    {
      number: 2,
      icon: FileText,
      title: "Gather Required Documents",
      description:
        "Collect all necessary documents: Aadhar, PAN, address proof, income certificate, caste certificate, and bank account details.",
      estimatedTime: "1-2 hours",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    },
    {
      number: 3,
      icon: Users,
      title: "Register Online or Offline",
      description:
        "Submit your application through the official government portal or visit your nearest Taluka/Block office for offline registration.",
      estimatedTime: "30-45 mins",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    },
    {
      number: 4,
      icon: FileCheck,
      title: "Application Verification",
      description:
        "Your documents will be verified by government officials. You may be contacted for additional information or verification visits.",
      estimatedTime: "7-14 days",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    },
    {
      number: 5,
      icon: CreditCard,
      title: "Pay Processing Fee (if applicable)",
      description:
        "Pay any mandatory processing fee through online banking, debit card, or at the government office. Keep the receipt for your records.",
      estimatedTime: "15 mins",
      image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop",
    },
    {
      number: 6,
      icon: CheckCircle,
      title: "Receive Confirmation & Track Status",
      description:
        "You'll receive an acknowledgment receipt and registration number. Use this to track your application status online anytime.",
      estimatedTime: "Immediate",
      image: "https://theunitedindian.com/images/govt-schemes-18-07-24-E-hero.webp",
    },
  ];

  const timeline = [
    { phase: "Preparation", duration: "2-3 days", status: "pending" },
    { phase: "Application", duration: "1-2 days", status: "pending" },
    { phase: "Verification", duration: "7-14 days", status: "pending" },
    { phase: "Approval", duration: "3-7 days", status: "pending" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="app" />

      <main className="flex-1 container px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            Government Scheme Process
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Your Step-by-Step Guide
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Follow these essential steps to successfully apply for the government scheme. Each step is carefully designed to ensure smooth processing and timely approval of your application.
          </p>
        </div>

        {/* Timeline Overview */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Expected Timeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeline.map((item, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold mx-auto mb-3">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.phase}</h3>
                <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  {item.duration}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Steps Card */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Detailed Steps</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={step.number} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Step Image */}
                  {step.image && (
                    <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-gray-200">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Step Content */}
                  <div className="p-8 md:p-10 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl shadow-lg">
                          {step.number}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <step.icon className="h-6 w-6 text-blue-600" />
                          <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4" />
                          Estimated time: {step.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="mb-16 max-w-5xl mx-auto bg-blue-50 rounded-xl p-8 border-l-4 border-blue-500">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Important Things to Remember</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Keep all original documents safe and maintain copies for your records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Save your registration number and acknowledgment receipt carefully</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Don't miss any deadlines mentioned in your confirmation letter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Contact the helpline if you face any issues during the process</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 max-w-2xl mx-auto">
          <Link to="/voice-assistant" className="flex-1">
            <Button size="lg" className="rounded-xl gap-2 px-8 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Mic className="h-5 w-5" />
              Ask via Voice Assistant
            </Button>
          </Link>
          <Link to="/summary" className="flex-1">
            <Button size="lg" variant="outline" className="rounded-xl gap-2 px-8 w-full border-2">
              View Complete Summary <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-600 text-center mb-8">
          Need help? Use voice assistant to understand any step in detail
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default StepGuide;
