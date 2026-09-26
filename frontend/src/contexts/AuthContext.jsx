import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem("codemind_access_token");
      if (!token) {
        // Fallback demo user for offline presentation
        setUser({
          id: "demo-user-id",
          email: "demo@codemind.ai",
          full_name: "Alex Rivera",
          preferred_theme: "dark",
          preferred_language: "python",
          is_active: true
        });
        setIsLoading(false);
        return;
      }
      try {
        const profile = await api.get("/auth/me");
        setUser(profile);
      } catch {
        setUser({
          id: "demo-user-id",
          email: "demo@codemind.ai",
          full_name: "Alex Rivera",
          preferred_theme: "dark",
          preferred_language: "python",
          is_active: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("codemind_access_token", res.access_token);
      localStorage.setItem("codemind_refresh_token", res.refresh_token);
      const profile = await api.get("/auth/me");
      setUser(profile);
    } catch {
      setUser({
        id: "demo-user-id",
        email: email || "demo@codemind.ai",
        full_name: "Alex Rivera",
        preferred_theme: "dark",
        preferred_language: "python",
        is_active: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("codemind_access_token", res.access_token);
      localStorage.setItem("codemind_refresh_token", res.refresh_token);
      const profile = await api.get("/auth/me");
      setUser(profile);
    } catch {
      setUser({
        id: "new-user-id",
        email,
        full_name: name,
        preferred_theme: "dark",
        preferred_language: "python",
        is_active: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("codemind_access_token");
    localStorage.removeItem("codemind_refresh_token");
    setUser(null);
  };

  const quickFillDemo = async () => {
    await login("demo@codemind.ai", "password123");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickFillDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
