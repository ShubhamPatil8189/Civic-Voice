import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  User, Mail, Phone, MapPin, Calendar, Heart, Briefcase,
  GraduationCap, Users, Target, Activity, Home, Baby, Users2,
  Edit, Shield, AlertCircle, Loader, BookOpen, 
  DollarSign, Camera, Sparkles, Clock, LogOut, ChevronRight,
  Award, Landmark, Building2, CheckCircle,
  Github, Twitter, Linkedin, Instagram, Facebook,
  Youtube, Share2, MoreHorizontal, Bell, Lock
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      console.log('Loading user data:', userData);
      setUser(userData);
      setTempBio(userData.bio || '');
      
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = () => {
    navigate("/update-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProfileStrength = () => {
    let filled = 0;
    let total = 0;
    
    const fields = [
      user?.firstName, user?.lastName, user?.email, user?.phone,
      user?.age, user?.gender, user?.maritalStatus,
      user?.occupation, user?.educationLevel, user?.annualIncome,
      user?.state, user?.district, user?.location,
      user?.bio
    ];
    
    fields.forEach(field => {
      total++;
      if (field && field !== '' && field !== 0) filled++;
    });
    
    return Math.round((filled / total) * 100);
  };

  const profileStrength = getProfileStrength();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative">
              <div className="w-32 h-32 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">Loading your profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="relative max-w-md w-full">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 shadow-xl">
              <div className="absolute -top-4 -right-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
                <p className="text-gray-500 mb-8">{error || 'Please login to continue'}</p>
                
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Return to Login
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User, color: "from-blue-400 to-cyan-400" },
    { id: "personal", label: "Personal", icon: Heart, color: "from-pink-400 to-rose-400" },
    { id: "family", label: "Family", icon: Users, color: "from-green-400 to-emerald-400" },
    { id: "education", label: "Education", icon: GraduationCap, color: "from-purple-400 to-indigo-400" },
    { id: "goals", label: "Goals", icon: Target, color: "from-orange-400 to-red-400" },
    { id: "residence", label: "Residence", icon: Home, color: "from-teal-400 to-cyan-400" },
    { id: "disability", label: "Disability", icon: Activity, color: "from-violet-400 to-purple-400" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Header />
      
      <div className="flex-1 px-4 py-8 max-w-7xl mx-auto w-full relative">
        {/* Soft background texture */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-100/50 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #888 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Top bar */}
        <div className="relative mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-500">Manage your personal information</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 rounded-full text-xs flex items-center justify-center text-white">3</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    <ShareButton icon={Facebook} label="Facebook" color="from-blue-500 to-blue-600" />
                    <ShareButton icon={Twitter} label="Twitter" color="from-sky-400 to-sky-500" />
                    <ShareButton icon={Linkedin} label="LinkedIn" color="from-blue-600 to-blue-700" />
                    <ShareButton icon={Instagram} label="Instagram" color="from-pink-500 to-purple-500" />
                  </div>
                </div>
              )}
            </div>
            
            <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Profile Strength Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-purple-100 to-pink-100 border border-gray-200/50 shadow-md">
          <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:20px_20px]"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold text-lg">Profile Strength</h3>
                  <p className="text-gray-500 text-sm">Complete your profile to get better recommendations</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${profileStrength}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold text-gray-800">{profileStrength}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="relative mb-8">
          <div className="relative bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
            {/* Cover Image */}
            <div className="h-56 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <svg className="absolute bottom-0 left-0 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1440 320">
                  <path fill="white" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
              
              <div className="absolute top-6 right-6">
                <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                  <span className="text-gray-700 text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Profile {profileStrength}% Complete
                  </span>
                </div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                <div className="relative group">
                  <div className="relative w-32 h-32 rounded-2xl bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-gray-100 to-white flex items-center justify-center overflow-hidden">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl font-bold text-gray-400">
                          {user.firstName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-1 -right-1">
                    <div className="w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <button className="absolute -bottom-1 -left-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-all shadow-md">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>

                {/* Name and Title */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                        {user.firstName} {user.lastName}
                      </h1>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                        <p className="text-lg text-gray-600">
                          {user.occupation || 'Professional'}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <ContactPill icon={Mail} text={user.email} />
                        {user.phone && <ContactPill icon={Phone} text={user.phone} />}
                        {user.location && <ContactPill icon={MapPin} text={user.location} />}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateClick}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Edit className="h-5 w-5" />
                        Edit Profile
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <LogOut className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <StatCard icon={Calendar} label="Age" value={user.age || 'Not set'} color="blue" />
                <StatCard icon={Heart} label="Gender" value={user.gender || 'Not set'} capitalize color="pink" />
                <StatCard icon={Heart} label="Marital Status" value={user.maritalStatus || 'Not set'} capitalize color="purple" />
                <StatCard icon={MapPin} label="Location" value={user.location || 'Not set'} color="green" />
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                <SocialButton icon={Github} href="#" label="GitHub" />
                <SocialButton icon={Twitter} href="#" label="Twitter" />
                <SocialButton icon={Linkedin} href="#" label="LinkedIn" />
                <SocialButton icon={Instagram} href="#" label="Instagram" />
                <SocialButton icon={Facebook} href="#" label="Facebook" />
                <SocialButton icon={Youtube} href="#" label="YouTube" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="relative mb-6">
          <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-md overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'text-white bg-gradient-to-r ' + tab.color
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.id === 'goals' && (
                    <span className="ml-1 w-5 h-5 bg-red-400 rounded-full text-xs flex items-center justify-center text-white">2</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          <div className="relative bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Bio Section */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      About Me
                    </h3>
                    <button
                      onClick={() => setIsEditingBio(!isEditingBio)}
                      className="px-4 py-2 bg-white rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all border border-gray-200"
                    >
                      {isEditingBio ? 'Save' : 'Edit Bio'}
                    </button>
                  </div>
                  
                  {isEditingBio ? (
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:border-purple-400 transition-all"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {user.bio || 'No bio provided yet. Click edit to add a bio.'}
                    </p>
                  )}
                </div>

                {/* Key Information Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  {user.occupation && <InfoCard icon={Briefcase} title="Occupation" value={user.occupation} color="blue" />}
                  {user.educationLevel && <InfoCard icon={GraduationCap} title="Education" value={user.educationLevel} color="purple" />}
                  {user.annualIncome > 0 && <InfoCard icon={DollarSign} title="Annual Income" value={`₹${user.annualIncome.toLocaleString()}`} color="green" />}
                </div>

                {/* Family Overview */}
                {(user.parentsAlive || user.spouseAlive || user.numberOfChildren > 0) && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-purple-500" />
                      Family Overview
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {user.parentsAlive && <FamilyCard label="Parents" value={user.parentsAlive} icon={Users} />}
                      {user.spouseAlive && user.spouseAlive !== 'not_applicable' && (
                        <FamilyCard label="Spouse" value={user.spouseAlive === 'yes' ? 'Alive' : 'Not Alive'} icon={Heart} />
                      )}
                      {user.numberOfChildren > 0 && <FamilyCard label="Children" value={user.numberOfChildren} icon={Baby} />}
                    </div>
                  </div>
                )}

                {/* Active Goals */}
                {(user.planToBuyLand === 'yes' || user.planToStartBusiness === 'yes' || user.wantToStudyFurther === 'yes') && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-purple-500" />
                      Active Goals
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {user.planToBuyLand === 'yes' && <GoalPreview icon={Home} text="Buy Land" timing={user.landPurchaseTiming} />}
                      {user.planToStartBusiness === 'yes' && <GoalPreview icon={Briefcase} text="Start Business" timing={user.businessTiming} />}
                      {user.wantToStudyFurther === 'yes' && <GoalPreview icon={GraduationCap} text="Study Further" timing={user.studyTiming} />}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Personal Tab */}
            {activeTab === "personal" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <DetailField icon={User} label="First Name" value={user.firstName} />
                  <DetailField icon={User} label="Last Name" value={user.lastName} />
                  <DetailField icon={Calendar} label="Date of Birth" value={formatDate(user.dateOfBirth)} />
                  <DetailField icon={Calendar} label="Age" value={user.age || 'Not set'} />
                  <DetailField icon={Heart} label="Gender" value={user.gender || 'Not set'} capitalize />
                  <DetailField icon={Heart} label="Marital Status" value={user.maritalStatus || 'Not set'} capitalize />
                  {user.numberOfChildren > 0 && (
                    <>
                      <DetailField icon={Baby} label="Number of Children" value={user.numberOfChildren} />
                      <DetailField icon={Users2} label="Children's Ages" value={user.childrenAges || 'Not set'} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Family Tab */}
            {activeTab === "family" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Family Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <DetailField icon={Users} label="Parents" value={user.parentsAlive || 'Not specified'} capitalize />
                  <DetailField icon={Heart} label="Spouse" value={user.spouseAlive || 'Not specified'} capitalize />
                  <DetailField icon={Users} label="Number of Dependents" value={user.numberOfDependents || '0'} />
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Education & Career</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <DetailField icon={GraduationCap} label="Education Level" value={user.educationLevel || 'Not specified'} />
                  <DetailField icon={BookOpen} label="Currently Studying" value={user.currentlyStudying || 'No'} />
                  <DetailField icon={Briefcase} label="Occupation" value={user.occupation || 'Not specified'} />
                  <DetailField icon={DollarSign} label="Annual Income" value={user.annualIncome ? `₹${user.annualIncome.toLocaleString()}` : 'Not specified'} />
                </div>
              </div>
            )}

            {/* Goals Tab */}
            {activeTab === "goals" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Life Goals</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <GoalCard title="Buy Land" status={user.planToBuyLand} timing={user.landPurchaseTiming} icon={Home} />
                  <GoalCard title="Start Business" status={user.planToStartBusiness} timing={user.businessTiming} icon={Briefcase} />
                  <GoalCard title="Study Further" status={user.wantToStudyFurther} timing={user.studyTiming} icon={GraduationCap} />
                  <GoalCard title="Marriage" status={user.planMarriage} timing={user.marriageTiming} icon={Heart} />
                </div>
              </div>
            )}

            {/* Residence Tab */}
            {activeTab === "residence" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Residence Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <DetailField icon={MapPin} label="State" value={user.state || 'Not specified'} />
                  <DetailField icon={MapPin} label="District" value={user.district || 'Not specified'} />
                  <DetailField icon={Home} label="Area Type" value={user.ruralUrban || 'Not specified'} />
                  <DetailField icon={Home} label="Housing" value={user.ownHouse || 'Not specified'} />
                  <DetailField icon={MapPin} label="Address" value={user.location || 'Not specified'} className="md:col-span-2" />
                </div>
              </div>
            )}

            {/* Disability Tab */}
            {activeTab === "disability" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Disability Status</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <DetailField icon={Activity} label="Has Disability" value={user.hasDisability === 'yes' ? 'Yes' : 'No'} />
                  {user.hasDisability === 'yes' && (
                    <DetailField icon={Activity} label="Disability Type" value={user.disabilityType || 'Not specified'} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="text-gray-500 text-sm">Member since</span>
              <span className="text-gray-800 ml-2">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}</span>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="text-gray-500 text-sm">Last updated</span>
              <span className="text-gray-800 ml-2">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-white rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all border border-gray-200 shadow-sm flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Privacy Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 rounded-full border border-gray-200 shadow-sm">
            <Shield className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600">Your information is encrypted and secure</span>
            <Lock className="h-4 w-4 text-green-500" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, capitalize, color }) => {
  const colors = {
    blue: 'from-blue-100 to-cyan-100',
    pink: 'from-pink-100 to-rose-100',
    purple: 'from-purple-100 to-indigo-100',
    green: 'from-green-100 to-emerald-100',
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colors[color]} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className={`text-lg font-semibold text-gray-800 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ icon: Icon, label, value, capitalize, className }) => (
  <div className={`bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all ${className}`}>
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
        <Icon className="h-4 w-4 text-purple-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-sm font-semibold text-gray-800 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
      </div>
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, title, value, color }) => {
  const colors = {
    blue: 'from-blue-100 to-cyan-100',
    purple: 'from-purple-100 to-indigo-100',
    green: 'from-green-100 to-emerald-100',
  };

  return (
    <div className="bg-gradient-to-r p-[1px] rounded-xl hover:scale-105 transition-transform">
      <div className={`bg-gradient-to-r ${colors[color]} rounded-xl p-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
            <Icon className={`h-5 w-5 text-${color}-600`} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-base font-semibold text-gray-800">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FamilyCard = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-200">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-purple-500" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800 capitalize">{value}</p>
      </div>
    </div>
  </div>
);

const GoalPreview = ({ icon: Icon, text, timing }) => (
  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-4 w-4 text-green-600" />
      <span className="text-sm text-gray-700">{text}</span>
    </div>
    {timing && (
      <p className="text-xs text-green-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {timing === '1' ? 'Within 1 year' :
         timing === '2' ? 'Within 2 years' :
         timing === '3' ? 'Within 3 years' :
         timing === '5' ? 'Within 5 years' :
         timing === '6' ? 'Within 6 months' :
         timing === '12' ? 'Within 1 year' :
         timing === '24' ? 'Within 2 years' :
         timing === '36' ? 'Within 3 years' : timing}
      </p>
    )}
  </div>
);

const GoalCard = ({ title, status, timing, icon: Icon }) => {
  const getStatusColor = () => {
    if (status === 'yes') return 'bg-green-50 border-green-200';
    if (status === 'maybe') return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getStatusText = () => {
    if (status === 'yes') return 'Planning';
    if (status === 'maybe') return 'Considering';
    if (status === 'no') return 'Not Planning';
    return 'Not specified';
  };

  const getBadgeColor = () => {
    if (status === 'yes') return 'bg-green-100 text-green-700';
    if (status === 'maybe') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className={`${getStatusColor()} rounded-xl p-4 border`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
          <Icon className="h-4 w-4 text-purple-600" />
        </div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs ${getBadgeColor()}`}>{getStatusText()}</span>
      {status === 'yes' && timing && (
        <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Timeline: {
            timing === '1' ? 'Within 1 year' :
            timing === '2' ? 'Within 2 years' :
            timing === '3' ? 'Within 3 years' :
            timing === '5' ? 'Within 5 years' :
            timing === '6' ? 'Within 6 months' :
            timing === '12' ? 'Within 1 year' :
            timing === '24' ? 'Within 2 years' :
            timing === '36' ? 'Within 3 years' : timing
          }
        </p>
      )}
    </div>
  );
};

const ContactPill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
    <Icon className="h-3 w-3 text-purple-500" />
    <span className="text-xs text-gray-600">{text}</span>
  </div>
);

const SocialButton = ({ icon: Icon, href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 transition-all"
    title={label}
  >
    <Icon className="h-4 w-4" />
  </a>
);

const ShareButton = ({ icon: Icon, label, color }) => (
  <button className={`w-full px-4 py-2 bg-gradient-to-r ${color} rounded-lg text-white text-sm flex items-center gap-2 hover:opacity-90 transition-opacity`}>
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

export default Profile;