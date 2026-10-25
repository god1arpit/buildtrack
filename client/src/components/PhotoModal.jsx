import React from "react";
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
