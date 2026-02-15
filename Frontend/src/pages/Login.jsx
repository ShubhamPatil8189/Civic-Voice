import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Shield, User, Mail, Lock, Phone } from "lucide-react";
import { authAPI } from "@/services/api";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    age: "",
    dateOfBirth: "",
    nationality: "",
    state: "",
    city: "",
    pincode: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // Handle login input changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Handle signup input changes
  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Attempting login with:", loginData.email);
      
      const response = await authAPI.login(loginData.email, loginData.password);
      
      console.log("Login response:", response.data);
      
      if (response.data.success) {
        setSuccess("Login successful! Redirecting...");
        
        // Store user data in localStorage (optional)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to home/profile after 1 second
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(
        err.response?.data?.message || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Age validation
    if (Number(signupData.age) < 5 || Number(signupData.age) > 120) {
      setError("Please enter a valid age between 5 and 120");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting registration with:", signupData.email);
      
      const response = await authAPI.register(signupData);
      
      console.log("Registration response:", response.data);
      
      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        
        // Clear form
        setSignupData({
          firstName: "",
          middleName: "",
          lastName: "",
          gender: "",
          age: "",
          dateOfBirth: "",
          nationality: "",
          state: "",
          city: "",
          pincode: "",
          email: "",
          password: ""
        });
        
        // Switch to login after 2 seconds
        setTimeout(() => {
          setIsSignup(false);
          setSuccess("");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);
      setError(
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <style>{`
        .login-modal {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }
        
        .login-form,
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        .login-form input,
        .signup-form input,
        .signup-form select {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          width: 100%;
        }
        
        .login-form input:focus,
        .signup-form input:focus,
        .signup-form select:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }
        
        .row {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }
        
        .row input,
        .row select {
          flex: 1;
          min-width: 0;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          color: white;
          padding: 0.875rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 0.5rem;
          width: 100%;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(124, 58, 237, 0.2);
        }
        
        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .switch-text {
          text-align: center;
          margin-top: 1.5rem;
          color: #64748b;
        }
        
        .switch-text span {
          color: #7c3aed;
          cursor: pointer;
          margin-left: 0.5rem;
          font-weight: 600;
        }
        
        .switch-text span:hover {
          text-decoration: underline;
        }
        
        .error-message {
          background-color: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        
        .success-message {
          background-color: #dcfce7;
          color: #16a34a;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
      `}</style>

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Login/Signup Form */}
            <div className="login-modal">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  {!isSignup ? "Welcome Back" : "Create Account"}
                </h2>
              </div>

              {/* Error/Success Messages */}
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {!isSignup ? (
                // LOGIN FORM
                <>
                  <form className="login-form" onSubmit={handleLoginSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="Enter your email" 
                        required 
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </label>
                      <input 
                        type="password" 
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Enter your password" 
                        required 
                        disabled={loading}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login to CivicAssist"}
                    </button>
                  </form>

                  <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Remember me
                    </label>
                    <button className="text-sm text-purple-600 hover:underline">
                      Forgot Password?
                    </button>
                  </div>

                  <p className="switch-text">
                    Don't have an account?  
                    <span onClick={() => setIsSignup(true)}> Sign Up</span>
                  </p>
                </>
              ) : (
                // SIGNUP FORM
                <>
                  <form className="signup-form" onSubmit={handleSignupSubmit}>
                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">First Name</label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={signupData.firstName}
                          onChange={handleSignupChange}
                          placeholder="First Name" 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Middle Name</label>
                        <input 
                          type="text" 
                          name="middleName"
                          value={signupData.middleName}
                          onChange={handleSignupChange}
                          placeholder="Middle Name" 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Last Name</label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={signupData.lastName}
                          onChange={handleSignupChange}
                          placeholder="Last Name" 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Gender
                        </label>
                        <select 
                          name="gender"
                          value={signupData.gender}
                          onChange={handleSignupChange}
                          required
                          disabled={loading}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Age</label>
                        <input 
                          type="number" 
                          name="age"
                          value={signupData.age}
                          onChange={handleSignupChange}
                          placeholder="Age" 
                          required 
                          min="5" 
                          max="120" 
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date of Birth
                        </label>
                        <input 
                          type="date" 
                          name="dateOfBirth"
                          value={signupData.dateOfBirth}
                          onChange={handleSignupChange}
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Nationality
                        </label>
                        <input 
                          type="text" 
                          name="nationality"
                          value={signupData.nationality}
                          onChange={handleSignupChange}
                          placeholder="Nationality" 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">State</label>
                        <input 
                          type="text" 
                          name="state"
                          value={signupData.state}
                          onChange={handleSignupChange}
                          placeholder="State" 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">City</label>
                        <input 
                          type="text" 
                          name="city"
                          value={signupData.city}
                          onChange={handleSignupChange}
                          placeholder="City" 
                          required 
                          disabled={loading}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Pincode
                        </label>
                        <input 
                          type="text" 
                          name="pincode"
                          value={signupData.pincode}
                          onChange={handleSignupChange}
                          placeholder="Pincode" 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        placeholder="Email" 
                        required 
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </label>
                      <input 
                        type="password" 
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="Set Password" 
                        required 
                        disabled={loading}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </form>

                  <p className="switch-text">
                    Already have an account?  
                    <span onClick={() => setIsSignup(false)}> Login</span>
                  </p>
                </>
              )}
            </div>

            {/* Right Side - Info Panel (Same as your original) */}
            <div className="bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-8 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Access Government Services
                  </h3>
                  <p className="text-gray-600">
                    Login to access personalized government schemes, track applications, 
                    and get voice assistance in your preferred language.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Secure & Encrypted</h4>
                      <p className="text-sm text-gray-600">
                        Your data is protected with government-grade security standards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <User className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Personalized Experience</h4>
                      <p className="text-sm text-gray-600">
                        Get scheme recommendations based on your profile and location
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Multiple Login Options</h4>
                      <p className="text-sm text-gray-600">
                        Login via Email, Mobile OTP, or Aadhaar for convenience
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-white/50 rounded-lg border">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Note:</span> This is an official 
                    government portal. Your information is securely stored and used 
                    only for providing civic services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;