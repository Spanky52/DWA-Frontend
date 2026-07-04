"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    fetchStats();
  }, [loading, user]);

  const fetchStats = async () => {
    setFetching(true);
    try {
      const [statsRes, weeklyRes] = await Promise.all([
        fetch(`${API_URL}/api/stats/detailed`, { credentials: "include", headers: { Accept: "application/json" } }),
        fetch(`${API_URL}/api/stats/weekly`, { credentials: "include", headers: { Accept: "application/json" } }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (weeklyRes.ok) setWeekly(await weeklyRes.json());
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
          <p>Loading analytics...</p>
        </main>
      </AppShell>
    );
  }

  if (!user) return null;

  const summary = stats?.summary || {};

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Analytics</p>
            <h1 className="mt-3 text-3xl font-semibold">Your performance at a glance</h1>
            <p className="mt-3 text-slate-400">Detailed breakdown of habits, tasks, challenges and more.</p>
          </section>

          {/* Summary Cards */}
          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Active Habits", value: summary.totalHabits ?? 0 },
              { label: "Total Tasks", value: summary.totalTasks ?? 0 },
              { label: "Completed Challenges", value: summary.completedChallenges ?? 0 },
              { label: "Current Streak", value: `${summary.currentStreak ?? 0} days` },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
              </div>
            ))}
          </section>

          {/* Tasks by Status */}
          {stats?.tasks?.byStatus && stats.tasks.byStatus.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Tasks by Status</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                {stats.tasks.byStatus.map((s) => (
                  <div key={s.status} className="rounded-2xl border border-white/10 p-4">
                    <p className="text-sm text-slate-400">{s.status}</p>
                    <p className="text-2xl font-semibold">{s._count.status}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Habit Details */}
          {stats?.habits?.details && stats.habits.details.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Habit Completion Rate (30 days)</h2>
              <div className="space-y-3">
                {stats.habits.details.map((h) => (
                  <div key={h.id} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{h.title}</span>
                    <span className="text-sm text-indigo-300">{h.completionRate}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Active Challenges */}
          {stats?.challenges?.active && stats.challenges.active.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
              <div className="space-y-3">
                {stats.challenges.active.map((cp) => (
                  <div key={cp.id} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{cp.challenge?.title || "Challenge"}</span>
                    <span className="text-sm text-indigo-300">{cp.progress}%</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Journal Mood Distribution */}
          {stats?.journal?.moodDistribution && stats.journal.moodDistribution.length > 0 && (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
              <div className="space-y-3">
                {stats.journal.moodDistribution.map((m) => (
                  <div key={m.mood} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{m.mood || "No mood"}</span>
                    <span className="text-sm text-indigo-300">{m._count.mood} entries</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Weekly Report */}
          {weekly && (
            <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold mb-4">Weekly Report</h2>
              <div className="grid grid-cols-5 gap-4 text-center">
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Score</p>
                  <p className="text-2xl font-semibold text-indigo-300">{weekly.overallScore}%</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Tasks Done</p>
                  <p className="text-2xl font-semibold">{weekly.tasks?.completed ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Habit Rate</p>
                  <p className="text-2xl font-semibold">{weekly.habits?.completionRate ?? 0}%</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Journal</p>
                  <p className="text-2xl font-semibold">{weekly.journal?.entries ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm text-slate-400">Challenges</p>
                  <p className="text-2xl font-semibold">{weekly.challenges?.completed ?? 0}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}