import AppShell from "../components/AppShell";

const tasks = [
  { title: "Plan the week", priority: "High", status: "Pending" },
  { title: "Review notes", priority: "Medium", status: "In Progress" },
  { title: "Prepare tomorrow", priority: "Low", status: "Completed" },
];

export default function TasksPage() {
  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Tasks</p>
            <h1 className="mt-3 text-3xl font-semibold">Organize your work with calm focus.</h1>
          </section>
          <section className="space-y-3">
            {tasks.map((task) => (
              <div key={task.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
                <div>
                  <h2 className="font-semibold">{task.title}</h2>
                  <p className="text-sm text-slate-400">Priority {task.priority}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">{task.status}</span>
              </div>
            ))}
          </section>
        </div>
      </main>
    </AppShell>
  );
}
