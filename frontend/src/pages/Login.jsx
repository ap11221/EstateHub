import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Log in to manage your listings and favorites.</p>

        {error && <div className="mt-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Logging in..." : "Log In"}</button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account? <Link to="/register" className="text-brand-600 font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
