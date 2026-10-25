import React, { useState, useEffect } from "react";
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
        api.get(`/attendance/history?date=${selectedDate}${selectedProject ? `&projectId=${selectedProject}` : ""}`),
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
                  <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${getSkillColor(att.workerId?.skill)}`}>
                    {att.workerId?.skill}
                  </span>
                </td>
                <td className="p-3.5 text-slate-300">{att.projectId?.name || "-"}</td>
                <td className="p-3.5 font-mono text-slate-300">{att.checkIn} → {att.checkOut}</td>
                <td className="p-3.5 font-mono text-white">{att.totalHours} hrs</td>
                <td className="p-3.5 font-mono text-amber-400">
                  {att.overtimeHours > 0 ? `+${att.overtimeHours} hrs` : "-"}
                </td>
                <td className="p-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getStatusBadge(att.status).color}`}>
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
