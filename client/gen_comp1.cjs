const fs = require("fs");

// 1. Navbar.jsx
fs.writeFileSync("src/components/Navbar.jsx", `import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { 
  HardHat, 
  Bell, 
  LogOut, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown,
  Building2,
  Menu,
  X
} from "lucide-react";

export const Navbar = ({ toggleMobileSidebar, isMobileSidebarOpen }) => {
  const { user, logout, switchDemoRole, role } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = async (targetRole) => {
    await switchDemoRole(targetRole);
    if (targetRole === "builder") navigate("/builder");
    else if (targetRole === "supervisor") navigate("/supervisor");
    else if (targetRole === "labour") navigate("/labour");
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Build<span className="text-amber-400">Track</span>
              </span>
              <span className="text-[10px] block font-medium tracking-widest uppercase text-slate-400 -mt-1">
                Site & Labour Hub
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium px-2.5">Demo Mode:</span>
          <button
            onClick={() => handleRoleChange("builder")}
            className={\`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 \${
              role === "builder"
                ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }\`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Builder
          </button>
          <button
            onClick={() => handleRoleChange("supervisor")}
            className={\`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 \${
              role === "supervisor"
                ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }\`}
          >
            <HardHat className="w-3.5 h-3.5" />
            Supervisor (Munshi)
          </button>
          <button
            onClick={() => handleRoleChange("labour")}
            className={\`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 \${
              role === "labour"
                ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30 font-bold"
                : "text-slate-400 hover:text-white"
            }\`}
          >
            <User className="w-3.5 h-3.5" />
            Labour (Ramesh)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => markAsRead(n._id)}
                        className={\`p-3.5 hover:bg-slate-800/50 cursor-pointer transition-colors \${
                          !n.read ? "bg-amber-500/5" : ""
                        }\`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.type === "absentee" || n.type === "delay_alert" ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              <img
                src={user?.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"}
                alt="Profile"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-500/50"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[110px]">
                  {user?.name?.split(" ")[0]}
                </span>
                <span className="text-[10px] font-medium uppercase text-amber-400 tracking-wider">
                  {user?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2">
                <div className="p-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 p-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
`, "utf8");

// 2. Sidebar.jsx
fs.writeFileSync("src/components/Sidebar.jsx", `import React from "react";
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
  UserCheck
} from "lucide-react";

export const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const { role } = useAuth();

  const builderLinks = [
    { to: "/builder", label: "Dashboard", icon: LayoutDashboard, end: true },
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
    { to: "/supervisor/attendance", label: "Mark Attendance", icon: UserCheck },
    { to: "/supervisor/work-update", label: "Add Work Update", icon: ClipboardList },
    { to: "/supervisor/photos", label: "Upload Photos", icon: Camera },
    { to: "/supervisor/expenses", label: "Add Expense", icon: Receipt },
  ];

  const labourLinks = [
    { to: "/labour", label: "My Dashboard", icon: LayoutDashboard, end: true },
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

      <aside className={\`
        fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300
        \${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      \`}>
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
                    \`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all \${
                      isActive
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/5"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }\`
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
`, "utf8");

// 3. StatCard.jsx
fs.writeFileSync("src/components/StatCard.jsx", `import React from "react";

export const StatCard = ({ title, value, icon: Icon, subtext, trend, color = "amber" }) => {
  const colorMap = {
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30",
    rose: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight font-mono">
            {value}
          </h3>
        </div>
        <div className={\`p-3 rounded-xl bg-gradient-to-br border \${colorMap[color]} shadow-inner\`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(subtext || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-400">{subtext}</span>}
          {trend && (
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
`, "utf8");

// 4. ProgressBar.jsx
fs.writeFileSync("src/components/ProgressBar.jsx", `import React from "react";

export const ProgressBar = ({ progress = 0, size = "md", showLabel = true, label = "" }) => {
  const percentage = Math.min(100, Math.max(0, Number(progress) || 0));

  const heightMap = {
    sm: "h-2",
    md: "h-3.5",
    lg: "h-5",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
          <span className="text-slate-300">{label || "Overall Progress"}</span>
          <span className="text-amber-400 font-mono">{percentage}%</span>
        </div>
      )}
      <div className={\`w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-0.5 \${heightMap[size]}\`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-500 ease-out shadow-sm shadow-amber-500/50"
          style={{ width: \`\${percentage}%\` }}
        />
      </div>
    </div>
  );
};
`, "utf8");

// 5. SiteCard.jsx
fs.writeFileSync("src/components/SiteCard.jsx", `import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { MapPin, ArrowRight } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export const SiteCard = ({ project }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
              {project.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{project.location}</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {project.status || "Active"}
          </span>
        </div>

        <div className="mt-5">
          <ProgressBar progress={project.overallProgress} label="Site Progress" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">👷 Today's Attendance</span>
            <span className="text-white font-bold font-mono text-sm mt-0.5 block">
              {project.presentToday || 0}/{project.totalWorkers || 0} Present
            </span>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">💰 Today's Wages</span>
            <span className="text-amber-400 font-bold font-mono text-sm mt-0.5 block">
              {formatCurrency(project.todayWage || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Pending: <strong className="text-rose-400">{formatCurrency(project.pendingWage || 0)}</strong>
        </span>
        <Link
          to={\`/builder/projects/\${project._id}\`}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn"
        >
          View Site
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
`, "utf8");

console.log("Core components part 1 saved!");
