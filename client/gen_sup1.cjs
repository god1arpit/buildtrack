const fs = require("fs");

// 1. SupervisorDashboard.jsx
fs.writeFileSync("src/pages/supervisor/SupervisorDashboard.jsx", `import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { 
  UserCheck, 
  ClipboardList, 
  Camera, 
  Receipt, 
  MapPin, 
  ArrowRight 
} from "lucide-react";
import { formatDate } from "../../utils/formatters";

export const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [todayAttendanceCount, setTodayAttendanceCount] = useState({ present: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisorData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/projects");
        const projs = res.data || [];
        setProjects(projs);
        if (projs.length > 0) {
          setSelectedProject(projs[0]);
          const todayStr = new Date().toISOString().split("T")[0];
          const attRes = await api.get(\`/attendance/by-date?projectId=\${projs[0]._id}&date=\${todayStr}\`);
          const recs = attRes.data?.records || [];
          const pres = recs.filter((r) => r.attendance.status === "present" || r.attendance.status === "half-day").length;
          setTodayAttendanceCount({ present: pres, total: recs.length });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisorData();
  }, []);

  const handleSelectSite = async (proj) => {
    setSelectedProject(proj);
    const todayStr = new Date().toISOString().split("T")[0];
    const attRes = await api.get(\`/attendance/by-date?projectId=\${proj._id}&date=\${todayStr}\`);
    const recs = attRes.data?.records || [];
    const pres = recs.filter((r) => r.attendance.status === "present" || r.attendance.status === "half-day").length;
    setTodayAttendanceCount({ present: pres, total: recs.length });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 p-6 rounded-3xl text-slate-950 shadow-xl shadow-amber-500/20">
        <span className="text-xs font-bold uppercase tracking-wider bg-slate-950/10 px-2.5 py-1 rounded-full">
          On-Site Supervisor Portal
        </span>
        <h1 className="text-2xl font-black mt-2">Good Morning, {user?.name?.split(" ")[0]}!</h1>
        <p className="text-xs font-semibold text-slate-900/80 mt-0.5">
          Today: {formatDate(new Date())}
        </p>
      </div>

      {projects.length > 1 && (
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 mb-2">Switch Active Site:</label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {projects.map((p) => (
              <button
                key={p._id}
                onClick={() => handleSelectSite(p)}
                className={\`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all \${
                  selectedProject?._id === p._id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }\`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase">Active Site</span>
              <h2 className="text-xl font-black text-white">{selectedProject.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedProject.location}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Progress</span>
              <strong className="text-xl font-bold font-mono text-amber-400">
                {selectedProject.overallProgress}%
              </strong>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Site Tasks</h3>

        <Link
          to={\`/supervisor/attendance?projectId=\${selectedProject?._id || ""}\`}
          className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Mark Daily Attendance</h4>
              <p className="text-xs text-slate-400">
                {todayAttendanceCount.present}/{todayAttendanceCount.total} Workers Logged Today
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to={\`/supervisor/work-update?projectId=\${selectedProject?._id || ""}\`}
          className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ClipboardList className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Add Daily Work Update</h4>
              <p className="text-xs text-slate-400">Log progress, tasks completed & problems</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to={\`/supervisor/photos?projectId=\${selectedProject?._id || ""}\`}
          className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Upload Site Photos</h4>
              <p className="text-xs text-slate-400">Take pictures of progress & material unloading</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to={\`/supervisor/expenses?projectId=\${selectedProject?._id || ""}\`}
          className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Record Site Expense</h4>
              <p className="text-xs text-slate-400">Log cement purchase, transport & snacks</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};
`, "utf8");

// 2. MarkAttendancePage.jsx
fs.writeFileSync("src/pages/supervisor/MarkAttendancePage.jsx", `import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Check, X, Clock, Save, ArrowLeft } from "lucide-react";
import { formatDate, getSkillColor } from "../../utils/formatters";

export const MarkAttendancePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get("projectId") || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const pRes = await api.get("/projects");
        const projs = pRes.data || [];
        setProjects(projs);
        if (!selectedProjectId && projs.length > 0) {
          setSelectedProjectId(projs[0]._id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchInit();
  }, []);

  const fetchAttendanceList = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      const res = await api.get(\`/attendance/by-date?projectId=\${selectedProjectId}&date=\${date}\`);
      const formatted = (res.data?.records || []).map((r) => ({
        workerId: r.worker._id,
        name: r.worker.name,
        code: r.worker.workerId,
        skill: r.worker.skill,
        dailyWage: r.worker.dailyWage,
        status: r.attendance.status || "present",
        overtimeHours: r.attendance.overtimeHours || 0,
        notes: r.attendance.notes || "",
      }));
      setRecords(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceList();
  }, [selectedProjectId, date]);

  const setWorkerStatus = (workerId, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.workerId === workerId ? { ...r, status: newStatus } : r))
    );
  };

  const toggleOvertime = (workerId) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.workerId === workerId
          ? { ...r, overtimeHours: r.overtimeHours > 0 ? 0 : 2 }
          : r
      )
    );
  };

  const markAllPresent = () => {
    setRecords((prev) => prev.map((r) => ({ ...r, status: "present" })));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post("/attendance/mark", {
        projectId: selectedProjectId,
        date,
        records,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = records.filter((r) => r.status === "present" || r.status === "half-day").length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/supervisor")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Supervisor Home
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-white">Mark Labour Attendance</h1>
            <p className="text-xs text-slate-400 mt-0.5">{presentCount}/{records.length} Present Today</p>
          </div>
          <button
            onClick={markAllPresent}
            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold"
          >
            Mark All Present ✓
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Select Site</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {records.map((worker) => (
          <div
            key={worker.workerId}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <strong className="text-base text-white block">{worker.name}</strong>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-mono">{worker.code}</span>
                  <span className={\`px-2 py-0.5 rounded-md border text-[10px] font-medium \${getSkillColor(worker.skill)}\`}>
                    {worker.skill}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleOvertime(worker.workerId)}
                className={\`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all \${
                  worker.overtimeHours > 0
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                    : "bg-slate-950 text-slate-400 border-slate-800"
                }\`}
              >
                {worker.overtimeHours > 0 ? \`+\${worker.overtimeHours}h OT\` : "+ Add OT"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWorkerStatus(worker.workerId, "present")}
                className={\`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 \${
                  worker.status === "present"
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-extrabold"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }\`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Present
              </button>

              <button
                type="button"
                onClick={() => setWorkerStatus(worker.workerId, "half-day")}
                className={\`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 \${
                  worker.status === "half-day"
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-extrabold"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }\`}
              >
                <Clock className="w-4 h-4" />
                Half Day
              </button>

              <button
                type="button"
                onClick={() => setWorkerStatus(worker.workerId, "absent")}
                className={\`py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 \${
                  worker.status === "absent"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 font-extrabold"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }\`}
              >
                <X className="w-4 h-4 stroke-[3]" />
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-2xl shadow-amber-500/40 hover:opacity-95 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5 stroke-[2.5]" />
          {saving ? "Saving Attendance..." : savedSuccess ? "Saved Successfully! ✓" : "SAVE ATTENDANCE NOW"}
        </button>
      </div>
    </div>
  );
};
`, "utf8");

console.log("Supervisor part 1 saved!");
