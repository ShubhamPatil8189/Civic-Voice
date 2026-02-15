import { Link } from "react-router-dom";
import { Building2, FileText, CreditCard, FileCheck, Mic, ArrowRight, CheckCircle, Clock, AlertCircle, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepItem from "@/components/ui/StepItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useTranslation } from "react-i18next";

const StepGuide = () => {
  const { t } = useTranslation();

  const steps = t('step_guide_page.steps', { returnObjects: true });

  // We need to map icons and images back to the translated steps
  const stepsWithIcons = steps.map((step, index) => {
    const originalSteps = [
      {
        icon: Building2,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
        estimatedTime: "20 mins",
      },
      {
        icon: FileText,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
        estimatedTime: "1-2 hours",
      },
      {
        icon: Users,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
        estimatedTime: "30-45 mins",
      },
      {
        icon: FileCheck,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        estimatedTime: "7-14 days",
      },
      {
        icon: CreditCard,
        image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop",
        estimatedTime: "15 mins",
      },
      {
        icon: CheckCircle,
        image: "https://theunitedindian.com/images/govt-schemes-18-07-24-E-hero.webp",
        estimatedTime: "Immediate",
      },
    ];
    return { ...step, ...originalSteps[index], number: index + 1 };
  });

  const timeline = [
    { phase: t('step_guide_page.timeline.phases.prep'), duration: "2-3 days", status: "pending" },
    { phase: t('step_guide_page.timeline.phases.app'), duration: "1-2 days", status: "pending" },
    { phase: t('step_guide_page.timeline.phases.verify'), duration: "7-14 days", status: "pending" },
    { phase: t('step_guide_page.timeline.phases.approval'), duration: "3-7 days", status: "pending" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="app" />

      <main className="flex-1 container px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {t('step_guide_page.label')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t('step_guide_page.title')}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {t('step_guide_page.description')}
          </p>
        </div>

        {/* Timeline Overview */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">{t('step_guide_page.timeline.title')}</h2>
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
          <h2 className="text-2xl font-bold mb-8 text-center">{t('step_guide_page.steps_title')}</h2>
          <div className="space-y-8">
            {stepsWithIcons.map((step) => (
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
                        <p className="text-gray-600 mb-4 leading-relaxed">{step.desc || step.description}</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-50 w-fit px-3 py-1 rounded-full">
                          <Clock className="h-4 w-4" />
                          {t('step_guide_page.estimated_time')}: {step.estimatedTime}
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
              <h3 className="font-bold text-lg text-gray-900 mb-3">{t('step_guide_page.important_notes.title')}</h3>
              <ul className="space-y-2 text-gray-700">
                {(t('step_guide_page.important_notes.items', { returnObjects: true }) || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 max-w-2xl mx-auto">
          <Link to="/voice-assistant" className="flex-1">
            <Button size="lg" className="rounded-xl gap-2 px-8 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Mic className="h-5 w-5" />
              {t('step_guide_page.actions.ask_voice')}
            </Button>
          </Link>
          <Link to="/summary" className="flex-1">
            <Button size="lg" variant="outline" className="rounded-xl gap-2 px-8 w-full border-2">
              {t('step_guide_page.actions.view_summary')} <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-600 text-center mb-8">
          {t('step_guide_page.actions.footer_text')}
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default StepGuide;
