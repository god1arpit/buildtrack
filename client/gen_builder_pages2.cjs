const fs = require("fs");

// 4. LabourPage.jsx
fs.writeFileSync("src/pages/builder/LabourPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { AddWorkerModal } from "../../components/AddWorkerModal";
import { Plus, Search, Filter, Phone, MapPin, HardHat, CircleDollarSign } from "lucide-react";
import { formatCurrency, getSkillColor } from "../../utils/formatters";

export const LabourPage = () => {
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const [wRes, pRes] = await Promise.all([
        api.get("/workers"),
        api.get("/projects"),
      ]);
      setWorkers(wRes.data || []);
      setProjects(pRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const skills = [
    "Mason",
    "Carpenter",
    "Painter",
    "Plumber",
    "Electrician",
    "Bar Bender",
    "Tiles Mason",
    "Helper",
    "Welder",
  ];

  const filtered = workers.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.phone && w.phone.includes(searchTerm));
    const matchesSkill = skillFilter === "all" || w.skill === skillFilter;
    const matchesProject = projectFilter === "all" || (w.projectId && (w.projectId._id === projectFilter || w.projectId === projectFilter));
    return matchesSearch && matchesSkill && matchesProject;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Labour Management Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Manage all construction workers, skills, daily rates & site assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Labour Worker
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search worker by name, ID or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Skills / Trades</option>
          {skills.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Sites</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((worker) => (
          <div
            key={worker._id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors">{worker.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block">{worker.workerId}</span>
                </div>
                <span className={\`px-2.5 py-0.5 rounded-full border text-[11px] font-medium \${getSkillColor(worker.skill)}\`}>
                  {worker.skill}
                </span>
              </div>

              <div className="space-y-2 mt-4 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{worker.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{worker.projectId?.name || "Floating / General"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Daily Wage</span>
                  <strong className="text-white font-mono text-xs">{formatCurrency(worker.dailyWage)}/d</strong>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Overtime Rate</span>
                  <strong className="text-amber-400 font-mono text-xs">₹{worker.overtimeRate}/hr</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddWorkerModal
          projects={projects}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchWorkers}
        />
      )}
    </div>
  );
};
`, "utf8");

// 5. AttendancePage.jsx
fs.writeFileSync("src/pages/builder/AttendancePage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Calendar, Search, Filter, Download } from "lucide-react";
import { formatDate, getSkillColor, getStatusBadge } from "../../utils/formatters";

export const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const [attRes, pRes] = await Promise.all([
        api.get(\`/attendance/history?date=\${selectedDate}\${selectedProject ? \`&projectId=\${selectedProject}\` : ""}\`),
        api.get("/projects"),
      ]);
      setAttendance(attRes.data || []);
      setProjects(pRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedProject]);

  const presentCount = attendance.filter((a) => a.status === "present" || a.status === "half-day").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;
  const overtimeCount = attendance.filter((a) => (a.overtimeHours || 0) > 0).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Daily Labour Attendance Master</h1>
          <p className="text-xs text-slate-400 mt-1">Live daily attendance records and check-in/out logs across sites</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Attendance Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
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
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <span className="text-slate-400 block">Total Present</span>
          <strong className="text-emerald-400 font-mono text-lg">{presentCount} Workers</strong>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <span className="text-slate-400 block">Total Absent</span>
          <strong className="text-rose-400 font-mono text-lg">{absentCount} Workers</strong>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <span className="text-slate-400 block">Clocked Overtime</span>
          <strong className="text-amber-400 font-mono text-lg">{overtimeCount} Workers</strong>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Worker</th>
              <th className="p-3.5">Skill</th>
              <th className="p-3.5">Site</th>
              <th className="p-3.5">Check-In / Out</th>
              <th className="p-3.5">Hours</th>
              <th className="p-3.5">Overtime</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {attendance.map((att) => (
              <tr key={att._id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <strong className="text-white block">{att.workerId?.name}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">{att.workerId?.workerId}</span>
                </td>
                <td className="p-3.5">
                  <span className={\`px-2 py-0.5 rounded-md border text-[11px] font-medium \${getSkillColor(att.workerId?.skill)}\`}>
                    {att.workerId?.skill}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300">{att.projectId?.name || "-"}</td>
                <td className="p-3.5 font-mono text-slate-300">{att.checkIn} → {att.checkOut}</td>
                <td className="p-3.5 font-mono text-white">{att.totalHours} hrs</td>
                <td className="p-3.5 font-mono text-amber-400">
                  {att.overtimeHours > 0 ? \`+\${att.overtimeHours} hrs\` : "-"}
                </td>
                <td className="p-3.5">
                  <span className={\`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase \${getStatusBadge(att.status).color}\`}>
                    {getStatusBadge(att.status).label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
`, "utf8");

// 6. WagesPage.jsx
fs.writeFileSync("src/pages/builder/WagesPage.jsx", `import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { PaymentModal } from "../../components/PaymentModal";
import { WageSlipModal } from "../../components/WageSlipModal";
import { CircleDollarSign, Calendar, RefreshCw, FileText, CheckCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const WagesPage = () => {
  const [wagesData, setWagesData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [selectedWorkerForPay, setSelectedWorkerForPay] = useState(null);
  const [selectedWageForSlip, setSelectedWageForSlip] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWages = async () => {
    try {
      setLoading(true);
      const [wRes, pRes] = await Promise.all([
        api.get(\`/wages/project?month=\${selectedMonth}\${selectedProject ? \`&projectId=\${selectedProject}\` : ""}\`),
        api.get("/projects"),
      ]);
      setWagesData(wRes.data);
      setProjects(pRes.data || []);
      if (!selectedProject && pRes.data?.length > 0) {
        setSelectedProject(pRes.data[0]._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWages();
  }, [selectedMonth, selectedProject]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Wage Calculation & Labour Payouts</h1>
          <p className="text-xs text-slate-400 mt-1">Automated wage calculations: Basic wage + Overtime - Deductions</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Wage Period (Month)</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Construction Site</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-400 block uppercase font-medium text-[10px]">Total Accrued Wages</span>
          <strong className="text-white font-mono text-2xl mt-1 block">
            {formatCurrency(wagesData?.totalWageSum || 0)}
          </strong>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-400 block uppercase font-medium text-[10px]">Total Disbursed Paid</span>
          <strong className="text-emerald-400 font-mono text-2xl mt-1 block">
            {formatCurrency(wagesData?.totalPaidSum || 0)}
          </strong>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-slate-400 block uppercase font-medium text-[10px]">Net Pending Liabilities</span>
          <strong className="text-rose-400 font-mono text-2xl mt-1 block">
            {formatCurrency(wagesData?.totalPendingSum || 0)}
          </strong>
        </div>
      </div>

      {/* Wages Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3.5">Worker</th>
              <th className="p-3.5">Days Worked</th>
              <th className="p-3.5">Overtime</th>
              <th className="p-3.5">Basic Wage</th>
              <th className="p-3.5">Total Earned</th>
              <th className="p-3.5">Paid</th>
              <th className="p-3.5">Pending</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {wagesData?.wages?.map((w) => (
              <tr key={w._id} className="hover:bg-slate-800/40">
                <td className="p-3.5">
                  <strong className="text-white block">{w.workerId?.name}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">{w.workerId?.workerId} ({w.workerId?.skill})</span>
                </td>
                <td className="p-3.5 font-mono text-white">
                  {w.workingDays} full {w.halfDays > 0 ? \`+ \${w.halfDays} half\` : ""}
                </td>
                <td className="p-3.5 font-mono text-amber-400">{w.overtimeHours} hrs</td>
                <td className="p-3.5 font-mono text-slate-300">{formatCurrency(w.basicWage)}</td>
                <td className="p-3.5 font-mono font-bold text-white">{formatCurrency(w.totalWage)}</td>
                <td className="p-3.5 font-mono text-emerald-400">{formatCurrency(w.paidAmount)}</td>
                <td className="p-3.5 font-mono font-bold text-rose-400">{formatCurrency(w.pendingAmount)}</td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => setSelectedWageForSlip(w)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold"
                  >
                    Slip
                  </button>
                  {w.pendingAmount > 0 && (
                    <button
                      onClick={() => setSelectedWorkerForPay({ worker: w.workerId, wage: w })}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-bold shadow"
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWorkerForPay && (
        <PaymentModal
          worker={selectedWorkerForPay.worker}
          projectId={selectedProject}
          wage={selectedWorkerForPay.wage}
          onClose={() => setSelectedWorkerForPay(null)}
          onSuccess={fetchWages}
        />
      )}

      {selectedWageForSlip && (
        <WageSlipModal
          wage={selectedWageForSlip}
          worker={selectedWageForSlip.workerId}
          project={selectedWageForSlip.projectId}
          onClose={() => setSelectedWageForSlip(null)}
        />
      )}
    </div>
  );
};
`, "utf8");

console.log("Builder pages part 2 generated!");
