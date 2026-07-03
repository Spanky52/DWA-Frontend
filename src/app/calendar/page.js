import AppShell from "../components/AppShell";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Calendar</p>
            <h1 className="mt-3 text-3xl font-semibold">Plan your consistency</h1>
            <p className="mt-3 text-slate-400">Track habits and routines across the week with a calm, visual rhythm.</p>
          </section>

          <section className="grid gap-3 sm:grid-cols-7">
            {days.map((day) => (
              <div key={day} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-sm text-slate-400">{day}</p>
                <p className="mt-2 text-lg font-semibold">✓</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </AppShell>
  );
}
