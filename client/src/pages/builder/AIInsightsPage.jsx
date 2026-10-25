import React, { useState, useEffect } from "react";
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
      const res = await api.get(`/ai/insights/${pId}`);
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
