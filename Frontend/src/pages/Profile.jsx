import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Mail, Calendar, User, LogOut, Edit3, Bookmark, 
  FileText, MapPin, Phone, Briefcase, 
  Settings, Shield, Moon, Bell, ChevronRight
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // Dummy user data (later backend will send this)
  const user = {
    firstName: "Esha",
    lastName: "Patil",
    age: 20,
    email: "esha@gmail.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    occupation: "Student",
    joined: "January 2026",
    savedSchemes: 3,
    applications: 1,
    verified: true,
    bio: "Passionate about learning and technology. Looking for opportunities in web development."
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">
        {/* Header with greeting and actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Manage your profile and applications</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 hover:bg-white rounded-full transition-all">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-white rounded-full transition-all">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-cyan-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold">
                    {user.firstName[0]}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.verified && (
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1 max-w-2xl">{user.bio}</p>
              </div>
              <button 
                onClick={handleUpdateProfile}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Edit3 className="h-4 w-4" /> Update Profile
              </button>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-4 w-4 text-cyan-500" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{user.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="h-4 w-4 text-cyan-500" />
                <span className="text-sm">{user.occupation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Age Card */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="text-2xl font-bold text-gray-800">{user.age} years</p>
              </div>
            </div>
          </div>

          {/* Joined Card */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <User className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-2xl font-bold text-gray-800">{user.joined}</p>
              </div>
            </div>
          </div>

          {/* Saved Schemes Card */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Bookmark className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Saved Schemes</p>
                <p className="text-2xl font-bold text-gray-800">{user.savedSchemes}</p>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-2xl font-bold text-gray-800">{user.applications}</p>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+1 this month</p>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-600 flex items-center gap-2 transition-all">
              <Bookmark className="h-4 w-4 text-purple-600" /> View Saved Schemes
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
            <button className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-600 flex items-center gap-2 transition-all">
              <FileText className="h-4 w-4 text-cyan-600" /> Track Applications
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
            <button className="text-left px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-600 flex items-center gap-2 transition-all">
              <Settings className="h-4 w-4 text-gray-600" /> Account Settings
              <ChevronRight className="h-4 w-4 ml-auto" />
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-xl p-6 shadow-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-800">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch to dark theme</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl hover:bg-red-100 transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .bg-white {
          animation: fadeIn 0.5s ease-out;
        }
        
        .hover\\:shadow-lg:hover {
          transform: translateY(-2px);
        }
        
        button {
          cursor: pointer;
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Profile;