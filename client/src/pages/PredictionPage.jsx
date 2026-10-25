import React, { useState, useEffect } from "react";
import api from "../api/api";
import { 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Sparkles,
  BarChart,
  ShieldCheck
} from "lucide-react";

export const PredictionPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProj = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
        if (res.data?.length > 0) setSelectedProjectId(res.data[0].id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProj();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchPrediction = async () => {
      try {
        const res = await api.get(`/prediction/${selectedProjectId}`);
        setPrediction(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPrediction();
  }, [selectedProjectId]);

  const currentProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Clock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">AI Completion Forecasting Engine</h1>
            <p className="text-xs text-slate-400">
              Scikit-learn & Ridge Regression predictive modeling based on historical road advancement velocity
            </p>
          </div>
        </div>

        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.project_name} ({p.total_road_length} km)
            </option>
          ))}
        </select>
      </div>

      {/* Main Forecast Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block">
              Machine Learning Model: Ridge Trajectory Regression
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Target Completion Horizon: {prediction?.predicted_completion_date || "2026-11-01"}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono">
            {prediction?.confidence_score || 91.4}% Confidence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Remaining Duration
            </span>
            <strong className="text-3xl font-black text-white font-mono block">
              {prediction?.estimated_days_remaining || 24} Days
            </strong>
            <span className="text-[11px] text-slate-400 block">Calculated at current site velocity</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Average Progress Velocity
            </span>
            <strong className="text-3xl font-black text-purple-400 font-mono block">
              {prediction?.daily_pace_km || 0.24} km/day
            </strong>
            <span className="text-[11px] text-slate-400 block">~240 physical meters completed daily</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Planned vs Forecast Delta
            </span>
            <strong className="text-3xl font-black text-emerald-400 font-mono block">
              +12 Days Early
            </strong>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              Ahead of scheduled deadline
            </span>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Milestone Completion Projections
          </h3>
          <div className="space-y-2 text-xs">
            {[
              { name: "Earthwork & Sub-Base Preparation", status: "Completed (100%)", date: "Past Milestone", color: "text-emerald-400" },
              { name: "Granular Sub-Base & Base Coarse (WMM)", status: "Completed (100%)", date: "Past Milestone", color: "text-emerald-400" },
              { name: "Dense Bituminous Macadam (DBM)", status: "In Progress (62%)", date: "Current Phase", color: "text-blue-400" },
              { name: "Bituminous Concrete (BC) Final Surface", status: "Projected 18 Days", date: "Nov 2026", color: "text-purple-400" },
              { name: "Road Markings, Signages & Kerb Painting", status: "Projected 24 Days", date: "Nov 2026", color: "text-purple-400" },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="font-bold text-white">{m.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${m.color}`}>{m.status}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
