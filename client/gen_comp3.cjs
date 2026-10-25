const fs = require("fs");

// 8. AddWorkerModal.jsx
fs.writeFileSync("src/components/AddWorkerModal.jsx", `import React, { useState } from "react";
import api from "../api/api";
import { X, UserPlus } from "lucide-react";

export const AddWorkerModal = ({ projects = [], onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    skill: "Mason",
    dailyWage: 800,
    overtimeRate: 100,
    projectId: projects[0]?._id || "",
    emergencyContact: "",
  });
  const [loading, setLoading] = useState(false);

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
    "Supervisor",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/workers", formData);
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to add worker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Add Labour Worker</h3>
            <p className="text-xs text-slate-400">Register new worker profile with daily wage configuration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Trade / Skill *</label>
              <select
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {skills.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Daily Wage (₹) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.dailyWage}
                onChange={(e) => setFormData({ ...formData, dailyWage: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Overtime Rate (₹/hr) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.overtimeRate}
                onChange={(e) => setFormData({ ...formData, overtimeRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Assigned Construction Site</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Floating / General Labour --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.location})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Emergency Contact</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. +91 9811223344"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Save Worker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
`, "utf8");

// 9. AddExpenseModal.jsx
fs.writeFileSync("src/components/AddExpenseModal.jsx", `import React, { useState } from "react";
import api from "../api/api";
import { X, Receipt } from "lucide-react";

export const AddExpenseModal = ({ projectId, projects = [], onClose, onSuccess }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || projects[0]?._id || "");
  const [category, setCategory] = useState("cement");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "cement", label: "Cement" },
    { value: "steel", label: "Steel / Rebar" },
    { value: "bricks", label: "Bricks / Blocks" },
    { value: "sand", label: "Sand / Aggregate" },
    { value: "transport", label: "Transport / Freight" },
    { value: "labour", label: "Direct Labour" },
    { value: "equipment", label: "Equipment / Machine Hire" },
    { value: "electrical", label: "Electrical Conduit & Wire" },
    { value: "plumbing", label: "Plumbing Pipes & Fittings" },
    { value: "other", label: "Other / Petty Cash" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    setLoading(true);
    try {
      await api.post("/expenses", {
        projectId: selectedProjectId,
        category,
        amount: Number(amount),
        description,
        vendor,
        date,
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to record expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Record Site Expense</h3>
            <p className="text-xs text-slate-400">Track raw materials, transport, equipment & petty cash</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!projectId && projects.length > 0 && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select Project *</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Expense Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                placeholder="e.g. 15000"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Description / Items *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. 40 Bags Ultratech PPC Cement"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Vendor / Supplier</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. Gupta Building Materials"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Record Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
`, "utf8");

// 10. AddProjectModal.jsx
fs.writeFileSync("src/components/AddProjectModal.jsx", `import React, { useState } from "react";
import api from "../api/api";
import { X, Building2 } from "lucide-react";

export const AddProjectModal = ({ supervisors = [], onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    location: "",
    description: "",
    budget: 5000000,
    supervisorIds: supervisors[0]?._id ? [supervisors[0]._id] : [],
    startDate: new Date().toISOString().split("T")[0],
    expectedEndDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/projects", formData);
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create Construction Site</h3>
            <p className="text-xs text-slate-400">Initialize a new project with milestones & supervisor assignment</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Project / Site Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. Sharma Residence"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. Mr. Sharma"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location / City *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. Sector 18, Chandigarh"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Budget (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Assign Supervisor</label>
              <select
                value={formData.supervisorIds[0] || ""}
                onChange={(e) => setFormData({ ...formData, supervisorIds: e.target.value ? [e.target.value] : [] })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Select Supervisor --</option>
                {supervisors.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Expected Completion</label>
              <input
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
`, "utf8");

// 11. WageSlipModal.jsx
fs.writeFileSync("src/components/WageSlipModal.jsx", `import React from "react";
import { X, Printer, HardHat } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";

export const WageSlipModal = ({ wage, worker, project, onClose }) => {
  if (!wage || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        <div className="flex justify-between items-center no-print mb-4">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow hover:bg-amber-400 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Wage Slip
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="card-print bg-white text-slate-900 p-6 rounded-2xl border border-slate-300">
          <div className="flex items-center justify-between border-b pb-4 border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <HardHat className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-black tracking-tight text-slate-900">BUILDTRACK</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">Labour Wage Slip & Payment Voucher</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 block">Period: {wage.month}</span>
              <span className="text-[10px] text-slate-500">Generated: {formatDate(new Date())}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-4 text-xs">
            <div>
              <span className="text-slate-500 block">Worker Name:</span>
              <strong className="text-slate-900 font-bold">{worker.name}</strong>
              <span className="text-slate-500 block mt-1">Worker ID: <strong>{worker.workerId}</strong></span>
              <span className="text-slate-500 block">Trade / Skill: <strong>{worker.skill}</strong></span>
            </div>
            <div>
              <span className="text-slate-500 block">Assigned Site:</span>
              <strong className="text-slate-900 font-bold">{project?.name || "Sharma Residence"}</strong>
              <span className="text-slate-500 block mt-1">Daily Wage Rate: <strong>{formatCurrency(worker.dailyWage)}</strong></span>
              <span className="text-slate-500 block">Overtime Rate: <strong>₹{worker.overtimeRate}/hr</strong></span>
            </div>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-hidden my-4 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                <tr>
                  <th className="p-2">Description</th>
                  <th className="p-2 text-center">Days / Hours</th>
                  <th className="p-2 text-right">Rate (₹)</th>
                  <th className="p-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-medium">Full Working Days</td>
                  <td className="p-2 text-center">{wage.workingDays} days</td>
                  <td className="p-2 text-right">{formatCurrency(wage.dailyWageRate)}</td>
                  <td className="p-2 text-right font-mono font-semibold">{formatCurrency(wage.workingDays * wage.dailyWageRate)}</td>
                </tr>
                {wage.halfDays > 0 && (
                  <tr>
                    <td className="p-2 font-medium">Half Days</td>
                    <td className="p-2 text-center">{wage.halfDays} days</td>
                    <td className="p-2 text-right">{formatCurrency(wage.dailyWageRate / 2)}</td>
                    <td className="p-2 text-right font-mono font-semibold">{formatCurrency(wage.halfDays * (wage.dailyWageRate / 2))}</td>
                  </tr>
                )}
                <tr>
                  <td className="p-2 font-medium">Overtime Hours</td>
                  <td className="p-2 text-center">{wage.overtimeHours} hrs</td>
                  <td className="p-2 text-right">{formatCurrency(wage.overtimeRate)}</td>
                  <td className="p-2 text-right font-mono font-semibold">{formatCurrency(wage.overtimeAmount)}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                <tr>
                  <td colSpan="3" className="p-2 text-right">Total Wages:</td>
                  <td className="p-2 text-right font-mono font-bold text-sm text-slate-900">{formatCurrency(wage.totalWage)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="p-2 text-right text-emerald-700">Paid Disbursed:</td>
                  <td className="p-2 text-right font-mono text-emerald-700 font-bold">{formatCurrency(wage.paidAmount)}</td>
                </tr>
                <tr className="bg-amber-50">
                  <td colSpan="3" className="p-2 text-right text-amber-900">Net Pending Balance:</td>
                  <td className="p-2 text-right font-mono font-bold text-amber-900 text-sm">{formatCurrency(wage.pendingAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
`, "utf8");

console.log("Modals part 3 generated!");
