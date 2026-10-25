import React, { useState, useEffect } from "react";
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
        api.get(`/expenses?${selectedProject ? `projectId=${selectedProject}&` : ""}${selectedCategory !== "all" ? `category=${selectedCategory}` : ""}`),
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
