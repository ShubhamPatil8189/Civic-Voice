<<<<<<< HEAD
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email);
    if (result.success) {
      navigate('/verify-otp');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '10px 20px', width: '100%' }}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
=======
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Shield, User, Mail, Lock, Phone, Calendar, MapPin, Globe } from "lucide-react";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log("Form submitted");
    // Redirect to home after successful login/signup
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Include Header */}
      <Header />

      <style>{`
        .login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .login-modal {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }
        
        .close-btn:hover {
          color: #333;
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
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(124, 58, 237, 0.2);
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
        
        h2 {
          color: #1e293b;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Back to Home Link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Login Form */}
            <div className="login-modal shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold">
                  {!isSignup ? "Welcome Back" : "Create Account"}
                </h2>
              </div>

              {!isSignup ? (
                <>
                  <form className="login-form" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </label>
                      <input 
                        type="password" 
                        placeholder="Enter your password" 
                        required 
                        className="w-full"
                      />
                    </div>

                    <button type="submit" className="submit-btn">
                      Login to CivicAssist
                    </button>
                  </form>

                  <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      Remember me
                    </label>
                    <button className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </button>
                  </div>

                  <p className="switch-text">
                    Don't have an account?  
                    <span onClick={() => setIsSignup(true)}> Sign Up</span>
                  </p>

                  <div className="mt-6 pt-6 border-t">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">Or continue with</p>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                          <Phone className="h-4 w-4 inline mr-2" />
                          Mobile OTP
                        </button>
                        <button className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
                          <User className="h-4 w-4 inline mr-2" />
                          Aadhaar
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">First Name</label>
                        <input type="text" placeholder="First Name" required />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Middle Name</label>
                        <input type="text" placeholder="Middle Name" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Last Name</label>
                        <input type="text" placeholder="Last Name" required />
                      </div>
                    </div>

                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Gender
                        </label>
                        <select required>
                          <option value="">Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">Age</label>
                        <input type="number" placeholder="Age" required min="1" max="120" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date of Birth
                        </label>
                        <input type="date" required />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Nationality
                        </label>
                        <input type="text" placeholder="Nationality" required />
                      </div>
                    </div>

                    <div className="row">
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">State</label>
                        <input type="text" placeholder="State" required />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium">City</label>
                        <input type="text" placeholder="City" required />
                      </div>
                      <div className="space-y-2 flex-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Pincode
                        </label>
                        <input type="text" placeholder="Pincode" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </label>
                      <input type="email" placeholder="Email" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </label>
                      <input type="password" placeholder="Set Password" required />
                    </div>

                    <button type="submit" className="submit-btn">
                      Create Account
                    </button>
                  </form>

                  <p className="switch-text">
                    Already have an account?  
                    <span onClick={() => setIsSignup(false)}> Login</span>
                  </p>
                </>
              )}
            </div>

            {/* Right Side - Info Panel */}
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
>>>>>>> 7aa48b6e5569d8be20cd87963604afb7925f0046
    </div>
  );
};

export default Login;