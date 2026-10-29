import axios from "axios";

// In local dev, VITE_API_URL is unset and requests go to the relative "/api"
// path, which Vite's dev server proxies to http://localhost:5000 (see vite.config.js).
// In production, set VITE_API_URL to your deployed backend's URL, e.g.
// https://your-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("nestfind_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
