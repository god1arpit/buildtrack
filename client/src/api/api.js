import axios from "axios";

// API base URLs are env-driven so the same code works in every setup:
//  - Local dev (Vite proxy): leave unset -> "/api" and "/ai-api"
//  - APK / production: set VITE_API_URL to the hosted backend URL at
//    build time, e.g. https://buildtrack-server.onrender.com/api
//    (VITE_AI_API_URL likewise for the FastAPI AI service, if hosted).
const API_BASE = import.meta.env.VITE_API_URL || "/api";
const AI_API_BASE = import.meta.env.VITE_AI_API_URL || "/ai-api";

// Express BuildTrack Base Client (port 5000 via proxy /api)
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("road_ai_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// FastAPI Computer Vision AI Client (port 8000 via proxy /ai-api)
export const aiApi = axios.create({
  baseURL: AI_API_BASE,
  timeout: 60000,
});

aiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("road_ai_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper services for AI Vision & Workflow
export const uploadAIInference = async (formData) => {
  const res = await aiApi.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const previewRoadMask = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await aiApi.post("/road-mask-preview", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });
  return res.data;
};

export const measureRoadUnderConstruction = async (formData) => {
  const res = await aiApi.post("/road-measure", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return res.data;
};

export const fetchAIDashboard = async (projectId = "default") => {
  const res = await aiApi.get(`/dashboard/${projectId}`);
  return res.data;
};

export const fetchAIAnalytics = async (projectId = "default") => {
  const res = await aiApi.get(`/analytics/${projectId}`);
  return res.data;
};

export const fetchAIPrediction = async (projectId = "default") => {
  const res = await aiApi.get(`/prediction/${projectId}`);
  return res.data;
};

export const fetchAIProgress = async (projectId = "default") => {
  const res = await aiApi.get(`/progress/${projectId}`);
  return res.data;
};

export const fetchAIReports = async (projectId = "default") => {
  const res = await aiApi.get(`/reports/${projectId}`);
  return res.data;
};

export const createAIReport = async (projectId = "default", payload = {}) => {
  const res = await aiApi.post(`/reports/${projectId}`, payload);
  return res.data;
};

export default api;
