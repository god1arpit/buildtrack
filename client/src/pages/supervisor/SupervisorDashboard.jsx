import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { 
  UserCheck, 
  ClipboardList, 
  Camera, 
  Receipt, 
  MapPin, 
  ArrowRight,
  Ruler
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
          const attRes = await api.get(`/attendance/by-date?projectId=${projs[0]._id}&date=${todayStr}`);
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
    const attRes = await api.get(`/attendance/by-date?projectId=${proj._id}&date=${todayStr}`);
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
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedProject?._id === p._id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                    : "bg-slate-950 text-slate-400 hover:text-white"
                }`}
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
          to={`/supervisor/measure-road?projectId=${selectedProject?._id || ""}`}
          className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 border border-emerald-500/30 hover:border-emerald-400/60 rounded-2xl transition-all shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Ruler className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Measure Road Length</h4>
              <p className="text-xs text-slate-400">Record a GPS trace along the road centerline</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to={`/supervisor/ai-workflow?projectId=${selectedProject?._id || ""}`}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/15 via-slate-900 to-blue-500/15 hover:border-amber-400 border border-amber-500/40 rounded-2xl transition-all shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
              <Camera className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">Upload Images & Check AI Workflow</h4>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/30">
                  AI Vision
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Drone/site photo detection: road progress, count workers & machinery, verify workflow
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to={`/supervisor/attendance?projectId=${selectedProject?._id || ""}`}
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
          to={`/supervisor/work-update?projectId=${selectedProject?._id || ""}`}
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
          to={`/supervisor/photos?projectId=${selectedProject?._id || ""}`}
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
          to={`/supervisor/expenses?projectId=${selectedProject?._id || ""}`}
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
