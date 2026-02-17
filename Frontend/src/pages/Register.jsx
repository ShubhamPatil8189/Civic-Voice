import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  User, Mail, Lock, Calendar, Phone, MapPin, Briefcase, 
  Heart, Users, GraduationCap, Target, Activity, Home,
  AlertCircle, Check, ArrowRight, Award,
  Baby, Users2, DollarSign, Landmark, Building2, BookOpen,
  Loader
} from "lucide-react";
import { authAPI } from "@/services/api";

const Register = () => {
  const [form, setForm] = useState({
    // Basic Personal Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    maritalStatus: "",
    numberOfChildren: "",
    childrenAges: "",
    
    // Family Details
    parentsAlive: "",
    spouseAlive: "",
    numberOfDependents: "",
    
    // Education & Career
    educationLevel: "",
    currentlyStudying: "",
    occupation: "",
    annualIncome: "",
    
    // Life Goals
    planToBuyLand: "",
    landPurchaseTiming: "",
    planToStartBusiness: "",
    businessTiming: "",
    wantToStudyFurther: "",
    studyTiming: "",
    planMarriage: "",
    marriageTiming: "",
    
    // Disability Status
    hasDisability: "",
    disabilityType: "",
    
    // Residence
    state: "",
    district: "",
    ruralUrban: "",
    ownHouse: "",
    
    // Contact Info (IMPORTANT - these will be used for login)
    email: "",
    password: "",
    phone: "",
    location: ""
  });

  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  const sections = [
    { id: 1, name: "Basic Info", icon: User },
    { id: 2, name: "Family", icon: Users },
    { id: 3, name: "Education", icon: GraduationCap },
    { id: 4, name: "Life Goals", icon: Target },
    { id: 5, name: "Disability", icon: Activity },
    { id: 6, name: "Residence", icon: Home },
    { id: 7, name: "Contact", icon: Mail }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Auto-calculate age from DOB
    if (name === "dateOfBirth" && value) {
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      setForm(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const nextSection = () => {
    setCurrentSection(prev => Math.min(prev + 1, 7));
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields for login
      if (!form.firstName || !form.lastName || !form.email || !form.password) {
        setError("First Name, Last Name, Email and Password are required");
        setLoading(false);
        return;
      }

      console.log("Sending registration data:", form);
      
      // Send ALL form data to backend
      const response = await authAPI.register(form);
      
      console.log('Registration response:', response.data);

      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.message || "Registration failed");
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch(currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Basic Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name *</label>
                <div className="inputBox">
                  <User className="icon" />
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name *</label>
                <div className="inputBox">
                  <User className="icon" />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Enter last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                <div className="inputBox">
                  <Calendar className="icon" />
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <div className="inputBox bg-gray-50">
                  <Calendar className="icon text-gray-400" />
                  <input
                    name="age"
                    type="text"
                    value={form.age}
                    readOnly
                    placeholder="Auto-calculated"
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Gender</label>
                <div className="inputBox">
                  <User className="icon" />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Marital Status</label>
                <div className="inputBox">
                  <Heart className="icon" />
                  <select
                    name="maritalStatus"
                    value={form.maritalStatus}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Number of Children</label>
                <div className="inputBox">
                  <Baby className="icon" />
                  <input
                    name="numberOfChildren"
                    type="number"
                    min="0"
                    placeholder="Enter number"
                    value={form.numberOfChildren}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Children's Ages</label>
                <div className="inputBox">
                  <Users2 className="icon" />
                  <input
                    name="childrenAges"
                    type="text"
                    placeholder="e.g., 5, 7, 10"
                    value={form.childrenAges}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Family Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Parents Alive?</label>
                <div className="inputBox">
                  <Users className="icon" />
                  <select
                    name="parentsAlive"
                    value={form.parentsAlive}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="both">Both Alive</option>
                    <option value="mother">Mother Only</option>
                    <option value="father">Father Only</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Spouse Alive?</label>
                <div className="inputBox">
                  <Heart className="icon" />
                  <select
                    name="spouseAlive"
                    value={form.spouseAlive}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="not_applicable">Not Applicable</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Number of Dependents</label>
                <div className="inputBox">
                  <Users className="icon" />
                  <input
                    name="numberOfDependents"
                    type="number"
                    min="0"
                    placeholder="Enter number"
                    value={form.numberOfDependents}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              Education & Career
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Education Level</label>
                <div className="inputBox">
                  <GraduationCap className="icon" />
                  <select
                    name="educationLevel"
                    value={form.educationLevel}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Education</option>
                    <option value="no_formal">No Formal Education</option>
                    <option value="primary">Primary School</option>
                    <option value="secondary">Secondary School</option>
                    <option value="higher_secondary">Higher Secondary</option>
                    <option value="graduate">Graduate</option>
                    <option value="post_graduate">Post Graduate</option>
                    <option value="diploma">Diploma</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Currently Studying?</label>
                <div className="inputBox">
                  <BookOpen className="icon" />
                  <select
                    name="currentlyStudying"
                    value={form.currentlyStudying}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="yes_full">Yes (Full Time)</option>
                    <option value="yes_part">Yes (Part Time)</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Occupation</label>
                <div className="inputBox">
                  <Briefcase className="icon" />
                  <input
                    name="occupation"
                    type="text"
                    placeholder="e.g., Farmer, Teacher, Student"
                    value={form.occupation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Annual Income (₹)</label>
                <div className="inputBox">
                  <DollarSign className="icon" />
                  <input
                    name="annualIncome"
                    type="number"
                    placeholder="Enter annual income"
                    value={form.annualIncome}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Life Goals
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Plan to buy land?</label>
                <div className="inputBox">
                  <Landmark className="icon" />
                  <select
                    name="planToBuyLand"
                    value={form.planToBuyLand}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="maybe">Maybe in future</option>
                  </select>
                </div>
              </div>

              {form.planToBuyLand === "yes" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Expected time to buy land?</label>
                  <div className="inputBox">
                    <Calendar className="icon" />
                    <select
                      name="landPurchaseTiming"
                      value={form.landPurchaseTiming}
                      onChange={handleChange}
                      className="w-full bg-transparent"
                    >
                      <option value="">Select Timeline</option>
                      <option value="1">Within 1 year</option>
                      <option value="2">Within 2 years</option>
                      <option value="3">Within 3 years</option>
                      <option value="5">Within 5 years</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Plan to start business?</label>
                <div className="inputBox">
                  <Briefcase className="icon" />
                  <select
                    name="planToStartBusiness"
                    value={form.planToStartBusiness}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="maybe">Maybe in future</option>
                  </select>
                </div>
              </div>

              {form.planToStartBusiness === "yes" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">When do you plan to start?</label>
                  <div className="inputBox">
                    <Calendar className="icon" />
                    <select
                      name="businessTiming"
                      value={form.businessTiming}
                      onChange={handleChange}
                      className="w-full bg-transparent"
                    >
                      <option value="">Select Timeline</option>
                      <option value="6">Within 6 months</option>
                      <option value="12">Within 1 year</option>
                      <option value="24">Within 2 years</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Want to study further?</label>
                <div className="inputBox">
                  <GraduationCap className="icon" />
                  <select
                    name="wantToStudyFurther"
                    value={form.wantToStudyFurther}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="maybe">Maybe</option>
                  </select>
                </div>
              </div>

              {form.wantToStudyFurther === "yes" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">When do you plan to study?</label>
                  <div className="inputBox">
                    <Calendar className="icon" />
                    <select
                      name="studyTiming"
                      value={form.studyTiming}
                      onChange={handleChange}
                      className="w-full bg-transparent"
                    >
                      <option value="">Select Timeline</option>
                      <option value="12">Within 1 year</option>
                      <option value="24">Within 2 years</option>
                      <option value="36">Within 3 years</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Plan marriage?</label>
                <div className="inputBox">
                  <Heart className="icon" />
                  <select
                    name="planMarriage"
                    value={form.planMarriage}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="maybe">Maybe</option>
                  </select>
                </div>
              </div>

              {form.planMarriage === "yes" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Expected time?</label>
                  <div className="inputBox">
                    <Calendar className="icon" />
                    <select
                      name="marriageTiming"
                      value={form.marriageTiming}
                      onChange={handleChange}
                      className="w-full bg-transparent"
                    >
                      <option value="">Select Timeline</option>
                      <option value="6">Within 6 months</option>
                      <option value="12">Within 1 year</option>
                      <option value="24">Within 2 years</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              Disability Status
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Any disability?</label>
                <div className="inputBox">
                  <Activity className="icon" />
                  <select
                    name="hasDisability"
                    value={form.hasDisability}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              {form.hasDisability === "yes" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type of disability</label>
                  <div className="inputBox">
                    <Activity className="icon" />
                    <select
                      name="disabilityType"
                      value={form.disabilityType}
                      onChange={handleChange}
                      className="w-full bg-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="blind">Blind/Low Vision</option>
                      <option value="deaf">Deaf/Hard of Hearing</option>
                      <option value="orthopedic">Orthopedic</option>
                      <option value="intellectual">Intellectual Disability</option>
                      <option value="multiple">Multiple Disabilities</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-600" />
              Residence Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">State *</label>
                <div className="inputBox">
                  <MapPin className="icon" />
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent"
                  >
                    <option value="">Select State</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="delhi">Delhi</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="tamilnadu">Tamil Nadu</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="up">Uttar Pradesh</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">District *</label>
                <div className="inputBox">
                  <MapPin className="icon" />
                  <input
                    name="district"
                    type="text"
                    placeholder="Enter district"
                    value={form.district}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Area Type *</label>
                <div className="inputBox">
                  <Building2 className="icon" />
                  <select
                    name="ruralUrban"
                    value={form.ruralUrban}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Area Type</option>
                    <option value="rural">Rural</option>
                    <option value="urban">Urban</option>
                    <option value="semi_urban">Semi-Urban</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Do you own a house?</label>
                <div className="inputBox">
                  <Home className="icon" />
                  <select
                    name="ownHouse"
                    value={form.ownHouse}
                    onChange={handleChange}
                    className="w-full bg-transparent"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes (Own House)</option>
                    <option value="no">No (Rented)</option>
                    <option value="parental">Living in Parental House</option>
                    <option value="homeless">Homeless</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              Contact Information (For Login)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email - IMPORTANT for login */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <div className="inputBox">
                  <Mail className="icon" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">This will be used for login</p>
              </div>

              {/* Password - IMPORTANT for login */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password *</label>
                <div className="inputBox">
                  <Lock className="icon" />
                  <input
                    name="password"
                    type="password"
                    placeholder="Create password (min. 6 characters)"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
                <p className="text-xs text-gray-500">This will be used for login</p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="inputBox">
                  <Phone className="icon" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Location</label>
                <div className="inputBox">
                  <MapPin className="icon" />
                  <input
                    name="location"
                    type="text"
                    placeholder="Enter city/location"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mt-4">
              <p className="text-sm text-purple-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Remember: Use your email and password to login later
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Header />

      <div className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Progress Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Your Complete Profile</h1>
          <p className="text-gray-500 mt-2">Help us understand you better for personalized scheme recommendations</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`flex flex-col items-center ${
                  section.id === currentSection ? 'text-purple-600' : 'text-gray-400'
                }`}
              >
                <button
                  onClick={() => setCurrentSection(section.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    section.id === currentSection
                      ? 'bg-purple-600 text-white shadow-lg scale-110'
                      : section.id < currentSection
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {section.id < currentSection ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <section.icon className="h-5 w-5" />
                  )}
                </button>
                <span className="text-xs font-medium hidden md:block">{section.name}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full">
              <div 
                className="h-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentSection / 7) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <Check className="h-5 w-5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderSection()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {currentSection > 1 && (
                <button
                  type="button"
                  onClick={prevSection}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Previous
                </button>
              )}
              
              {currentSection < 7 ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 ml-auto"
                >
                  Next Section
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 ml-auto disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-purple-600 font-semibold ml-2 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <Footer />

      <style>{`
        .inputBox {
          display: flex;
          align-items: center;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px 12px;
          transition: 0.25s;
          background: #fff;
        }

        .inputBox:focus-within {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
        }

        .inputBox input, .inputBox select {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          background: transparent;
        }

        .icon {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          color: #6b7280;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .bg-white {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;