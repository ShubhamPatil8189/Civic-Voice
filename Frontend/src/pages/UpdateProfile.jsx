import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  User, Mail, Phone, MapPin, Calendar, Heart, Briefcase,
  GraduationCap, Users, Target, Activity, Home, Baby, Users2,
  Save, AlertCircle, Check, X, Camera, Shield, Sparkles,
  ArrowLeft, Loader, BookOpen, DollarSign, Landmark, Building2,
  Clock, ChevronRight
} from "lucide-react";
import { authAPI } from "@/services/api";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", dateOfBirth: "", age: "", gender: "", maritalStatus: "",
    numberOfChildren: "", childrenAges: "", parentsAlive: "", spouseAlive: "", numberOfDependents: "",
    educationLevel: "", currentlyStudying: "", occupation: "", annualIncome: "",
    planToBuyLand: "", landPurchaseTiming: "", planToStartBusiness: "", businessTiming: "",
    wantToStudyFurther: "", studyTiming: "", planMarriage: "", marriageTiming: "",
    hasDisability: "no", disabilityType: "", state: "", district: "", ruralUrban: "",
    ownHouse: "", email: "", phone: "", location: "", bio: "", profilePicture: null
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      console.log('Loading user data:', userData);
      
      let formattedDate = "";
      if (userData.dateOfBirth) {
        const date = new Date(userData.dateOfBirth);
        formattedDate = date.toISOString().split('T')[0];
      }
      
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        dateOfBirth: formattedDate,
        age: userData.age || "",
        gender: userData.gender || "",
        maritalStatus: userData.maritalStatus || "",
        numberOfChildren: userData.numberOfChildren || "",
        childrenAges: userData.childrenAges || "",
        parentsAlive: userData.parentsAlive || "",
        spouseAlive: userData.spouseAlive || "",
        numberOfDependents: userData.numberOfDependents || "",
        educationLevel: userData.educationLevel || "",
        currentlyStudying: userData.currentlyStudying || "",
        occupation: userData.occupation || "",
        annualIncome: userData.annualIncome || "",
        planToBuyLand: userData.planToBuyLand || "",
        landPurchaseTiming: userData.landPurchaseTiming || "",
        planToStartBusiness: userData.planToStartBusiness || "",
        businessTiming: userData.businessTiming || "",
        wantToStudyFurther: userData.wantToStudyFurther || "",
        studyTiming: userData.studyTiming || "",
        planMarriage: userData.planMarriage || "",
        marriageTiming: userData.marriageTiming || "",
        hasDisability: userData.hasDisability || "no",
        disabilityType: userData.disabilityType || "",
        state: userData.state || "",
        district: userData.district || "",
        ruralUrban: userData.ruralUrban || "",
        ownHouse: userData.ownHouse || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        bio: userData.bio || "",
        profilePicture: userData.profilePicture || null
      });
      
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "dateOfBirth" && value) {
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      const email = userData.email;

      if (!email) {
        setError('User email not found. Please login again.');
        setSaving(false);
        return;
      }

      const submitData = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        dateOfBirth: formData.dateOfBirth || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || '',
        maritalStatus: formData.maritalStatus || '',
        numberOfChildren: formData.numberOfChildren ? parseInt(formData.numberOfChildren) : 0,
        childrenAges: formData.childrenAges || '',
        parentsAlive: formData.parentsAlive || '',
        spouseAlive: formData.spouseAlive || '',
        numberOfDependents: formData.numberOfDependents ? parseInt(formData.numberOfDependents) : 0,
        educationLevel: formData.educationLevel || '',
        currentlyStudying: formData.currentlyStudying || '',
        occupation: formData.occupation || '',
        annualIncome: formData.annualIncome ? parseInt(formData.annualIncome) : 0,
        planToBuyLand: formData.planToBuyLand || '',
        landPurchaseTiming: formData.landPurchaseTiming || '',
        planToStartBusiness: formData.planToStartBusiness || '',
        businessTiming: formData.businessTiming || '',
        wantToStudyFurther: formData.wantToStudyFurther || '',
        studyTiming: formData.studyTiming || '',
        planMarriage: formData.planMarriage || '',
        marriageTiming: formData.marriageTiming || '',
        hasDisability: formData.hasDisability || 'no',
        disabilityType: formData.disabilityType || '',
        state: formData.state || '',
        district: formData.district || '',
        ruralUrban: formData.ruralUrban || '',
        ownHouse: formData.ownHouse || '',
        phone: formData.phone || '',
        location: formData.location || '',
        bio: formData.bio || '',
        profilePicture: formData.profilePicture || null
      };

      console.log('Submitting to API:', { email, data: submitData });
      
      const response = await authAPI.updateProfile(email, submitData);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess(true);
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Submit Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "family", label: "Family", icon: Users },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "goals", label: "Goals", icon: Target },
    { id: "disability", label: "Disability", icon: Activity },
    { id: "residence", label: "Residence", icon: Home },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader className="h-12 w-12 text-blue-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <div className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full relative">
        {/* Soft background texture */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <div className="relative flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate("/profile")} 
            className="p-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="relative mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-green-700">Profile Updated Successfully!</p>
          </div>
        )}
        {error && (
          <div className="relative mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Profile Picture */}
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-200">
          <div className="h-24 bg-gradient-to-r from-blue-400 to-blue-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-400">
                        {formData.firstName?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                  <Camera className="h-4 w-4 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative bg-white rounded-2xl shadow-md mb-6 p-2 border border-gray-200 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="relative bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
            {/* PERSONAL TAB */}
            {activeTab === "personal" && (
              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={User} label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <InputField icon={User} label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                <InputField icon={Calendar} label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                <InputField icon={Calendar} label="Age" name="age" value={formData.age} readOnly className="bg-gray-50" />
                <SelectField icon={Heart} label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={[
                  { value: "", label: "Select Gender" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]} />
                <SelectField icon={Heart} label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} options={[
                  { value: "", label: "Select Status" },
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "divorced", label: "Divorced" },
                  { value: "widowed", label: "Widowed" },
                ]} />
                <InputField icon={Baby} label="Number of Children" name="numberOfChildren" type="number" min="0" value={formData.numberOfChildren} onChange={handleChange} />
                <InputField icon={Users2} label="Children's Ages" name="childrenAges" placeholder="e.g., 5, 7, 10" value={formData.childrenAges} onChange={handleChange} />
              </div>
            )}

            {/* FAMILY TAB */}
            {activeTab === "family" && (
              <div className="grid md:grid-cols-2 gap-6">
                <SelectField icon={Users} label="Parents Alive" name="parentsAlive" value={formData.parentsAlive} onChange={handleChange} options={[
                  { value: "", label: "Select Option" },
                  { value: "both", label: "Both Alive" },
                  { value: "mother", label: "Mother Only" },
                  { value: "father", label: "Father Only" },
                  { value: "none", label: "None" },
                ]} />
                <SelectField icon={Heart} label="Spouse Alive" name="spouseAlive" value={formData.spouseAlive} onChange={handleChange} options={[
                  { value: "", label: "Select Option" },
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                  { value: "not_applicable", label: "Not Applicable" },
                ]} />
                <InputField icon={Users} label="Number of Dependents" name="numberOfDependents" type="number" min="0" value={formData.numberOfDependents} onChange={handleChange} />
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === "education" && (
              <div className="grid md:grid-cols-2 gap-6">
                <SelectField icon={GraduationCap} label="Education Level" name="educationLevel" value={formData.educationLevel} onChange={handleChange} options={[
                  { value: "", label: "Select Education" },
                  { value: "no_formal", label: "No Formal Education" },
                  { value: "primary", label: "Primary School" },
                  { value: "secondary", label: "Secondary School" },
                  { value: "higher_secondary", label: "Higher Secondary" },
                  { value: "graduate", label: "Graduate" },
                  { value: "post_graduate", label: "Post Graduate" },
                  { value: "diploma", label: "Diploma" },
                ]} />
                <SelectField icon={BookOpen} label="Currently Studying" name="currentlyStudying" value={formData.currentlyStudying} onChange={handleChange} options={[
                  { value: "", label: "Select Option" },
                  { value: "yes_full", label: "Yes (Full Time)" },
                  { value: "yes_part", label: "Yes (Part Time)" },
                  { value: "no", label: "No" },
                ]} />
                <InputField icon={Briefcase} label="Occupation" name="occupation" placeholder="e.g., Farmer, Teacher" value={formData.occupation} onChange={handleChange} />
                <InputField icon={DollarSign} label="Annual Income (₹)" name="annualIncome" type="number" min="0" value={formData.annualIncome} onChange={handleChange} />
              </div>
            )}

            {/* GOALS TAB */}
            {activeTab === "goals" && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <SelectField icon={Home} label="Plan to buy land?" name="planToBuyLand" value={formData.planToBuyLand} onChange={handleChange} options={[
                    { value: "", label: "Select Option" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "maybe", label: "Maybe" },
                  ]} />
                  {formData.planToBuyLand === "yes" && (
                    <SelectField icon={Clock} label="When?" name="landPurchaseTiming" value={formData.landPurchaseTiming} onChange={handleChange} options={[
                      { value: "", label: "Select Timeline" },
                      { value: "1", label: "Within 1 year" },
                      { value: "2", label: "Within 2 years" },
                      { value: "3", label: "Within 3 years" },
                      { value: "5", label: "Within 5 years" },
                    ]} />
                  )}
                </div>
                <div className="space-y-4">
                  <SelectField icon={Briefcase} label="Plan to start business?" name="planToStartBusiness" value={formData.planToStartBusiness} onChange={handleChange} options={[
                    { value: "", label: "Select Option" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "maybe", label: "Maybe" },
                  ]} />
                  {formData.planToStartBusiness === "yes" && (
                    <SelectField icon={Clock} label="When?" name="businessTiming" value={formData.businessTiming} onChange={handleChange} options={[
                      { value: "", label: "Select Timeline" },
                      { value: "6", label: "Within 6 months" },
                      { value: "12", label: "Within 1 year" },
                      { value: "24", label: "Within 2 years" },
                    ]} />
                  )}
                </div>
                <div className="space-y-4">
                  <SelectField icon={GraduationCap} label="Want to study further?" name="wantToStudyFurther" value={formData.wantToStudyFurther} onChange={handleChange} options={[
                    { value: "", label: "Select Option" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "maybe", label: "Maybe" },
                  ]} />
                  {formData.wantToStudyFurther === "yes" && (
                    <SelectField icon={Clock} label="When?" name="studyTiming" value={formData.studyTiming} onChange={handleChange} options={[
                      { value: "", label: "Select Timeline" },
                      { value: "12", label: "Within 1 year" },
                      { value: "24", label: "Within 2 years" },
                      { value: "36", label: "Within 3 years" },
                    ]} />
                  )}
                </div>
                <div className="space-y-4">
                  <SelectField icon={Heart} label="Plan marriage?" name="planMarriage" value={formData.planMarriage} onChange={handleChange} options={[
                    { value: "", label: "Select Option" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "maybe", label: "Maybe" },
                  ]} />
                  {formData.planMarriage === "yes" && (
                    <SelectField icon={Clock} label="When?" name="marriageTiming" value={formData.marriageTiming} onChange={handleChange} options={[
                      { value: "", label: "Select Timeline" },
                      { value: "6", label: "Within 6 months" },
                      { value: "12", label: "Within 1 year" },
                      { value: "24", label: "Within 2 years" },
                    ]} />
                  )}
                </div>
              </div>
            )}

            {/* DISABILITY TAB */}
            {activeTab === "disability" && (
              <div className="grid md:grid-cols-2 gap-6">
                <SelectField icon={Activity} label="Any disability?" name="hasDisability" value={formData.hasDisability} onChange={handleChange} options={[
                  { value: "no", label: "No" },
                  { value: "yes", label: "Yes" },
                ]} />
                {formData.hasDisability === "yes" && (
                  <SelectField icon={Activity} label="Type of disability" name="disabilityType" value={formData.disabilityType} onChange={handleChange} options={[
                    { value: "", label: "Select Type" },
                    { value: "blind", label: "Blind/Low Vision" },
                    { value: "deaf", label: "Deaf/Hard of Hearing" },
                    { value: "orthopedic", label: "Orthopedic" },
                    { value: "intellectual", label: "Intellectual Disability" },
                    { value: "multiple", label: "Multiple Disabilities" },
                  ]} />
                )}
              </div>
            )}

            {/* RESIDENCE TAB */}
            {activeTab === "residence" && (
              <div className="grid md:grid-cols-2 gap-6">
                <SelectField icon={MapPin} label="State" name="state" value={formData.state} onChange={handleChange} options={[
                  { value: "", label: "Select State" },
                  { value: "maharashtra", label: "Maharashtra" },
                  { value: "delhi", label: "Delhi" },
                  { value: "karnataka", label: "Karnataka" },
                  { value: "tamilnadu", label: "Tamil Nadu" },
                  { value: "gujarat", label: "Gujarat" },
                  { value: "up", label: "Uttar Pradesh" },
                ]} />
                <InputField icon={MapPin} label="District" name="district" value={formData.district} onChange={handleChange} />
                <SelectField icon={Building2} label="Area Type" name="ruralUrban" value={formData.ruralUrban} onChange={handleChange} options={[
                  { value: "", label: "Select Area Type" },
                  { value: "rural", label: "Rural" },
                  { value: "urban", label: "Urban" },
                  { value: "semi_urban", label: "Semi-Urban" },
                ]} />
                <SelectField icon={Home} label="Housing" name="ownHouse" value={formData.ownHouse} onChange={handleChange} options={[
                  { value: "", label: "Select Option" },
                  { value: "yes", label: "Yes (Own House)" },
                  { value: "no", label: "No (Rented)" },
                  { value: "parental", label: "Living in Parental House" },
                  { value: "homeless", label: "Homeless" },
                ]} />
                <InputField icon={MapPin} label="Address" name="location" placeholder="Enter your full address" value={formData.location} onChange={handleChange} className="md:col-span-2" />
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === "contact" && (
              <div className="grid md:grid-cols-2 gap-6">
                <InputField icon={Mail} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required readOnly className="bg-gray-50" />
                <InputField icon={Phone} label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                <TextAreaField icon={User} label="Bio" name="bio" rows="4" placeholder="Tell us about yourself" value={formData.bio} onChange={handleChange} className="md:col-span-2" />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={saving} 
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Changes</>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => navigate("/profile")} 
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            </div>
          </div>
        </form>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Why complete your profile?</p>
                <p className="text-xs text-blue-600 mt-1">
                  A complete profile helps us find the best government schemes you're eligible for.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Privacy Guaranteed</p>
                <p className="text-xs text-blue-600 mt-1">
                  Your information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Helper Components
const InputField = ({ icon: Icon, label, name, type = "text", value, onChange, placeholder, required, readOnly, min, className = "" }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label} {required && <span className="text-blue-400">*</span>}</label>
    <div className={`flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 bg-white transition-all ${className}`}>
      <Icon className="h-4 w-4 text-gray-400 mr-3" />
      <input 
        name={name} 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required={required} 
        readOnly={readOnly} 
        min={min} 
        className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" 
      />
    </div>
  </div>
);

const SelectField = ({ icon: Icon, label, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 bg-white transition-all">
      <Icon className="h-4 w-4 text-gray-400 mr-3" />
      <select name={name} value={value} onChange={onChange} className="w-full bg-transparent outline-none text-gray-700">
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  </div>
);

const TextAreaField = ({ icon: Icon, label, name, rows = 4, value, onChange, placeholder, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="flex items-start border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 bg-white transition-all">
      <Icon className="h-4 w-4 text-gray-400 mr-3 mt-1" />
      <textarea 
        name={name} 
        rows={rows} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="w-full bg-transparent outline-none resize-none text-gray-700 placeholder-gray-400" 
      />
    </div>
  </div>
);

export default UpdateProfile;