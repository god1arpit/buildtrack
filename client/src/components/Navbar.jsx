import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  HardHat, 
  Sparkles,
  Building2, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Camera,
  Layers,
  CheckCircle2
} from "lucide-react";

export const Navbar = ({ toggleMobileSidebar, isMobileSidebarOpen }) => {
  const { user, logout, switchDemoRole, role } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = async (targetRole) => {
    await switchDemoRole(targetRole);
    if (targetRole === "builder") navigate("/builder");
    else if (targetRole === "supervisor") navigate("/supervisor");
    else navigate("/labour");
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {toggleMobileSidebar && (
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to={role === "supervisor" ? "/supervisor" : role === "labour" ? "/labour" : "/builder"} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-base tracking-tight">
                <span>Build<span className="text-amber-400">Track</span></span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-extrabold px-1.5 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Vision
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider block -mt-1 uppercase hidden sm:block">
                Construction & Workforce Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Contextual Quick Actions based on Role */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          {role === "supervisor" ? (
            <>
              <Link
                to="/supervisor/ai-workflow"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold hover:bg-amber-500/25 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload & Check AI Workflow</span>
              </Link>
              <Link
                to="/verification"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-semibold hover:text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Labour Enrolment</span>
              </Link>
            </>
          ) : role === "labour" ? (
            <Link
              to="/verification"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>My Smart ID Card</span>
            </Link>
          ) : (
            <>
              <Link
                to="/builder/ai-workflow"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold hover:bg-blue-500/25 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>AI Road & Workflow HUD</span>
              </Link>
              <Link
                to="/verification"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-semibold hover:text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Labour Verification</span>
              </Link>
            </>
          )}
        </div>

        {/* Right: Quick Role Switcher & User Account */}
        <div className="flex items-center gap-3">
          {/* 1-Click Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-500 font-bold px-2 uppercase">Switch:</span>
            <button
              onClick={() => handleRoleChange("builder")}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                role === "builder"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3 h-3" />
              Builder
            </button>
            <button
              onClick={() => handleRoleChange("supervisor")}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                role === "supervisor"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <HardHat className="w-3 h-3" />
              Supervisor
            </button>
            <button
              onClick={() => handleRoleChange("labour")}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                role === "labour"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3 h-3" />
              Labour
            </button>
          </div>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-950/80 pl-3 pr-1 py-1 rounded-2xl border border-slate-800 text-xs">
              <div className="text-right hidden sm:block">
                <span className="font-bold text-white block text-xs leading-tight truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-amber-400 uppercase font-mono font-semibold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow hover:bg-amber-400 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
