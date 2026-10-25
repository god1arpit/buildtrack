import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HardHat, LogIn, Building2, User, Sparkles } from "lucide-react";

export const Login = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "builder") navigate("/builder");
      else if (user.role === "supervisor") navigate("/supervisor");
      else navigate("/labour");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    const user = await switchDemoRole(role);
    if (role === "builder") navigate("/builder");
    else if (role === "supervisor") navigate("/supervisor");
    else navigate("/labour");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <HardHat className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Build<span className="text-amber-400">Track</span>
          </h1>
          <p className="text-xs text-slate-400">Sign in to manage construction sites, labour & wages</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email or Phone</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="builder@buildtrack.com"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:opacity-90 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 stroke-[2.5]" />
            {loading ? "Signing in..." : "Sign In to BuildTrack"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          New to BuildTrack?{" "}
          <Link to="/register" className="text-amber-400 font-bold hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};
