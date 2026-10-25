import React, { useState, useEffect } from "react";
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

      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Sites Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm ? "No projects match your search query." : "You haven't created any construction sites yet. Click 'Create New Site' to start."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Site</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((proj) => (
            <SiteCard key={proj._id} project={proj} />
          ))}
        </div>
      )}

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
