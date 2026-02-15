import axios from "axios";

/* ---------------- AXIOS INSTANCE ---------------- */

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------- AUTOMATIC TOKEN ATTACH -------- */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ---------------- AUTH APIs ---------------- */

export const authAPI = {

  // REGISTER
  register: async (userData) => {
    const res = await API.post("/auth/register", userData);

    // Save token immediately after register
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res;
  },

  // LOGIN ⭐ FIXED
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });

    // 🔴 MOST IMPORTANT LINE
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res;
  },

  // CURRENT USER
  getCurrentUser: () => API.get("/auth/me"),

  // UPDATE PROFILE ⭐⭐⭐
  updateProfile: (data) => API.put("/auth/profile", data),

  // LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
};

export default API;
