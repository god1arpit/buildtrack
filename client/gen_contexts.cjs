const fs = require("fs");

// 1. AuthContext.jsx
fs.writeFileSync("src/context/AuthContext.jsx", `import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("buildtrack_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("buildtrack_token");
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
          localStorage.setItem("buildtrack_user", JSON.stringify(res.data));
        } catch (e) {
          console.error("Auth check failed:", e);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem("buildtrack_token", token);
    localStorage.setItem("buildtrack_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("buildtrack_token");
    localStorage.removeItem("buildtrack_user");
    setUser(null);
  };

  const switchDemoRole = async (role) => {
    let email = "builder@buildtrack.com";
    if (role === "supervisor") email = "supervisor@buildtrack.com";
    if (role === "labour") email = "ramesh.mason@buildtrack.com";

    try {
      const res = await api.post("/auth/login", { email, password: "password123" });
      const { token, ...userData } = res.data;
      localStorage.setItem("buildtrack_token", token);
      localStorage.setItem("buildtrack_user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (e) {
      console.error("Demo switch failed:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchDemoRole, loading, role: user?.role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
`, "utf8");

// 2. NotificationContext.jsx
fs.writeFileSync("src/context/NotificationContext.jsx", `import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.put(\`/notifications/\${id}/read\`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error("Error marking notification read:", e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Error marking all read:", e);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications: fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
`, "utf8");

console.log("Contexts created!");
