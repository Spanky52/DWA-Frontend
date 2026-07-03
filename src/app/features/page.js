import AppShell from "../components/AppShell";

const features = [
  {
    title: "Habit Tracker",
    description: "Create meaningful habits and monitor your daily consistency with a calm, focused experience.",
    icon: "🟢",
  },
  {
    title: "Task Manager",
    description: "Stay organized with priorities, deadlines and smart planning for every week.",
    icon: "🟡",
  },
  {
    title: "Guided Challenges",
    description: "Work through structured programs designed to improve discipline and momentum.",
    icon: "🔵",
  },
  {
    title: "Personal Journal",
    description: "Capture emotions, reflections and the story of your progress throughout the day.",
    icon: "🟣",
  },
  {
    title: "Analytics",
    description: "Visualize streaks, completion rates and long-term improvements with clarity.",
    icon: "🟠",
  },
];

export default function FeaturesPage() {
  return (
    <AppShell isPublic>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_45%),linear-gradient(135deg,_#020617,_#111827)] px-6 py-16 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-10">
          <section className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">Features</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Everything you need to grow with intention.</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-300">
              Unevenness brings habits, tasks, journaling and challenges into one focused experience that feels personal and practical.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-3xl">{feature.icon}</p>
                <h2 className="mt-4 text-xl font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </AppShell>
  );
}
