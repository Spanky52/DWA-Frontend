"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const buildUrl = (path) => `${API_URL}${path}`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await fetch(buildUrl('/api/auth/me'), {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(buildUrl('/api/auth/login'), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Unable to sign in" };
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      return { success: false, message: "Unable to connect to the server" };
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch(buildUrl('/api/auth/register'), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "Unable to create account" };
      }

      return { success: true, user: data.user };
    } catch {
      return { success: false, message: "Unable to connect to the server" };
    }
  };

  const logout = async () => {
    try {
      await fetch(buildUrl('/api/auth/logout'), {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore and clear local state
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, refresh: fetchUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
