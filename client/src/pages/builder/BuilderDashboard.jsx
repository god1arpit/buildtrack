import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { StatCard } from "../../components/StatCard";
import { SiteCard } from "../../components/SiteCard";
import { AddProjectModal } from "../../components/AddProjectModal";
import { AddWorkerModal } from "../../components/AddWorkerModal";
import { AddExpenseModal } from "../../components/AddExpenseModal";
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
  Calendar,
  Receipt,
  UserPlus
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const BuilderDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [expensesData, setExpensesData] = useState(null);
  const [attendanceTrendData, setAttendanceTrendData] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const endDate = today.toISOString().slice(0, 10);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 6);
      const startDate = weekStart.toISOString().slice(0, 10);
      const [sumRes, updatesRes, supRes, expRes, attendanceRes] = await Promise.all([
        api.get("/reports/summary"),
        api.get("/work-updates?limit=4"),
        api.get("/auth/supervisors"),
        api.get("/expenses"),
        api.get("/attendance/history", { params: { startDate, endDate } }),
      ]);
      setSummary(sumRes.data);
      setRecentUpdates(updatesRes.data || []);
      setSupervisors(supRes.data || []);
      setExpensesData(expRes.data);
      const recordsByDate = (attendanceRes.data || []).reduce((groups, record) => {
        (groups[record.date] ||= []).push(record);
        return groups;
      }, {});
      setAttendanceTrendData(Array.from({ length: 7 }, (_, index) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + index);
        const date = day.toISOString().slice(0, 10);
        const records = recordsByDate[date] || [];
        return {
          day: date === endDate ? "Today" : day.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          present: records.filter((record) => record.status === "present" || record.status === "half-day").length,
          total: records.length,
        };
      }));
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Category chart data
  const categoryData = Object.entries(expensesData?.categoryBreakdown || {}).map(([cat, amt]) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    amount: amt,
  }));

  const COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#EC4899", "#8B5CF6", "#06B6D4"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Builder dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Sites, labour, attendance and wages at a glance.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddWorker(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            Add Labour
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            Log Expense
          </button>
          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            New Site
          </button>
        </div>
      </div>

      {/* Road inspection entry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
        <div>
          <h2 className="text-sm font-medium text-white">Road inspection</h2>
          <p className="text-xs text-slate-400 mt-0.5">Upload site media for a prototype road progress estimate.</p>
        </div>
        <Link to="/builder/ai-workflow" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
          Open inspection →
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Active Sites"
          value={summary?.activeProjectsCount ?? 0}
          icon={Building2}
          subtext="Active Projects"
          color="amber"
        />
        <StatCard
          title="Total Labour"
          value={summary?.totalWorkers ?? 0}
          icon={Users}
          subtext="Registered Workers"
          color="blue"
        />
        <StatCard
          title="Today's Turnout"
          value={summary?.todayAttendance ?? "0/0"}
          icon={UserCheck}
          subtext="On-Site Attendance"
          color="emerald"
        />
        <StatCard
          title="Today's Wages"
          value={formatCurrency(summary?.todayWages ?? 0)}
          icon={CircleDollarSign}
          subtext="Daily Accrual"
          color="amber"
        />
        <StatCard
          title="Pending Wages"
          value={formatCurrency(summary?.pendingWages ?? 0)}
          icon={AlertCircle}
          subtext="Unpaid Liabilities"
          color="rose"
        />
        <StatCard
          title="Overall Progress"
          value={`${summary?.overallProgress ?? 0}%`}
          icon={TrendingUp}
          subtext="Average Completion"
          color="purple"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Trends */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Labour Attendance Trend</h3>
              <p className="text-[11px] text-slate-400">Past 7 shifts attendance volume</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              {attendanceTrendData.some((day) => day.total > 0)
                ? `${Math.round(attendanceTrendData.reduce((sum, day) => sum + (day.total ? day.present / day.total : 0), 0) / attendanceTrendData.filter((day) => day.total > 0).length * 100)}% Average Turnout`
                : "No attendance recorded"}
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 20]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                  labelStyle={{ color: "#f8fafc", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="present" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorPresent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Material & Site Expenses Breakdown</h3>
              <p className="text-[11px] text-slate-400">Total expenditure by category</p>
            </div>
            <span className="text-xs font-bold text-amber-400 font-mono">
              {formatCurrency(expensesData?.totalAmount ?? 0)}
            </span>
          </div>
          {categoryData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-xs text-slate-500">No expenses recorded yet</div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip
                    formatter={(val) => formatCurrency(val)}
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    labelStyle={{ color: "#f8fafc", fontWeight: "bold" }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
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
          {(!summary?.projects || summary.projects.length === 0) ? (
            <div className="col-span-full bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Construction Sites Added Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Get started by creating your first construction site. You can assign site supervisors, set milestones, and start tracking live work.
              </p>
              <button
                onClick={() => setShowAddProject(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:opacity-90 inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create First Site / Project</span>
              </button>
            </div>
          ) : (
            summary.projects.map((proj) => (
              <SiteCard key={proj._id} project={proj} />
            ))
          )}
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
                  <span>🏗️ Site Overview</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {summary?.activeProjectsCount > 0
                    ? `${summary.activeProjectsCount} active site${summary.activeProjectsCount === 1 ? "" : "s"} currently tracked.`
                    : "No active sites recorded. Create a site to start tracking project progress."}
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <span>👷 Labour & Attendance</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {summary?.totalWorkers > 0
                    ? `${summary.totalWorkers} labour profile${summary.totalWorkers === 1 ? "" : "s"} in the records; today's turnout is ${summary.todayAttendance}.`
                    : "No labour profiles recorded yet. Add a worker to begin tracking attendance."}
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-rose-500/30">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                  <span>💰 Pending Wage Advisory</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
              {!summary
                    ? "Loading current wage totals..."
                    : summary.pendingWages > 0
                    ? `Unpaid wage liability is ${formatCurrency(summary.pendingWages)} based on recorded attendance and payments.`
                    : "No unpaid wage liability is recorded for this month."}
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

      {showAddWorker && (
        <AddWorkerModal
          projects={summary?.projects || []}
          onClose={() => setShowAddWorker(false)}
          onSuccess={fetchDashboardData}
        />
      )}

      {showAddExpense && (
        <AddExpenseModal
          projects={summary?.projects || []}
          onClose={() => setShowAddExpense(false)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};
