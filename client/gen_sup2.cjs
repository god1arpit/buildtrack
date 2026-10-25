const fs = require("fs");

// 3. DailyWorkUpdatePage.jsx
fs.writeFileSync("src/pages/supervisor/DailyWorkUpdatePage.jsx", `import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { ClipboardList, ArrowLeft, Send } from "lucide-react";

export const DailyWorkUpdatePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get("projectId") || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(72);
  const [completedTasks, setCompletedTasks] = useState("");
  const [issues, setIssues] = useState("");
  const [materialsReceived, setMaterialsReceived] = useState("");
  const [tomorrowPlan, setTomorrowPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const pRes = await api.get("/projects");
        const projs = pRes.data || [];
        setProjects(projs);
        if (!selectedProjectId && projs.length > 0) {
          setSelectedProjectId(projs[0]._id);
          setProgressPercentage(projs[0].overallProgress || 70);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchInit();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) return;

    try {
      setLoading(true);
      await api.post("/work-updates", {
        projectId: selectedProjectId,
        date,
        description,
        progressPercentage: Number(progressPercentage),
        completedTasks,
        issues,
        materialsReceived,
        tomorrowPlan,
      });
      setSavedSuccess(true);
      setTimeout(() => navigate("/supervisor"), 1500);
    } catch (e) {
      console.error(e);
      alert("Failed to submit work update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 text-xs">
      <button
        onClick={() => navigate("/supervisor")}
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Supervisor Home
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white">Daily Construction Progress Report</h1>
          <p className="text-slate-400 mt-0.5">Submit end-of-day site logs to the builder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Select Site</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Report Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">Estimated Site Progress (%)</label>
              <span className="text-amber-400 font-bold font-mono text-sm">{progressPercentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={(e) => setProgressPercentage(e.target.value)}
              className="w-full accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Work Completed Today *</label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. Ground floor north wall brickwork completed up to lintel beam level."
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Completed Tasks Checklist (One per line)</label>
            <textarea
              rows="2"
              value={completedTasks}
              onChange={(e) => setCompletedTasks(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              placeholder="North wall brickwork&#10;RCC column water curing"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Materials Received</label>
            <input
              type="text"
              value={materialsReceived}
              onChange={(e) => setMaterialsReceived(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. 1 truck red bricks (4,000 units) received."
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Problems / Stock Shortage</label>
            <input
              type="text"
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. Cement stock is low (50 bags needed tomorrow)."
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tomorrow's Plan</label>
            <input
              type="text"
              value={tomorrowPlan}
              onChange={(e) => setTomorrowPlan(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. Start first-floor bedroom partitions."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold rounded-2xl text-sm shadow-xl shadow-amber-500/20 hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? "Submitting..." : savedSuccess ? "Report Submitted! ✓" : "SUBMIT DAILY REPORT"}
          </button>
        </form>
      </div>
    </div>
  );
};
`, "utf8");

// 4. UploadPhotosPage.jsx
fs.writeFileSync("src/pages/supervisor/UploadPhotosPage.jsx", `import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Camera, ArrowLeft, Upload } from "lucide-react";

export const UploadPhotosPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get("projectId") || "");
  const [category, setCategory] = useState("progress");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
        if (!selectedProjectId && res.data?.length > 0) {
          setSelectedProjectId(res.data[0]._id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;

    try {
      setLoading(true);
      await api.post("/photos", {
        projectId: selectedProjectId,
        category,
        description,
        imageUrl,
        date: new Date().toISOString().split("T")[0],
      });
      setUploaded(true);
      setTimeout(() => navigate("/supervisor"), 1500);
    } catch (e) {
      console.error(e);
      alert("Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 text-xs">
      <button
        onClick={() => navigate("/supervisor")}
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Supervisor Home
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Upload Site Photo</h1>
            <p className="text-slate-400">Capture visual evidence of site progress & materials</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Construction Site</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Photo Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
            >
              <option value="progress">Work Progress</option>
              <option value="material">Materials Received / Stock</option>
              <option value="issue">Issue / Damage / Blockers</option>
              <option value="general">General Site View</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Photo URL / File Preview</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              placeholder="https://..."
            />
          </div>

          {imageUrl && (
            <div className="h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Photo Notes / Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              placeholder="e.g. North wall brick masonry completed up to lintel beam level."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-purple-500/20 hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Uploading..." : uploaded ? "Uploaded Successfully! ✓" : "SAVE SITE PHOTO"}
          </button>
        </form>
      </div>
    </div>
  );
};
`, "utf8");

// 5. AddExpensePage.jsx
fs.writeFileSync("src/pages/supervisor/AddExpensePage.jsx", `import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Receipt, ArrowLeft, Plus } from "lucide-react";

export const AddExpensePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get("projectId") || "");
  const [category, setCategory] = useState("cement");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data || []);
        if (!selectedProjectId && res.data?.length > 0) {
          setSelectedProjectId(res.data[0]._id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    try {
      setLoading(true);
      await api.post("/expenses", {
        projectId: selectedProjectId,
        category,
        amount: Number(amount),
        description,
        vendor,
        date: new Date().toISOString().split("T")[0],
      });
      setSaved(true);
      setTimeout(() => navigate("/supervisor"), 1500);
    } catch (e) {
      console.error(e);
      alert("Failed to record expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 text-xs">
      <button
        onClick={() => navigate("/supervisor")}
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Supervisor Home
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Record Site Expense</h1>
            <p className="text-slate-400">Log material purchases, transport & petty cash expenses</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Select Construction Site</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              >
                <option value="cement">Cement</option>
                <option value="steel">Steel / Rebar</option>
                <option value="bricks">Bricks / Blocks</option>
                <option value="sand">Sand / Aggregate</option>
                <option value="transport">Transport / Logistics</option>
                <option value="equipment">Equipment Hire</option>
                <option value="other">Other / Snacks / Petty</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono"
                placeholder="e.g. 1500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description / Item Details *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              placeholder="e.g. Emergency 5 bags cement from local supplier"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Vendor / Shop Name</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
              placeholder="e.g. City Building Store"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-2xl text-sm shadow-xl shadow-emerald-500/20 hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {loading ? "Recording..." : saved ? "Expense Saved! ✓" : "SAVE EXPENSE"}
          </button>
        </form>
      </div>
    </div>
  );
};
`, "utf8");

console.log("Supervisor part 2 saved!");
