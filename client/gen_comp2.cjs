const fs = require("fs");

// 6. PhotoModal.jsx
fs.writeFileSync("src/components/PhotoModal.jsx", `import React from "react";
import { X, Calendar, User } from "lucide-react";
import { formatDate } from "../utils/formatters";

export const PhotoModal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={photo.imageUrl}
            alt={photo.description || "Site Photo"}
            className="w-full h-full object-contain max-h-[65vh]"
          />
        </div>

        <div className="p-5 sm:p-6 bg-slate-900">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              {photo.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(photo.date)}</span>
            </div>
            {photo.uploadedBy && (
              <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                <User className="w-3.5 h-3.5" />
                <span>Uploaded by {photo.uploadedBy.name || "Supervisor"}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-slate-200">{photo.description || "No description provided."}</p>
        </div>
      </div>
    </div>
  );
};
`, "utf8");

// 7. PaymentModal.jsx
fs.writeFileSync("src/components/PaymentModal.jsx", `import React, { useState } from "react";
import api from "../api/api";
import { X, CircleDollarSign } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export const PaymentModal = ({ worker, projectId, wage, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(wage?.pendingAmount || "");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    try {
      await api.post("/payments", {
        workerId: worker._id,
        projectId: projectId || worker.projectId?._id || worker.projectId,
        amount: Number(amount),
        paymentMethod,
        reference,
        notes,
      });
      onSuccess();
      onClose();
    } catch (e) {
      console.error("Payment error:", e);
      alert(e.response?.data?.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Record Wage Payment</h3>
            <p className="text-xs text-slate-400">{worker?.name} ({worker?.workerId})</p>
          </div>
        </div>

        {wage && (
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mb-5 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400 block">Total Earned</span>
              <strong className="text-white font-mono text-sm">{formatCurrency(wage.totalWage)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Paid So Far</span>
              <strong className="text-emerald-400 font-mono text-sm">{formatCurrency(wage.paidAmount)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Pending Balance</span>
              <strong className="text-rose-400 font-mono text-sm">{formatCurrency(wage.pendingAmount)}</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              placeholder="e.g. 5000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Cash", "UPI", "Bank Transfer"].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={\`py-2 text-xs font-semibold rounded-xl border transition-all \${
                    paymentMethod === m
                      ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                  }\`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Transaction Reference / UPI ID
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              placeholder="e.g. UPI/2026/8947291"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              placeholder="e.g. Fortnight advance wage payment"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
`, "utf8");

console.log("PhotoModal and PaymentModal generated!");
