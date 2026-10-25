import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { FileSpreadsheet, Download, Printer, Users, CircleDollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const ReportsPage = () => {
  const [reportType, setReportType] = useState("attendance");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [wageReport, setWageReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      if (reportType === "attendance") {
        const res = await api.get(`/reports/attendance?month=${selectedMonth}`);
        setAttendanceReport(res.data?.report || []);
      } else {
        const res = await api.get(`/reports/wages?month=${selectedMonth}`);
        setWageReport(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [reportType, selectedMonth]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audit Reports & Export Center</h1>
          <p className="text-xs text-slate-400 mt-1">Generate official printable attendance registers and wage disbursement ledgers</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow hover:bg-amber-400"
        >
          <Printer className="w-4 h-4" />
          Print / PDF Export
        </button>
      </div>

      <div className="flex gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 no-print">
        <button
          onClick={() => setReportType("attendance")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === "attendance" ? "bg-amber-500 text-slate-950 font-extrabold" : "text-slate-400 hover:text-white"
          }`}
        >
          Labour Attendance Register
        </button>
        <button
          onClick={() => setReportType("wages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === "wages" ? "bg-amber-500 text-slate-950 font-extrabold" : "text-slate-400 hover:text-white"
          }`}
        >
          Labour Wage & Payout Ledger
        </button>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="ml-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
        />
      </div>

      {/* Report Table Card */}
      <div className="card-print bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-xs">
        <div className="border-b border-slate-800 pb-4 mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">
              {reportType === "attendance" ? "Monthly Labour Attendance Summary Register" : "Monthly Labour Wage Statement"}
            </h2>
            <p className="text-slate-400">Statement Period: {selectedMonth}</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">BuildTrack Verified Audit</span>
        </div>

        {reportType === "attendance" ? (
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Worker Name</th>
                <th className="p-3">Trade</th>
                <th className="p-3">Site</th>
                <th className="p-3 text-center">Present</th>
                <th className="p-3 text-center">Half Days</th>
                <th className="p-3 text-center">Absent</th>
                <th className="p-3 text-center">OT Hours</th>
                <th className="p-3 text-right">Est. Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {attendanceReport.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{r.name} ({r.workerId})</td>
                  <td className="p-3 text-slate-300">{r.skill}</td>
                  <td className="p-3 text-slate-400">{r.projectName}</td>
                  <td className="p-3 text-center font-mono text-emerald-400">{r.presentDays}</td>
                  <td className="p-3 text-center font-mono text-amber-400">{r.halfDays}</td>
                  <td className="p-3 text-center font-mono text-rose-400">{r.absentDays}</td>
                  <td className="p-3 text-center font-mono text-slate-300">{r.totalOvertime}h</td>
                  <td className="p-3 text-right font-mono font-bold text-white">{formatCurrency(r.totalEarned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Worker</th>
                <th className="p-3">Site</th>
                <th className="p-3 text-right">Basic Wage</th>
                <th className="p-3 text-right">Overtime</th>
                <th className="p-3 text-right">Total Accrued</th>
                <th className="p-3 text-right">Paid Disbursed</th>
                <th className="p-3 text-right">Net Pending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {wageReport?.records?.map((w, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{w.workerId?.name} ({w.workerId?.workerId})</td>
                  <td className="p-3 text-slate-400">{w.projectId?.name}</td>
                  <td className="p-3 text-right font-mono text-slate-300">{formatCurrency(w.basicWage)}</td>
                  <td className="p-3 text-right font-mono text-amber-400">{formatCurrency(w.overtimeAmount)}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">{formatCurrency(w.totalWage)}</td>
                  <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(w.paidAmount)}</td>
                  <td className="p-3 text-right font-mono font-bold text-rose-400">{formatCurrency(w.pendingAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
