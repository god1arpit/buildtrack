const fs = require("fs");

// 6. LabourDashboard.jsx
fs.writeFileSync("src/pages/labour/LabourDashboard.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { 
  HardHat, 
  Calendar, 
  CircleDollarSign, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { formatCurrency, formatDate, getStatusBadge } from "../../utils/formatters";

export const LabourDashboard = () => {
  const { user } = useAuth();
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        setLoading(true);
        const allWorkers = await api.get("/workers");
        const match = allWorkers.data?.find((w) => w.name.includes("Ramesh")) || allWorkers.data?.[0];
        if (match) {
          const res = await api.get(\`/workers/\${match._id}\`);
          setWorkerData(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [user]);

  if (loading || !workerData) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading your labour portal...</div>;
  }

  const { worker, stats, recentAttendance, payments } = workerData;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
          <HardHat className="w-9 h-9 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
            {worker.skill}
          </span>
          <h1 className="text-2xl font-black text-white mt-1">{worker.name}</h1>
          <p className="text-xs text-slate-400 font-mono">Worker ID: {worker.workerId}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Earned</span>
          <strong className="text-white font-mono text-xl mt-1 block">
            {formatCurrency(stats.totalEarned)}
          </strong>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Paid Amount</span>
          <strong className="text-emerald-400 font-mono text-xl mt-1 block">
            {formatCurrency(stats.totalPaid)}
          </strong>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pending Balance</span>
          <strong className="text-rose-400 font-mono text-xl mt-1 block">
            {formatCurrency(stats.totalPending)}
          </strong>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <span className="text-slate-400 block">Daily Wage Rate</span>
          <strong className="text-amber-400 font-mono text-base mt-0.5 block">{formatCurrency(worker.dailyWage)}/day</strong>
        </div>
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <span className="text-slate-400 block">Total Working Days</span>
          <strong className="text-white font-mono text-base mt-0.5 block">{stats.totalWorkingDays} Days Logged</strong>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white">My Attendance History (Past Shifts)</h3>
        <div className="divide-y divide-slate-800">
          {recentAttendance?.slice(0, 7).map((att) => (
            <div key={att._id} className="py-2.5 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white font-mono">{formatDate(att.date)}</span>
                <span className="text-[11px] text-slate-400 block">{att.checkIn} → {att.checkOut}</span>
              </div>
              <div className="text-right">
                <span className={\`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase \${getStatusBadge(att.status).color}\`}>
                  {getStatusBadge(att.status).label}
                </span>
                {att.overtimeHours > 0 && (
                  <span className="text-amber-400 text-[10px] block font-mono">+{att.overtimeHours}h Overtime</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {payments?.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white">My Payment Receipts</h3>
          <div className="divide-y divide-slate-800">
            {payments.map((p) => (
              <div key={p._id} className="py-2.5 flex justify-between items-center">
                <div>
                  <strong className="text-emerald-400 font-mono text-sm block">{formatCurrency(p.amount)}</strong>
                  <span className="text-[10px] text-slate-400">Via {p.paymentMethod} • {formatDate(p.paymentDate)}</span>
                </div>
                {p.reference && (
                  <span className="text-[10px] text-slate-500 font-mono">{p.reference}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
`, "utf8");

// 7. Login.jsx
fs.writeFileSync("src/pages/Login.jsx", `import React, { useState } from "react";
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

        {/* 1-Click Demo Logins */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block text-center">
            ⚡ Quick 1-Click Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemo("builder")}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 font-semibold text-center flex flex-col items-center gap-1"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Builder</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo("supervisor")}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 font-semibold text-center flex flex-col items-center gap-1"
            >
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>Supervisor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo("labour")}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 font-semibold text-center flex flex-col items-center gap-1"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Labour</span>
            </button>
          </div>
        </div>

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

      </div>
    </div>
  );
};
`, "utf8");

// 8. Register.jsx
fs.writeFileSync("src/pages/Register.jsx", `import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { HardHat, UserPlus } from "lucide-react";

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "builder",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <HardHat className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-slate-400">Register as a Builder, Contractor or Supervisor</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              placeholder="e.g. Arpit Sachdeva"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              placeholder="builder@example.com"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
            >
              <option value="builder">Builder / Contractor (Admin)</option>
              <option value="supervisor">Site Supervisor (Munshi)</option>
              <option value="labour">Labour Worker</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:opacity-90"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account? <Link to="/login" className="text-amber-400 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
`, "utf8");

// 9. App.jsx
fs.writeFileSync("src/App.jsx", `import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// Pages
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { BuilderDashboard } from "./pages/builder/BuilderDashboard";
import { ProjectsPage } from "./pages/builder/ProjectsPage";
import { ProjectDetailPage } from "./pages/builder/ProjectDetailPage";
import { LabourPage } from "./pages/builder/LabourPage";
import { AttendancePage } from "./pages/builder/AttendancePage";
import { WagesPage } from "./pages/builder/WagesPage";
import { ExpensesPage } from "./pages/builder/ExpensesPage";
import { DailyUpdatesPage } from "./pages/builder/DailyUpdatesPage";
import { PhotosPage } from "./pages/builder/PhotosPage";
import { ReportsPage } from "./pages/builder/ReportsPage";
import { AIInsightsPage } from "./pages/builder/AIInsightsPage";

import { SupervisorDashboard } from "./pages/supervisor/SupervisorDashboard";
import { MarkAttendancePage } from "./pages/supervisor/MarkAttendancePage";
import { DailyWorkUpdatePage } from "./pages/supervisor/DailyWorkUpdatePage";
import { UploadPhotosPage } from "./pages/supervisor/UploadPhotosPage";
import { AddExpensePage } from "./pages/supervisor/AddExpensePage";

import { LabourDashboard } from "./pages/labour/LabourDashboard";

export function App() {
  const { user, role, loading } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Initializing BuildTrack Platform...
      </div>
    );
  }

  // Home redirect based on role
  const getHomeRedirect = () => {
    if (!user) return "/login";
    if (role === "supervisor") return "/supervisor";
    if (role === "labour") return "/labour";
    return "/builder";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {user && (
        <Navbar
          toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />
      )}

      <div className="flex flex-1">
        {user && (
          <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={getHomeRedirect()} replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={getHomeRedirect()} replace />} />

            {/* Builder Routes */}
            <Route path="/builder" element={<BuilderDashboard />} />
            <Route path="/builder/projects" element={<ProjectsPage />} />
            <Route path="/builder/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/builder/labour" element={<LabourPage />} />
            <Route path="/builder/attendance" element={<AttendancePage />} />
            <Route path="/builder/wages" element={<WagesPage />} />
            <Route path="/builder/expenses" element={<ExpensesPage />} />
            <Route path="/builder/daily-updates" element={<DailyUpdatesPage />} />
            <Route path="/builder/photos" element={<PhotosPage />} />
            <Route path="/builder/reports" element={<ReportsPage />} />
            <Route path="/builder/ai-insights" element={<AIInsightsPage />} />

            {/* Supervisor Routes */}
            <Route path="/supervisor" element={<SupervisorDashboard />} />
            <Route path="/supervisor/attendance" element={<MarkAttendancePage />} />
            <Route path="/supervisor/work-update" element={<DailyWorkUpdatePage />} />
            <Route path="/supervisor/photos" element={<UploadPhotosPage />} />
            <Route path="/supervisor/expenses" element={<AddExpensePage />} />

            {/* Labour Routes */}
            <Route path="/labour" element={<LabourDashboard />} />

            <Route path="*" element={<Navigate to={getHomeRedirect()} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
`, "utf8");

// 10. main.jsx
fs.writeFileSync("src/main.jsx", `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
`, "utf8");

console.log("All supervisor, labour, auth & app files generated successfully!");
