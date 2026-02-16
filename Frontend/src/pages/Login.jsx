import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Shield, User, Mail, Lock, Phone, Loader } from "lucide-react";
import { authAPI } from "@/services/api";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialCheck, setInitialCheck] = useState(true);
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

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          // Verify token is still valid by fetching current user
          const response = await authAPI.getCurrentUser();
          if (response.data.success) {
            // Token is valid, redirect to profile
            navigate('/profile');
            return;
          }
        } catch (error) {
          // Token is invalid or expired, clear storage
          console.log('Session expired, please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('token_expiry');
        }
      }
      setInitialCheck(false);
    };

    checkLoggedIn();
  }, [navigate]);

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

  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.login(loginData.email, loginData.password);

      if (response.data.success) {
        // Save JWT token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Set token expiry (7 days from now)
        const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem("token_expiry", expiryTime);

        setSuccess(t('login_page.success_login'));

        // Redirect to profile
        setTimeout(() => {
          navigate("/profile");
        }, 800);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t('login_page.error_generic')
      );
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Age validation
    if (Number(signupData.age) < 5 || Number(signupData.age) > 120) {
      setError(t('register_page.validation_age') || "Please enter a valid age between 5 and 120");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(signupData);

      if (response.data.success) {
        // Auto login after register
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Set token expiry (7 days from now)
        const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem("token_expiry", expiryTime);

        setSuccess(t('login_page.success_register') || "Registration successful! Redirecting...");

        // Redirect to profile
        setTimeout(() => {
          navigate("/profile");
        }, 800);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t('login_page.error_generic') ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking initial auth state
  if (initialCheck) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            {t('login_page.back_to_home')}
          </Link>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">
                {isSignup ? t('login_page.title_signup') : t('login_page.title_login')}
              </h2>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                {success}
              </div>
            )}

            {!isSignup ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('login_page.email_placeholder')}
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={t('login_page.password_placeholder')}
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button" 
                    className="text-sm text-purple-600 hover:underline"
                    onClick={() => alert('Password reset feature coming soon!')}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      {t('login_page.btn_logging_in')}
                    </>
                  ) : (
                    t('login_page.btn_login')
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      name="firstName" 
                      placeholder={t('register_page.placeholders.first_name')} 
                      value={signupData.firstName} 
                      onChange={handleSignupChange} 
                      required 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      name="lastName" 
                      placeholder={t('register_page.placeholders.last_name')} 
                      value={signupData.lastName} 
                      onChange={handleSignupChange} 
                      required 
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input 
                    name="age" 
                    type="number" 
                    placeholder={t('register_page.placeholders.age')} 
                    value={signupData.age} 
                    onChange={handleSignupChange} 
                    required 
                    min="5"
                    max="120"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    name="phone" 
                    placeholder={t('register_page.placeholders.phone')} 
                    value={signupData.phone} 
                    onChange={handleSignupChange} 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    name="location" 
                    placeholder={t('register_page.placeholders.location')} 
                    value={signupData.location} 
                    onChange={handleSignupChange} 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input 
                    name="occupation" 
                    placeholder={t('register_page.placeholders.occupation')} 
                    value={signupData.occupation} 
                    onChange={handleSignupChange} 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder={t('login_page.email_placeholder')} 
                    value={signupData.email} 
                    onChange={handleSignupChange} 
                    required 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input 
                    name="password" 
                    type="password" 
                    placeholder={t('login_page.password_placeholder')} 
                    value={signupData.password} 
                    onChange={handleSignupChange} 
                    required 
                    minLength="6"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      {t('login_page.btn_creating')}
                    </>
                  ) : (
                    t('login_page.btn_register')
                  )}
                </button>
              </form>
            )}

            <p className="text-center mt-6 text-sm text-gray-600">
              {isSignup ? t('login_page.have_account') : t('login_page.no_account')}
              <span
                className="text-purple-600 font-semibold cursor-pointer ml-1 hover:underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? t('login_page.link_login') : t('login_page.link_signup')}
              </span>
            </p>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;