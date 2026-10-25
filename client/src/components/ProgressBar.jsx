import React from "react";

export const ProgressBar = ({ progress = 0, size = "md", showLabel = true, label = "" }) => {
  const percentage = Math.min(100, Math.max(0, Number(progress) || 0));

  const heightMap = {
    sm: "h-2",
    md: "h-3.5",
    lg: "h-5",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
          <span className="text-slate-300">{label || "Overall Progress"}</span>
          <span className="text-amber-400 font-mono">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-0.5 ${heightMap[size]}`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-500 ease-out shadow-sm shadow-amber-500/50"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
