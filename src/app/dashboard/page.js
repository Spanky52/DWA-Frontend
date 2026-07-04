"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/prisma/dashboard`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load dashboard");
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchDashboard();
  }, [loading, user, router]);

  if (loading || fetching) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Loading session...</p>
        </main>
      </AppShell>
    );
  }

  if (!user) return null;

  const stats = dashboard?.stats || {};
  const today = dashboard?.todayProgress || { completed: 0, total: 0 };
  const habits = dashboard?.habits || [];
  const tasks = dashboard?.tasks || [];
  const challenge = dashboard?.challenge;
  const journal = dashboard?.journal;
  const notifications = dashboard?.notifications || [];

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold">
              Good morning, {user.firstName || user.email}.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              You have completed {today.completed} of {today.total} habits today.
              Weekly consistency: {stats.weeklyCompletion ?? 0}%.
            </p>
          </section>

          {/* Stats cards */}
          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Weekly Completion", value: `${stats.weeklyCompletion ?? 0}%` },
              { label: "Tasks Completed", value: stats.tasksCompletedThisWeek ?? 0 },
              { label: "Active Habits", value: stats.habitsCount ?? 0 },
              { label: "Current Streak", value: `${stats.currentStreak ?? 0} days` },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
              </div>
            ))}
          </section>

          {/* Habits and Tasks */}
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Active Habits</h2>
              {habits.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">No active habits yet.</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {habits.map((habit) => (
                    <li key={habit.id} className="flex justify-between">
                      <span>{habit.title}</span>
                      <span className="text-indigo-300">{habit.streak ?? 0} day streak</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
              {tasks.length === 0 ? (
                <p className="mt-2 text-sm text-slate-400">No tasks scheduled.</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  {tasks.map((task) => (
                    <li key={task.id} className="flex justify-between">
                      <span>{task.title}</span>
                      <span className={`text-xs rounded-full border px-2 py-0.5 ${
                        task.status === "COMPLETED" ? "border-green-400 text-green-400" :
                        task.status === "IN_PROGRESS" ? "border-amber-400 text-amber-400" :
                        "border-slate-400 text-slate-400"
                      }`}>{task.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Challenges and Journal */}
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold">Active Challenge</h2>
              {challenge ? (
                <div className="mt-3">
                  <p className="text-lg font-semibold text-indigo-300">{challenge.challenge?.title || "Challenge"}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Day {challenge.currentDay} / {challenge.challenge?.durationDays || 30} – {challenge.progress}%
                  </p>
                  <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${challenge.progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-400">No active challenge. Join one to start!</p>
              )}
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold">Latest Journal</h2>
              {journal ? (
                <div className="mt-3">
                  <p className="text-sm text-indigo-300">{journal.title}</p>
                  <p className="mt-1 text-sm text-slate-400 line-clamp-3">{journal.content}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(journal.date).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-400">No journal entries yet.</p>
              )}
            </div>
          </section>

          {/* Notifications */}
          {notifications.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {notifications.map((n) => (
                  <li key={n.id} className="flex justify-between border-b border-white/5 pb-2">
                    <span>{n.title}</span>
                    <span className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}