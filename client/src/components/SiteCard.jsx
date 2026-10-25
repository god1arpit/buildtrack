import React from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { MapPin, ArrowRight } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export const SiteCard = ({ project }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors">
              {project.name}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{project.location}</span>
            </div>
          </div>
          <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">
            {project.status || "Active"}
          </span>
        </div>

        <div className="mt-4">
          <ProgressBar progress={project.overallProgress} label="Site Progress" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Today's attendance</span>
            <span className="text-white font-medium tabular-nums text-sm mt-0.5 block">
              {project.presentToday || 0}/{project.totalWorkers || 0} Present
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Today's wages</span>
            <span className="text-amber-400 font-medium tabular-nums text-sm mt-0.5 block">
              {formatCurrency(project.todayWage || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Pending: <strong className="text-rose-400">{formatCurrency(project.pendingWage || 0)}</strong>
        </span>
        <Link
          to={`/builder/projects/${project._id}`}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn"
        >
          View Site
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
