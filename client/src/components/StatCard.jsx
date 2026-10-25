import React from "react";

export const StatCard = ({ title, value, icon: Icon, subtext, trend, color = "amber" }) => {
  const colorMap = {
    amber: "text-amber-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    rose: "text-rose-400",
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <h3 className="text-2xl font-semibold text-white mt-2 tracking-tight tabular-nums">
            {value}
          </h3>
        </div>
        <div className={`p-2 rounded-lg bg-slate-800/70 ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      {(subtext || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-400">{subtext}</span>}
          {trend && (
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
