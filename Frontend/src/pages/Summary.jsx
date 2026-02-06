import { Link } from "react-router-dom";
import { 
  Clock, FileText, CheckCircle2, AlertCircle, Mic, ArrowRight,
  Home, Users, TrendingUp, Calendar, MapPin, User, Phone, Mail,
  Download, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Summary = () => {
  // Mock user data
  const userData = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91-9876543210",
    location: "Pune, Maharashtra",
    registrationDate: "15 Jan 2026",
    registrationNumber: "REG2026001542"
  };

  // Mock applied schemes data
  const appliedSchemes = [
    {
      id: 1,
      schemeName: "Pradhan Mantri Housing Scheme",
      schemeType: "Housing",
      applicationDate: "10 Feb 2026",
      status: "Under Review",
      statusColor: "bg-blue-100 text-blue-700",
      progress: 65,
      documents: "5/7 Uploaded",
      expectedDate: "25 Feb 2026",
      image: "https://images.unsplash.com/photo-1552684052-8abdad00b532?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      schemeName: "Education Assistance Program",
      schemeType: "Education",
      applicationDate: "08 Feb 2026",
      status: "Approved",
      statusColor: "bg-green-100 text-green-700",
      progress: 100,
      documents: "7/7 Uploaded",
      expectedDate: "Approved",
      image: "https://images.unsplash.com/photo-1427504494785-cdafadc3dba1?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      schemeName: "Healthcare Subsidy Scheme",
      schemeType: "Healthcare",
      applicationDate: "05 Feb 2026",
      status: "Pending Documents",
      statusColor: "bg-yellow-100 text-yellow-700",
      progress: 40,
      documents: "3/7 Uploaded",
      expectedDate: "20 Feb 2026",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      schemeName: "Skill Development Initiative",
      schemeType: "Employment",
      applicationDate: "01 Feb 2026",
      status: "In Progress",
      statusColor: "bg-purple-100 text-purple-700",
      progress: 50,
      documents: "4/7 Uploaded",
      expectedDate: "28 Feb 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    },
  ];

  const stats = [
    { label: "Total Applications", value: "4", icon: FileText, color: "from-blue-500 to-blue-600" },
    { label: "Approved", value: "1", icon: CheckCircle2, color: "from-green-500 to-green-600" },
    { label: "Under Review", value: "2", icon: Clock, color: "from-orange-500 to-orange-600" },
    { label: "Pending", value: "1", icon: AlertCircle, color: "from-red-500 to-red-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header variant="app" />

      <main className="flex-1 container px-4 py-12 md:py-16">
        {/* Welcome Section */}
        <div className="mb-12 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-blue-100 text-sm mb-2">Welcome Back</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{userData.name}</h1>
                <p className="text-blue-100">Registration ID: {userData.registrationNumber}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-100 text-xs mb-1">Email</p>
                <p className="text-white font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Phone</p>
                <p className="text-white font-medium">{userData.phone}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Location</p>
                <p className="text-white font-medium">{userData.location}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Member Since</p>
                <p className="text-white font-medium">{userData.registrationDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Your Application Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Applied Schemes Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Your Applied Schemes</h2>
              <p className="text-gray-600 mt-1">Track your applications and monitor progress</p>
            </div>
            <Button className="gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Mic className="h-4 w-4" />
              Ask About Status
            </Button>
          </div>

          <div className="space-y-6">
            {appliedSchemes.map((scheme) => (
              <Card key={scheme.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Scheme Image */}
                  <div className="md:w-1/4 h-56 md:h-auto overflow-hidden bg-gray-200">
                    <img
                      src={scheme.image}
                      alt={scheme.schemeName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Scheme Details */}
                  <div className="flex-1 p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{scheme.schemeName}</h3>
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                            {scheme.schemeType}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied: {scheme.applicationDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {scheme.documents}
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${scheme.statusColor}`}>
                        {scheme.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">Application Progress</p>
                        <p className="text-sm font-bold text-blue-600">{scheme.progress}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scheme.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Expected Date & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Expected Decision Date</p>
                        <p className="font-semibold text-gray-900">{scheme.expectedDate}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="rounded-lg gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button size="sm" className="rounded-lg gap-2 bg-blue-600 hover:bg-blue-700">
                          <Download className="h-4 w-4" />
                          Download Docs
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="mt-12 max-w-6xl mx-auto bg-green-50 rounded-2xl p-8 border-l-4 border-green-500">
          <div className="flex gap-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Upload Missing Documents</p>
                    <p className="text-sm text-gray-600">Complete Healthcare Subsidy Scheme documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">View Approval Letter</p>
                    <p className="text-sm text-gray-600">Download your Education Assistance approval</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Schedule Verification</p>
                    <p className="text-sm text-gray-600">Book appointment for Housing Scheme verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Explore More Schemes</p>
                    <p className="text-sm text-gray-600">Browse other government schemes you may qualify for</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Summary;
