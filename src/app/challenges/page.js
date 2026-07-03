import AppShell from "../components/AppShell";

export default function ChallengesPage() {
  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Challenges</p>
          <h1 className="mt-3 text-3xl font-semibold">30-Day Discipline Challenge</h1>
          <p className="mt-3 text-slate-400">Day 12 / 30 • Progress 40% • Today’s objective: wake up before 7:00 AM.</p>
        </div>
      </main>
    </AppShell>
  );
}
