import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar,
  Save, ArrowLeft, Camera, X, Check, AlertCircle
} from "lucide-react";

const UpdateProfile = () => {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "Esha",
    lastName: "Patil",
    email: "esha@gmail.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    occupation: "Student",
    age: 20,
    bio: "Passionate about learning and technology. Looking for opportunities in web development.",
    profilePicture: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app, you'd upload this file
      setFormData(prev => ({
        ...prev,
        profilePicture: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.age || formData.age < 1) {
      newErrors.age = "Valid age is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/profile");
      }, 3000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleCancel}
            className="p-2 hover:bg-white rounded-full transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Update Profile</h1>
            <p className="text-gray-500 text-sm">Edit your personal information</p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-slideDown">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Profile Updated Successfully!</p>
              <p className="text-sm text-green-600">Redirecting to profile page...</p>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo Section */}
          <div className="h-24 bg-gradient-to-r from-purple-600 to-cyan-500 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                  {formData.profilePicture ? (
                    <img 
                      src={formData.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
                      {formData.firstName[0]}
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                  <Camera className="h-4 w-4 text-white" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="pt-16 pb-8 px-8">
            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" /> First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-600" /> Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-600" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-cyan-600" /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" /> Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.age ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
                {errors.age && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.age}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-600" /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all`}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.location}
                  </p>
                )}
              </div>

              {/* Occupation */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-purple-600" /> Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Enter occupation"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-600" /> Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-sm text-purple-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Your information is secure and will only be used for scheme recommendations.
          </p>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        input, textarea {
          transition: all 0.2s ease;
        }
        
        input:focus, textarea:focus {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default UpdateProfile;