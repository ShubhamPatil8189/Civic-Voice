import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User, Mail, Lock, Calendar, Phone, MapPin, Briefcase } from "lucide-react";
import { authAPI } from "@/services/api";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    occupation: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Age validation
    if (Number(form.age) < 5 || Number(form.age) > 120) {
      setError("Please enter a valid age between 5 and 120");
      setLoading(false);
      return;
    }

    try {
      console.log("Registering user:", form.email);
      
      const response = await authAPI.register(form);
      
      console.log("Registration response:", response.data);
      
      if (response.data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        
        // Clear form
        setForm({
          firstName: "",
          lastName: "",
          age: "",
          email: "",
          password: "",
          phone: "",
          location: "",
          occupation: ""
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">
              Join CivicAssist to explore government schemes
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div>
              <label className="label">First Name</label>
              <div className="inputBox">
                <User className="icon" />
                <input
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="label">Last Name</label>
              <div className="inputBox">
                <User className="icon" />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="label">Age</label>
              <div className="inputBox">
                <Calendar className="icon" />
                <input
                  name="age"
                  type="number"
                  placeholder="Enter age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  min="5"
                  max="120"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone (New Field) */}
            <div>
              <label className="label">Phone Number</label>
              <div className="inputBox">
                <Phone className="icon" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Location (New Field) */}
            <div>
              <label className="label">Location</label>
              <div className="inputBox">
                <MapPin className="icon" />
                <input
                  name="location"
                  type="text"
                  placeholder="Enter city/location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Occupation (New Field) */}
            <div>
              <label className="label">Occupation</label>
              <div className="inputBox">
                <Briefcase className="icon" />
                <input
                  name="occupation"
                  type="text"
                  placeholder="Enter occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div className="inputBox">
                <Mail className="icon" />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
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
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="registerBtn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          {/* Login redirect */}
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
      </div>

      <Footer />

      {/* Styling */}
      <style>{`
        .label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .inputBox {
          margin-top: 6px;
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

        .inputBox input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          background: transparent;
        }

        .inputBox input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .icon {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          color: #6b7280;
        }

        .registerBtn {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          transition: 0.25s;
          border: none;
          cursor: pointer;
        }

        .registerBtn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(124,58,237,0.25);
        }

        .registerBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Register;