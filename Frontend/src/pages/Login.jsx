import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Shield, User, Mail, Lock, Phone, AlertCircle, Check, Loader } from "lucide-react";
import { authAPI } from "@/services/api";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    occupation: ""
  });

  const navigate = useNavigate();

  // Login input change
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Signup input change
  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  // LOGIN - SIMPLE VERSION (NO JWT)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Send data as object
      const response = await authAPI.login({
        email: loginData.email,
        password: loginData.password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Remove any existing token (cleanup)
        localStorage.removeItem("token");

        setSuccess("Login successful! Redirecting to profile...");

        // Redirect to profile after short delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        setError(response.data.message || "Login failed");
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // REGISTER - SIMPLE VERSION (NO JWT)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const response = await authAPI.register(signupData);

      console.log('Register response:', response.data);

      if (response.data.success) {
        // Store user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Remove any existing token
        localStorage.removeItem("token");

        setSuccess("Account created successfully! Redirecting to profile...");

        // Redirect to profile after short delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <Check className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            {!isSignup ? (
              // Login Form
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        name="firstName"
                        placeholder="First name"
                        value={signupData.firstName}
                        onChange={handleSignupChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        name="lastName"
                        placeholder="Last name"
                        value={signupData.lastName}
                        onChange={handleSignupChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                      minLength="6"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      name="phone"
                      placeholder="Enter phone number"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      placeholder="Age"
                      value={signupData.age}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Occupation
                    </label>
                    <input
                      name="occupation"
                      placeholder="Occupation"
                      value={signupData.occupation}
                      onChange={handleSignupChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    name="location"
                    placeholder="City/Location"
                    value={signupData.location}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            )}

            <p className="text-center mt-6 text-sm text-gray-600">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button
                className="text-purple-600 font-medium ml-1 hover:text-purple-700 focus:outline-none"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setSuccess("");
                }}
              >
                {isSignup ? "Login" : "Sign up"}
              </button>
            </p>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;