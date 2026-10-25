import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  CircleDollarSign,
  Receipt,
  FileSpreadsheet,
  Camera,
  ClipboardList,
  Sparkles,
  UserCheck,
  ShieldCheck
} from "lucide-react";

export const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { role } = useAuth();

  const builderLinks = [
    { to: "/builder", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/builder/ai-workflow", label: "AI Road & Site Progress", icon: Sparkles, badge: "AI Vision" },
    { to: "/verification", label: "Labour Verification", icon: ShieldCheck, badge: "Smart ID" },
    { to: "/builder/projects", label: "Projects & Sites", icon: Building2 },
    { to: "/builder/labour", label: "Labour Directory", icon: Users },
    { to: "/builder/attendance", label: "Daily Attendance", icon: CalendarCheck },
    { to: "/builder/wages", label: "Wages & Payouts", icon: CircleDollarSign },
    { to: "/builder/expenses", label: "Site Expenses", icon: Receipt },
    { to: "/builder/daily-updates", label: "Daily Reports", icon: ClipboardList },
    { to: "/builder/photos", label: "Site Photos", icon: Camera },
    { to: "/builder/reports", label: "Reports & Exports", icon: FileSpreadsheet },
    { to: "/builder/ai-insights", label: "AI Insights Hub", icon: Sparkles, badge: "AI" },
  ];

  const supervisorLinks = [
    { to: "/supervisor", label: "Site Home", icon: LayoutDashboard, end: true },
    { to: "/supervisor/ai-workflow", label: "Upload & Check AI Workflow", icon: Sparkles, badge: "AI Vision" },
    { to: "/verification", label: "Labour Verification", icon: ShieldCheck, badge: "Enrol" },
    { to: "/supervisor/attendance", label: "Mark Attendance", icon: UserCheck },
    { to: "/supervisor/work-update", label: "Add Work Update", icon: ClipboardList },
    { to: "/supervisor/photos", label: "Upload Photos", icon: Camera },
    { to: "/supervisor/expenses", label: "Add Expense", icon: Receipt },
  ];

  const labourLinks = [
    { to: "/labour", label: "My Dashboard", icon: LayoutDashboard, end: true },
    { to: "/verification", label: "My Smart ID Card", icon: ShieldCheck, badge: "Smart ID" },
  ];

  const links = role === "supervisor" ? supervisorLinks : role === "labour" ? labourLinks : builderLinks;

  return (
    <>
      {isMobileOpen && (
        <div 
          onClick={closeMobileSidebar}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside className={`
        fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-6">
          <div className="px-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {role === "supervisor" ? "Supervisor Panel" : role === "labour" ? "Labour Portal" : "Builder Portal"}
            </span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/5"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold px-1.5 py-0.5 rounded shadow">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BuildTrack Pro v1.0</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Live Site Management Platform</p>
        </div>
      </aside>
    </>
  );
};
