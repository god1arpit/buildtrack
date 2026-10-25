import React, { useState, useEffect } from "react";
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
        api.get(`/wages/project?month=${selectedMonth}${selectedProject ? `&projectId=${selectedProject}` : ""}`),
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
                  {w.workingDays} full {w.halfDays > 0 ? `+ ${w.halfDays} half` : ""}
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
