import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { authAPI } from "@/services/api";
import { ArrowLeft, Save, XCircle } from "lucide-react";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    occupation: "",
    age: "",
    bio: "",
    bplCardHolder: false,
    carOwner: false,
    disability: false,
    student: false,
    veteran: false,
    householdType: "Urban",
    income: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.getCurrentUser();
        if (res.data.success) {
          const u = res.data.user;
          setFormData({
            firstName: u.firstName || "",
            lastName: u.lastName || "",
            email: u.email || "",
            phone: u.phone || "",
            location: u.location || "",
            occupation: u.occupation || "",
            age: u.age || "",
            bio: u.bio || "",
            bplCardHolder: u.bplCardHolder || false,
            carOwner: u.carOwner || false,
            disability: u.disability || false,
            student: u.student || false,
            veteran: u.veteran || false,
            householdType: u.householdType || "Urban",
            income: u.income || 0,
          });
        }
      } catch (err) {
        console.log("User not logged in");
        setError("Please login to update profile");
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle number input change
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await authAPI.updateProfile(formData);
      if (res.data.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto bg-white mt-10 p-8 rounded-xl shadow-lg mb-10">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
        </div>
        
        {/* Messages */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <Save className="h-5 w-5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="Enter first name" 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Enter last name" 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  name="email" 
                  value={formData.email} 
                  disabled 
                  className="w-full border p-3 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Enter phone number" 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input 
                  name="age" 
                  type="number"
                  value={formData.age} 
                  onChange={handleNumberChange} 
                  placeholder="Enter age" 
                  min="1"
                  max="120"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="Enter city/district" 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input 
                  name="occupation" 
                  value={formData.occupation} 
                  onChange={handleChange} 
                  placeholder="Enter occupation" 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  placeholder="Tell us about yourself..." 
                  rows="3"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Information Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Eligibility Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    name="bplCardHolder" 
                    checked={formData.bplCardHolder} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-gray-700 font-medium">BPL Card Holder</span>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    name="carOwner" 
                    checked={formData.carOwner} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-gray-700 font-medium">Car Owner</span>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    name="disability" 
                    checked={formData.disability} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-gray-700 font-medium">Disability</span>
                </label>
              </div>

              {/* Right Column - Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    name="student" 
                    checked={formData.student} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-gray-700 font-medium">Student</span>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    name="veteran" 
                    checked={formData.veteran} 
                    onChange={handleChange} 
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="text-gray-700 font-medium">Veteran</span>
                </label>
              </div>
            </div>

            {/* Household Type and Income */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Household Type</label>
                <select 
                  name="householdType" 
                  value={formData.householdType} 
                  onChange={handleChange} 
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
                <input 
                  type="number" 
                  name="income" 
                  value={formData.income} 
                  onChange={handleNumberChange} 
                  placeholder="Enter annual income" 
                  min="0"
                  step="1000"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateProfile;