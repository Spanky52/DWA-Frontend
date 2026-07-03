"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const sections = ["Overview", "Users", "Challenges", "Habit Templates", "Reports", "Logs", "Settings"];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }

    if (!loading && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-100">
          <p className="text-sm text-slate-400">Checking permissions...</p>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold">Platform administration</h1>
            <p className="mt-3 text-slate-400">This area is reserved for administrators and remains separate from the personal experience.</p>
          </section>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <div key={section} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">{section}</h2>
                <p className="mt-2 text-sm text-slate-400">Administrative controls and reporting tools.</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </AppShell>
  );
}
