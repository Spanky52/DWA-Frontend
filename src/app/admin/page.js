"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    fetchAdminData();
  }, [loading, user, router]);

  const fetchAdminData = async () => {
    setFetching(true);
    try {
      const [overviewRes, usersRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/overview`, { credentials: "include", headers: { Accept: "application/json" } }),
        fetch(`${API_URL}/api/admin/users`, { credentials: "include", headers: { Accept: "application/json" } }),
        fetch(`${API_URL}/api/admin/logs`, { credentials: "include", headers: { Accept: "application/json" } }),
      ]);
      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  if (loading || fetching) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Checking permissions...</p>
        </main>
      </AppShell>
    );
  }

  if (!user || user.role !== "ADMIN") return null;

  const tabs = ["overview", "users", "logs"];

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold">Platform administration</h1>
            <p className="mt-3 text-slate-400">This area is reserved for administrators.</p>
          </section>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                  activeTab === tab
                    ? "bg-indigo-500 text-white"
                    : "border border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && overview && (
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Total Users</p>
                <p className="mt-2 text-3xl font-semibold">{overview.users}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Admin Logs</p>
                <p className="mt-2 text-3xl font-semibold">{overview.logs}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">Admins</p>
                <p className="mt-2 text-3xl font-semibold">{users.filter((u) => u.role === "ADMIN").length}</p>
              </div>
            </section>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">All Users</h2>
              <table className="w-full text-sm text-left">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Streak</th>
                    <th className="py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">{u.firstName} {u.lastName}</td>
                      <td className="py-3 px-4">{u.username}</td>
                      <td className="py-3 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${
                          u.role === "ADMIN" ? "border-indigo-400 text-indigo-400" : "border-slate-400 text-slate-400"
                        }`}>{u.role}</span>
                      </td>
                      <td className="py-3 px-4">{u.streak}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Admin Logs</h2>
              <table className="w-full text-sm text-left">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Admin ID</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-slate-400">{log.adminId}</td>
                      <td className="py-3 px-4">{log.action}</td>
                      <td className="py-3 px-4 text-slate-400">{log.description || "-"}</td>
                      <td className="py-3 px-4 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}