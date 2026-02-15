import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User, Mail, Lock, Calendar, Phone, MapPin, Briefcase } from "lucide-react";
import { authAPI } from "@/services/api";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
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
      setError(t('register_page.validation_age'));
      setLoading(false);
      return;
    }

    try {
      console.log("Registering user:", form.email);

      const response = await authAPI.register(form);

      console.log("Registration response:", response.data);

      if (response.data.success) {
        setSuccess(t('register_page.success'));

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
        t('register_page.error')
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
            <h2 className="text-3xl font-bold text-gray-800">{t('register_page.title')}</h2>
            <p className="text-gray-500 mt-2">
              {t('register_page.subtitle')}
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
              <label className="label">{t('register_page.labels.first_name')}</label>
              <div className="inputBox">
                <User className="icon" />
                <input
                  name="firstName"
                  type="text"
                  placeholder={t('register_page.placeholders.first_name')}
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="label">{t('register_page.labels.last_name')}</label>
              <div className="inputBox">
                <User className="icon" />
                <input
                  name="lastName"
                  type="text"
                  placeholder={t('register_page.placeholders.last_name')}
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="label">{t('register_page.labels.age')}</label>
              <div className="inputBox">
                <Calendar className="icon" />
                <input
                  name="age"
                  type="number"
                  placeholder={t('register_page.placeholders.age')}
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
              <label className="label">{t('register_page.labels.phone')}</label>
              <div className="inputBox">
                <Phone className="icon" />
                <input
                  name="phone"
                  type="tel"
                  placeholder={t('register_page.placeholders.phone')}
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Location (New Field) */}
            <div>
              <label className="label">{t('register_page.labels.location')}</label>
              <div className="inputBox">
                <MapPin className="icon" />
                <input
                  name="location"
                  type="text"
                  placeholder={t('register_page.placeholders.location')}
                  value={form.location}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Occupation (New Field) */}
            <div>
              <label className="label">{t('register_page.labels.occupation')}</label>
              <div className="inputBox">
                <Briefcase className="icon" />
                <input
                  name="occupation"
                  type="text"
                  placeholder={t('register_page.placeholders.occupation')}
                  value={form.occupation}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">{t('register_page.labels.email')}</label>
              <div className="inputBox">
                <Mail className="icon" />
                <input
                  name="email"
                  type="email"
                  placeholder={t('register_page.placeholders.email')}
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">{t('register_page.labels.password')}</label>
              <div className="inputBox">
                <Lock className="icon" />
                <input
                  name="password"
                  type="password"
                  placeholder={t('register_page.placeholders.password')}
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
              {loading ? t('register_page.btn_creating') : t('register_page.btn_register')}
            </button>
          </form>

          {/* Login redirect */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {t('register_page.have_account')}
            <Link
              to="/login"
              className="text-purple-600 font-semibold ml-2 hover:underline"
            >
              {t('register_page.link_login')}
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