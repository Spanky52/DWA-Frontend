import AppShell from "../components/AppShell";

export default function AnalyticsPage() {
  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Analytics</p>
            <h1 className="mt-3 text-3xl font-semibold">Monthly completion</h1>
            <p className="mt-3 text-slate-400">Habits 82%, Tasks 76%, Challenges 91%.</p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
