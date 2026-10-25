const fs = require("fs");

// 7. ExpensesPage.jsx
fs.writeFileSync("src/pages/builder/ExpensesPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { AddExpenseModal } from "../../components/AddExpenseModal";
import { Plus, Receipt, Search, Filter } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const ExpensesPage = () => {
  const [expensesData, setExpensesData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const [expRes, pRes] = await Promise.all([
        api.get(\`/expenses?\${selectedProject ? \`projectId=\${selectedProject}&\` : ""}\${selectedCategory !== "all" ? \`category=\${selectedCategory}\` : ""}\`),
        api.get("/projects"),
      ]);
      setExpensesData(expRes.data);
      setProjects(pRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedProject, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Site Expenses & Material Vouchers</h1>
          <p className="text-xs text-slate-400 mt-1">Track raw materials (cement, steel, sand, bricks), equipment & logistics</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Record Site Expense
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Filter by Site</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Construction Sites</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Expense Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            <option value="cement">Cement</option>
            <option value="steel">Steel / Rebar</option>
            <option value="bricks">Bricks / Blocks</option>
            <option value="sand">Sand / Aggregate</option>
            <option value="transport">Transport / Logistics</option>
            <option value="equipment">Equipment Hire</option>
          </select>
        </div>
      </div>

      {/* Total Amount Badge */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Total Site Expenditures</span>
          <h2 className="text-3xl font-extrabold text-white font-mono mt-1">
            {formatCurrency(expensesData?.totalAmount || 0)}
          </h2>
        </div>
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
          <Receipt className="w-8 h-8" />
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Site</th>
              <th className="p-3.5">Vendor</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {expensesData?.expenses?.map((exp) => (
              <tr key={exp._id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold uppercase text-[10px] border border-slate-700">
                    {exp.category}
                  </span>
                </td>
                <td className="p-3.5 text-slate-200">{exp.description}</td>
                <td className="p-3.5 text-slate-300">{exp.projectId?.name || "-"}</td>
                <td className="p-3.5 text-slate-400">{exp.vendor || "-"}</td>
                <td className="p-3.5 text-slate-400 font-mono">{formatDate(exp.date)}</td>
                <td className="p-3.5 text-right font-mono font-bold text-white text-sm">
                  {formatCurrency(exp.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddExpenseModal
          projects={projects}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchExpenses}
        />
      )}
    </div>
  );
};
`, "utf8");

// 8. DailyUpdatesPage.jsx
fs.writeFileSync("src/pages/builder/DailyUpdatesPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { ClipboardList, Sparkles, AlertTriangle, Calendar, User, ArrowRight } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const DailyUpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/work-updates");
      setUpdates(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Supervisor Daily Reports & Field Logs</h1>
        <p className="text-xs text-slate-400 mt-1">Timeline of on-site operations, tasks completed, materials, and AI summaries</p>
      </div>

      <div className="space-y-5">
        {updates.map((update) => (
          <div
            key={update._id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="font-extrabold text-amber-400 text-base">{update.projectId?.name}</span>
                <span className="text-slate-500 mx-2">•</span>
                <span className="text-slate-400">{update.projectId?.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-slate-300 font-mono">
                  {formatDate(update.date)}
                </span>
                <span className="text-slate-400 font-medium">By {update.supervisorId?.name || "Supervisor"}</span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">{update.description}</p>

            {update.aiSummary && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 font-bold block text-xs uppercase tracking-wider mb-0.5">
                    AI Daily Executive Briefing
                  </strong>
                  <p className="text-xs leading-relaxed">{update.aiSummary}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              {update.completedTasks?.length > 0 && (
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  <strong className="text-slate-300 block mb-1.5 font-semibold">🔨 Key Tasks Completed:</strong>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    {update.completedTasks.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {update.materialsReceived && (
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  <strong className="text-slate-300 block mb-1 font-semibold">📦 Materials Received:</strong>
                  <p className="text-slate-400">{update.materialsReceived}</p>
                </div>
              )}

              {update.tomorrowPlan && (
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  <strong className="text-slate-300 block mb-1 font-semibold">📅 Tomorrow's Agenda:</strong>
                  <p className="text-slate-400">{update.tomorrowPlan}</p>
                </div>
              )}
            </div>

            {update.issues && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-400 font-medium">
                ⚠️ Blockers / Shortages: {update.issues}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
`, "utf8");

// 9. PhotosPage.jsx
fs.writeFileSync("src/pages/builder/PhotosPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { PhotoModal } from "../../components/PhotoModal";
import { Camera, Calendar, Filter } from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activePhoto, setActivePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const [phRes, pRes] = await Promise.all([
        api.get(\`/photos?\${selectedProject ? \`projectId=\${selectedProject}&\` : ""}\${selectedCategory !== "all" ? \`category=\${selectedCategory}\` : ""}\`),
        api.get("/projects"),
      ]);
      setPhotos(phRes.data || []);
      setProjects(pRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [selectedProject, selectedCategory]);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Construction Site Photo Gallery</h1>
        <p className="text-xs text-slate-400 mt-1">Visual evidence of progress, deliveries, quality inspections & site issues</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Filter by Site</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">All Sites</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Photo Categories</option>
            <option value="progress">Work Progress</option>
            <option value="material">Materials Received</option>
            <option value="issue">Issues & Bottlenecks</option>
            <option value="general">General Site Views</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo._id}
            onClick={() => setActivePhoto(photo)}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group cursor-pointer hover:border-amber-500/60 transition-all shadow-lg flex flex-col justify-between"
          >
            <div className="h-44 overflow-hidden bg-slate-950 relative">
              <img
                src={photo.imageUrl}
                alt={photo.description || "Site Photo"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-950/80 text-amber-400 backdrop-blur-sm border border-slate-700">
                {photo.category}
              </span>
            </div>

            <div className="p-3 text-xs space-y-1">
              <span className="font-bold text-white block truncate">{photo.projectId?.name}</span>
              <p className="text-slate-300 line-clamp-2 text-[11px]">{photo.description || "No description provided."}</p>
              <span className="text-[10px] text-slate-500 block pt-1">{formatDate(photo.date)}</span>
            </div>
          </div>
        ))}
      </div>

      {activePhoto && <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />}
    </div>
  );
};
`, "utf8");

// 10. ReportsPage.jsx
fs.writeFileSync("src/pages/builder/ReportsPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FileSpreadsheet, Download, Printer, Users, CircleDollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const ReportsPage = () => {
  const [reportType, setReportType] = useState("attendance");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [wageReport, setWageReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      if (reportType === "attendance") {
        const res = await api.get(\`/reports/attendance?month=\${selectedMonth}\`);
        setAttendanceReport(res.data?.report || []);
      } else {
        const res = await api.get(\`/reports/wages?month=\${selectedMonth}\`);
        setWageReport(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportType, selectedMonth]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audit Reports & Export Center</h1>
          <p className="text-xs text-slate-400 mt-1">Generate official printable attendance registers and wage disbursement ledgers</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow hover:bg-amber-400"
        >
          <Printer className="w-4 h-4" />
          Print / PDF Export
        </button>
      </div>

      <div className="flex gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 no-print">
        <button
          onClick={() => setReportType("attendance")}
          className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
            reportType === "attendance" ? "bg-amber-500 text-slate-950 font-extrabold" : "text-slate-400 hover:text-white"
          }\`}
        >
          Labour Attendance Register
        </button>
        <button
          onClick={() => setReportType("wages")}
          className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
            reportType === "wages" ? "bg-amber-500 text-slate-950 font-extrabold" : "text-slate-400 hover:text-white"
          }\`}
        >
          Labour Wage & Payout Ledger
        </button>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="ml-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
        />
      </div>

      {/* Report Table Card */}
      <div className="card-print bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-xs">
        <div className="border-b border-slate-800 pb-4 mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">
              {reportType === "attendance" ? "Monthly Labour Attendance Summary Register" : "Monthly Labour Wage Statement"}
            </h2>
            <p className="text-slate-400">Statement Period: {selectedMonth}</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">BuildTrack Verified Audit</span>
        </div>

        {reportType === "attendance" ? (
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Worker Name</th>
                <th className="p-3">Trade</th>
                <th className="p-3">Site</th>
                <th className="p-3 text-center">Present</th>
                <th className="p-3 text-center">Half Days</th>
                <th className="p-3 text-center">Absent</th>
                <th className="p-3 text-center">OT Hours</th>
                <th className="p-3 text-right">Est. Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attendanceReport.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{r.name} ({r.workerId})</td>
                  <td className="p-3 text-slate-300">{r.skill}</td>
                  <td className="p-3 text-slate-400">{r.projectName}</td>
                  <td className="p-3 text-center font-mono text-emerald-400">{r.presentDays}</td>
                  <td className="p-3 text-center font-mono text-amber-400">{r.halfDays}</td>
                  <td className="p-3 text-center font-mono text-rose-400">{r.absentDays}</td>
                  <td className="p-3 text-center font-mono text-slate-300">{r.totalOvertime}h</td>
                  <td className="p-3 text-right font-mono font-bold text-white">{formatCurrency(r.totalEarned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Worker</th>
                <th className="p-3">Site</th>
                <th className="p-3 text-right">Basic Wage</th>
                <th className="p-3 text-right">Overtime</th>
                <th className="p-3 text-right">Total Accrued</th>
                <th className="p-3 text-right">Paid Disbursed</th>
                <th className="p-3 text-right">Net Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {wageReport?.records?.map((w, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{w.workerId?.name} ({w.workerId?.workerId})</td>
                  <td className="p-3 text-slate-400">{w.projectId?.name}</td>
                  <td className="p-3 text-right font-mono text-slate-300">{formatCurrency(w.basicWage)}</td>
                  <td className="p-3 text-right font-mono text-amber-400">{formatCurrency(w.overtimeAmount)}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">{formatCurrency(w.totalWage)}</td>
                  <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(w.paidAmount)}</td>
                  <td className="p-3 text-right font-mono font-bold text-rose-400">{formatCurrency(w.pendingAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
`, "utf8");

// 11. AIInsightsPage.jsx
fs.writeFileSync("src/pages/builder/AIInsightsPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Sparkles, Bot, AlertTriangle, CheckCircle2, TrendingUp, RefreshCw } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const AIInsightsPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
        if (res.data?.length > 0) {
          setSelectedProject(res.data[0]._id);
          fetchInsights(res.data[0]._id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  const fetchInsights = async (pId) => {
    try {
      const res = await api.get(\`/ai/insights/\${pId}\`);
      setInsights(res.data?.insights || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedProject) return;
    try {
      setLoadingSummary(true);
      const res = await api.post("/ai/daily-summary", {
        projectId: selectedProject,
        date: selectedDate,
      });
      setGeneratedSummary(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
          <Sparkles className="w-7 h-7 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Daily Summary & Site Insights</h1>
          <p className="text-xs text-slate-400 mt-0.5">Automated executive summaries, delay forecast & inventory alert generation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* On-Demand AI Daily Summary Generator */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>On-Demand Daily Summary Generator</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select Construction Site</label>
              <select
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  fetchInsights(e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.location})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={loadingSummary}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loadingSummary ? "Analyzing Site Logs..." : "Generate AI Daily Brief"}
            </button>
          </div>

          {generatedSummary && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200 mt-4 space-y-2 animate-fadeIn">
              <strong className="text-amber-400 font-bold block text-sm">
                Generated Executive Summary ({generatedSummary.projectName})
              </strong>
              <p className="leading-relaxed">{generatedSummary.summary}</p>
            </div>
          )}
        </div>

        {/* Predictive Site Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Predictive Site Intelligence</span>
          </div>

          <div className="space-y-3">
            {insights.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No active alerts for this site.</p>
            ) : (
              insights.map((ins, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{ins.title}</h4>
                    <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">{ins.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
`, "utf8");

console.log("Builder pages part 3 generated!");
