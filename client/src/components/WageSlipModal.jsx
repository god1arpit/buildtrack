import React from "react";
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
