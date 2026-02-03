import { Link } from "react-router-dom";
import { ChevronRight, BarChart3, AlertTriangle, Mic, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import farmSchemeImage from "@/assets/farm-scheme.jpg";

const Eligibility = () => {
  const identifiedInfo = [
    { metric: "Occupation", value: "Small-scale Farmer" },
    { metric: "Land Size", value: "3.5 Acres" },
    { metric: "Location", value: "Rural District" },
  ];

  const missingInfo = ["Annual income range", "Number of dependents"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="app" />

      <main className="flex-1 container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Eligibility Details</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Why this applies to you</h1>
          <p className="text-muted-foreground">
            Based on our conversation, here is how you qualify for this scheme.
          </p>
        </div>

        {/* Scheme Card */}
        <div className="mb-10">
          <h2 className="font-semibold text-lg mb-4">Possible Eligible Scheme</h2>
          <div className="card-elevated p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={farmSchemeImage}
                alt="Farm Support Scheme"
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  Small-Scale Farmer Support Grant
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-success">
                    Confidence: High Match
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Because you mentioned you are a small-scale farmer with less
                  than 5 acres of land and reside in a rural district. Your
                  current crop cycle also aligns with the emergency relief
                  criteria.
                </p>
                <Button size="sm">View Full Details</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Identified Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Identified Information</h2>
            </div>
            <div className="card-elevated overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                      Metric
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {identifiedInfo.map((item, index) => (
                    <tr
                      key={item.metric}
                      className={index !== identifiedInfo.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="p-4 text-sm">{item.metric}</td>
                      <td className="p-4 text-right">
                        <span className="status-badge status-badge-primary">
                          {item.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Missing Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="font-semibold text-lg">Missing Information</h2>
            </div>
            <div className="info-card-warning">
              <p className="text-sm text-warning-foreground mb-3">
                To finalize your eligibility for the extra diesel subsidy, we
                need the following details:
              </p>
              <ul className="space-y-2">
                {missingInfo.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-warning"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/voice-assistant">
            <Button size="lg" className="rounded-full gap-2 px-8">
              <Mic className="h-5 w-5" />
              Continue by voice
            </Button>
          </Link>
          <Link to="/steps">
            <Button size="lg" variant="outline" className="rounded-full gap-2 px-8">
              View Next Steps <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Eligibility;
