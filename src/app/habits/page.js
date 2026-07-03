import AppShell from "../components/AppShell";

const habits = [
  { title: "Morning Workout", streak: 18, percent: 83, today: true },
  { title: "Read 20 Pages", streak: 41, percent: 92, today: true },
  { title: "Meditation", streak: 12, percent: 71, today: false },
];

export default function HabitsPage() {
  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Habits</p>
            <h1 className="mt-3 text-3xl font-semibold">Build consistency without pressure.</h1>
          </section>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {habits.map((habit) => (
              <div key={habit.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-lg font-semibold">{habit.title}</h2>
                <p className="mt-2 text-sm text-slate-400">Current streak {habit.streak} days</p>
                <p className="mt-4 text-3xl font-semibold">{habit.percent}%</p>
                <p className="mt-2 text-sm text-slate-400">{habit.today ? "Completed today" : "Pending today"}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </AppShell>
  );
}
