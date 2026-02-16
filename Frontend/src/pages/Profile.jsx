import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { authAPI } from "@/services/api";

import {
  Mail, Calendar, User, LogOut, Edit3, 
  FileText, MapPin, Phone, Briefcase, Settings, Shield,
  Moon, Bell, DollarSign, Home, CheckSquare
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.getCurrentUser();
        setUser(res.data.user);
      } catch (error) {
        console.log("User not logged in");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Logout
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/login");
    } catch (err) {
      console.log("Logout error");
    }
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full">

        {/* Welcome */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Manage your profile and applications</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 hover:bg-white rounded-full transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-white rounded-full transition-colors">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-purple-600 to-cyan-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-28 h-28 rounded-2xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user.firstName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.firstName} {user.lastName}
                  </h2>
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Verified
                  </span>
                </div>
                <p className="text-gray-500 mt-1 max-w-2xl">
                  {user.bio || "No bio added yet."}
                </p>
              </div>
              <button
                onClick={handleUpdateProfile}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" /> Update Profile
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {/* Basic Info */}
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-cyan-500" />
                <span className="text-sm">{user.phone || "Not provided"}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{user.location || "Not provided"}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="h-4 w-4 text-cyan-500" />
                <span className="text-sm">{user.occupation || "Not provided"}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Age: {user.age || "Not provided"}</span>
              </div>

              {/* Eligibility Fields */}
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-semibold">BPL Card:</span> {user.bplCardHolder ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-semibold">Car Owner:</span> {user.carOwner ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-semibold">Disability:</span> {user.disability ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-semibold">Student:</span> {user.student ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-semibold">Veteran:</span> {user.veteran ? "Yes" : "No"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Home className="h-4 w-4 text-purple-500" />
                <span className="text-sm">
                  <span className="font-semibold">Household:</span> {user.householdType || "Not provided"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-semibold">Income:</span> {user.income ? `₹${user.income.toLocaleString()}` : "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
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
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Profile;