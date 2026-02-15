
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

  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.login(loginData.email, loginData.password);

      if (response.data.success) {

        // ⭐ Save JWT token
        localStorage.setItem("token", response.data.token);

        // Optional: store user
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/profile");
        }, 800);
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
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

    try {
      const response = await authAPI.register(signupData);

      if (response.data.success) {

        // ⭐ Auto login after register
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setSuccess("Account created successfully!");

        setTimeout(() => {
          navigate("/profile");
        }, 800);
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed"
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
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="bg-white p-8 rounded-xl shadow-lg">

            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-600 mb-4">{success}</div>}

            {!isSignup ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full p-3 border rounded-lg"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white p-3 rounded-lg"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">

                <input name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange} required className="w-full p-3 border rounded-lg"/>
                <input name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange} required className="w-full p-3 border rounded-lg"/>
                <input name="age" type="number" placeholder="Age" value={signupData.age} onChange={handleSignupChange} required className="w-full p-3 border rounded-lg"/>
                <input name="phone" placeholder="Phone" value={signupData.phone} onChange={handleSignupChange} className="w-full p-3 border rounded-lg"/>
                <input name="location" placeholder="Location" value={signupData.location} onChange={handleSignupChange} className="w-full p-3 border rounded-lg"/>
                <input name="occupation" placeholder="Occupation" value={signupData.occupation} onChange={handleSignupChange} className="w-full p-3 border rounded-lg"/>
                <input name="email" type="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} required className="w-full p-3 border rounded-lg"/>
                <input name="password" type="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} required className="w-full p-3 border rounded-lg"/>

                <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white p-3 rounded-lg">
                  {loading ? "Creating..." : "Register"}
                </button>
              </form>
            )}

            <p className="text-center mt-4 text-sm">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <span
                className="text-purple-600 cursor-pointer ml-1"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Login" : "Sign Up"}
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

