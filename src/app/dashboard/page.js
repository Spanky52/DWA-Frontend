"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const stats = [
  { label: "Consistency", value: "82%" },
  { label: "Tasks done", value: "14" },
  { label: "Habits active", value: "6" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-100">
          <p className="text-sm text-slate-400">Checking your session...</p>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold">Good morning, {user.firstName || user.email}.</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              You have completed 78% of your weekly goals. Today’s focus is consistency over intensity.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Today&apos;s Progress</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>✔ Morning Workout</li>
                <li>✔ Read 20 pages</li>
                <li>○ Meditation</li>
                <li>○ Drink Water</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <h2 className="text-xl font-semibold">Current Streak</h2>
              <p className="mt-3 text-4xl font-semibold text-indigo-300">18 days</p>
              <p className="mt-2 text-sm text-slate-400">Weekly focus: consistency over intensity.</p>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
