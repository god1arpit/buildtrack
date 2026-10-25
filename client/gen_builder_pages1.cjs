const fs = require("fs");

// 1. BuilderDashboard.jsx
fs.writeFileSync("src/pages/builder/BuilderDashboard.jsx", `import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { StatCard } from "../../components/StatCard";
import { SiteCard } from "../../components/SiteCard";
import { AddProjectModal } from "../../components/AddProjectModal";
import { 
  Building2, 
  Users, 
  UserCheck, 
  CircleDollarSign, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  Sparkles,
  ClipboardList,
  Calendar
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const BuilderDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, updatesRes, supRes] = await Promise.all([
        api.get("/reports/summary"),
        api.get("/work-updates?limit=4"),
        api.get("/auth/supervisors"),
      ]);
      setSummary(sumRes.data);
      setRecentUpdates(updatesRes.data || []);
      setSupervisors(supRes.data || []);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-3xl border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Central Site Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Builder Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time multi-site labour attendance, wage liabilities, and construction progress updates.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            New Construction Site
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Active Sites"
          value={summary?.activeProjectsCount || 0}
          icon={Building2}
          subtext="Total Construction Sites"
          color="amber"
        />
        <StatCard
          title="Total Labour"
          value={summary?.totalWorkers || 0}
          icon={Users}
          subtext="Registered Workers"
          color="blue"
        />
        <StatCard
          title="Today's Turnout"
          value={summary?.todayAttendance || "0/0"}
          icon={UserCheck}
          subtext="Present on sites today"
          color="emerald"
        />
        <StatCard
          title="Today's Wages"
          value={formatCurrency(summary?.todayWages || 0)}
          icon={CircleDollarSign}
          subtext="Daily Wage Accrual"
          color="amber"
        />
        <StatCard
          title="Pending Wages"
          value={formatCurrency(summary?.pendingWages || 0)}
          icon={AlertCircle}
          subtext="Unpaid Labour Liabilities"
          color="rose"
        />
        <StatCard
          title="Overall Progress"
          value={\`\${summary?.overallProgress || 0}%\`}
          icon={TrendingUp}
          subtext="Across All Projects"
          color="purple"
        />
      </div>

      {/* Construction Sites Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Construction Projects</h2>
            <p className="text-xs text-slate-400">Live operational milestones and attendance per site</p>
          </div>
          <Link
            to="/builder/projects"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {summary?.projects?.map((proj) => (
            <SiteCard key={proj._id} project={proj} />
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Daily Reports & AI Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Daily Work Updates */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Recent Daily Work Updates</h3>
                <p className="text-xs text-slate-400">Supervisor reports & milestone logs</p>
              </div>
            </div>
            <Link
              to="/builder/daily-updates"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              All Reports →
            </Link>
          </div>

          <div className="space-y-4">
            {recentUpdates.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-8">No daily updates submitted yet</p>
            ) : (
              recentUpdates.map((update) => (
                <div
                  key={update._id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">{update.projectId?.name || "Project"}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 font-medium">By {update.supervisorId?.name || "Supervisor"}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                      {formatDate(update.date)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-200 leading-relaxed">{update.description}</p>

                  {update.aiSummary && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-200/90 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-400 font-semibold block text-[10px] uppercase tracking-wider">AI Executive Brief</strong>
                        {update.aiSummary}
                      </div>
                    </div>
                  )}

                  {update.issues && (
                    <div className="text-[11px] text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                      ⚠️ Bottleneck / Stock Shortage: {update.issues}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: AI Insights Quick Widget */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Smart Site Intelligence</span>
            </div>
            <h3 className="text-base font-bold text-white">AI Site Insights</h3>
            <p className="text-xs text-slate-400 mt-1">
              Predictive risk analysis & inventory alerts across active construction sites.
            </p>

            <div className="space-y-3 mt-5 text-xs">
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <span>🚨 Cement Stock Alert</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Sharma Residence reported cement inventory down to 8 bags. Supply replenishment of 50 bags required by tomorrow morning.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <span>⚡ Verma Villa Progress On Track</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  81% completion rate achieved. Master bedroom internal plaster sponge finish completed ahead of scheduled target.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-rose-500/30">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                  <span>💰 Pending Wage Advisory</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Total unpaid wage liability stands at {formatCurrency(summary?.pendingWages || 0)}. Disbursing fortnight advances will stabilize labour attendance.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/builder/ai-insights"
            className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs text-center border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Open Full AI Insights Center
          </Link>
        </div>

      </div>

      {showAddProject && (
        <AddProjectModal
          supervisors={supervisors}
          onClose={() => setShowAddProject(false)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};
`, "utf8");

// 2. ProjectsPage.jsx
fs.writeFileSync("src/pages/builder/ProjectsPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { SiteCard } from "../../components/SiteCard";
import { AddProjectModal } from "../../components/AddProjectModal";
import { Plus, Search, Building2 } from "lucide-react";

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [sumRes, supRes] = await Promise.all([
        api.get("/reports/summary"),
        api.get("/auth/supervisors"),
      ]);
      setProjects(sumRes.data?.projects || []);
      setSupervisors(supRes.data || []);
    } catch (e) {
      console.error("Projects fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Construction Projects & Sites</h1>
          <p className="text-xs text-slate-400 mt-1">Manage active, planned and completed construction sites</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Create New Site
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search site by name, city or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="planned">Planned</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((proj) => (
          <SiteCard key={proj._id} project={proj} />
        ))}
      </div>

      {showAddModal && (
        <AddProjectModal
          supervisors={supervisors}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchProjects}
        />
      )}
    </div>
  );
};
`, "utf8");

// 3. ProjectDetailPage.jsx
fs.writeFileSync("src/pages/builder/ProjectDetailPage.jsx", `import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";
import { ProgressBar } from "../../components/ProgressBar";
import { PhotoModal } from "../../components/PhotoModal";
import { AddWorkerModal } from "../../components/AddWorkerModal";
import { AddExpenseModal } from "../../components/AddExpenseModal";
import { 
  Building2, 
  MapPin, 
  Users, 
  CircleDollarSign, 
  Calendar, 
  Camera, 
  Receipt, 
  ClipboardList, 
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  ArrowLeft
} from "lucide-react";
import { formatCurrency, formatDate, getSkillColor, getStatusBadge } from "../../utils/formatters";

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [insights, setInsights] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [activeTab, setActiveTab] = useState("milestones");
  const [loading, setLoading] = useState(true);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split("T")[0];
      const [statsRes, workersRes, attRes, expRes, photoRes, updatesRes, insightsRes] = await Promise.all([
        api.get(\`/projects/\${id}/stats\`),
        api.get(\`/workers?projectId=\${id}\`),
        api.get(\`/attendance/by-date?projectId=\${id}&date=\${todayStr}\`),
        api.get(\`/expenses?projectId=\${id}\`),
        api.get(\`/photos?projectId=\${id}\`),
        api.get(\`/work-updates?projectId=\${id}\`),
        api.get(\`/ai/insights/\${id}\`),
      ]);

      setStats(statsRes.data);
      setWorkers(workersRes.data || []);
      setAttendance(attRes.data?.records || []);
      setExpenses(expRes.data?.expenses || []);
      setPhotos(photoRes.data || []);
      setUpdates(updatesRes.data || []);
      setInsights(insightsRes.data?.insights || []);
    } catch (e) {
      console.error("Project details fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  if (loading || !stats) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading project details...</div>;
  }

  const { project } = stats;

  return (
    <div className="space-y-6 pb-16">
      {/* Back Link */}
      <Link to="/builder/projects" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to All Projects
      </Link>

      {/* Project Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full uppercase">
                {project.status}
              </span>
              <span className="text-xs text-slate-400">Client: <strong className="text-white">{project.client}</strong></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{project.name}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{project.location}</span>
              <span className="text-slate-600">•</span>
              <span>Start: {formatDate(project.startDate)}</span>
            </div>
          </div>

          <div className="lg:w-80 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <ProgressBar progress={project.overallProgress} label="Overall Completion" size="md" />
          </div>
        </div>

        {/* 4 Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">👷 Labour Active</span>
            <strong className="text-white font-mono text-base mt-0.5 block">{stats.totalWorkers} Workers</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">✅ Today's Present</span>
            <strong className="text-emerald-400 font-mono text-base mt-0.5 block">{stats.presentToday} Present</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">💰 Today's Wages</span>
            <strong className="text-amber-400 font-mono text-base mt-0.5 block">{formatCurrency(stats.todayWages)}</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 block text-[11px]">🧾 Total Expenses</span>
            <strong className="text-blue-400 font-mono text-base mt-0.5 block">{formatCurrency(stats.totalExpenses)}</strong>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: "milestones", label: "Milestones & Progress" },
          { id: "labour", label: \`Labour & Attendance (\${workers.length})\` },
          { id: "updates", label: \`Daily Updates (\${updates.length})\` },
          { id: "photos", label: \`Site Photos (\${photos.length})\` },
          { id: "expenses", label: \`Expenses (\${expenses.length})\` },
          { id: "ai", label: "AI Insights" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={\`pb-3 px-3 transition-colors border-b-2 whitespace-nowrap \${
              activeTab === tab.id
                ? "border-amber-500 text-amber-400 font-bold"
                : "border-transparent text-slate-400 hover:text-white"
            }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Milestones */}
      {activeTab === "milestones" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Construction Stage Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.milestones?.map((m, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{m.name}</span>
                  <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase \${
                    m.progress === 100 ? "bg-emerald-500/20 text-emerald-400" : m.progress > 0 ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400"
                  }\`}>
                    {m.progress === 100 ? "Completed ✓" : m.progress > 0 ? "In Progress" : "Pending"}
                  </span>
                </div>
                <ProgressBar progress={m.progress} showLabel={true} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Labour on Site */}
      {activeTab === "labour" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Workers Assigned to Site</h3>
            <button
              onClick={() => setShowAddWorker(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Labour
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Worker</th>
                  <th className="p-3.5">Skill / Trade</th>
                  <th className="p-3.5">Daily Wage</th>
                  <th className="p-3.5">Overtime Rate</th>
                  <th className="p-3.5">Today's Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {attendance.map((rec) => (
                  <tr key={rec.worker._id} className="hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <strong className="text-white block">{rec.worker.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.worker.workerId}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={\`px-2 py-0.5 rounded-md border text-[11px] font-medium \${getSkillColor(rec.worker.skill)}\`}>
                        {rec.worker.skill}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-white">{formatCurrency(rec.worker.dailyWage)}/day</td>
                    <td className="p-3.5 font-mono text-slate-300">₹{rec.worker.overtimeRate}/hr</td>
                    <td className="p-3.5">
                      <span className={\`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase \${getStatusBadge(rec.attendance.status).color}\`}>
                        {rec.attendance.status} {rec.attendance.overtimeHours > 0 ? \`(\${rec.attendance.overtimeHours}h OT)\` : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Daily Updates */}
      {activeTab === "updates" && (
        <div className="space-y-4">
          {updates.map((up) => (
            <div key={up._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-400 font-mono">{formatDate(up.date)}</span>
                <span className="text-slate-400">By {up.supervisorId?.name || "Supervisor"}</span>
              </div>
              <p className="text-slate-200">{up.description}</p>
              {up.aiSummary && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-200 text-[11px]">
                  <strong>AI Daily Brief:</strong> {up.aiSummary}
                </div>
              )}
              {up.completedTasks?.length > 0 && (
                <div>
                  <strong className="text-slate-400 block mb-1">Tasks Completed:</strong>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {up.completedTasks.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Photos */}
      {activeTab === "photos" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div
              key={p._id}
              onClick={() => setSelectedPhoto(p)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group cursor-pointer hover:border-amber-500/50 transition-all"
            >
              <div className="h-40 overflow-hidden bg-slate-950">
                <img src={p.imageUrl} alt="Site" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">{p.category}</span>
                <p className="text-slate-300 truncate mt-0.5">{p.description || "Site Photo"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Expenses */}
      {activeTab === "expenses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Recorded Expenses</h3>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Expense
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Vendor</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium uppercase text-[10px]">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-200">{exp.description}</td>
                    <td className="p-3.5 text-slate-400">{exp.vendor || "-"}</td>
                    <td className="p-3.5 text-slate-400 font-mono">{formatDate(exp.date)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-white">{formatCurrency(exp.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: AI Insights */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Project Health & Predictive Insights
          </h3>
          <div className="grid grid-cols-1 gap-4 text-xs">
            {insights.map((ins, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">{ins.title}</h4>
                  <p className="text-slate-300 mt-1 leading-relaxed">{ins.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
      {showAddWorker && <AddWorkerModal projects={[project]} onClose={() => setShowAddWorker(false)} onSuccess={fetchProjectData} />}
      {showAddExpense && <AddExpenseModal projectId={project._id} onClose={() => setShowAddExpense(false)} onSuccess={fetchProjectData} />}
    </div>
  );
};
`, "utf8");

console.log("Builder pages part 1 generated!");
