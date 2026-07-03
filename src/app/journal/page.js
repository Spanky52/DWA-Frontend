import AppShell from "../components/AppShell";

export default function JournalPage() {
  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Journal</p>
            <h1 className="mt-3 text-3xl font-semibold">Today’s Reflection</h1>
            <p className="mt-3 text-slate-400">How are you feeling today? Write your thoughts and capture the tone of the day.</p>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <textarea className="min-h-48 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-sm text-slate-200 outline-none" placeholder="Write your thoughts..." />
          </section>
        </div>
      </main>
    </AppShell>
  );
}
