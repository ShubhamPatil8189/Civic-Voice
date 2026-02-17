import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Lock } from "lucide-react";
import { authAPI } from "@/services/api";

const Login = () => {
const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: "",
});

const [error, setError] = useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();
setError("");


try {
  const res = await authAPI.login(form);

  if (res.data.success) {
    // store user
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // notify header instantly
    window.dispatchEvent(new Event("login"));

    // redirect to profile
    navigate("/profile");
  } else {
    setError(res.data.message || "Login failed");
  }
} catch (err) {
  setError("Invalid email or password");
}


};

return ( <div className="min-h-screen flex flex-col bg-gray-50"> <Header />


  <div className="flex-1 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      {error && (
        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Email</label>
          <div className="flex items-center border rounded-lg px-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 outline-none"
              placeholder="Enter email"
            />
          </div>
        </div>

        <div>
          <label>Password</label>
          <div className="flex items-center border rounded-lg px-3">
            <Lock className="h-4 w-4 text-gray-400" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 outline-none"
              placeholder="Enter password"
            />
          </div>
        </div>

        <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-5">
        Don't have an account?
        <Link to="/register" className="text-purple-600 ml-1">
          Register
        </Link>
      </p>

    </div>
  </div>

  <Footer />
</div>


);
};

export default Login;
