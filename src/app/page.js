import Link from "next/link";
import AppShell from "./components/AppShell";

const features = [
  {
    title: "Habit Tracker",
    description: "Create meaningful habits and monitor daily consistency without friction.",
  },
  {
    title: "Task Manager",
    description: "Keep your week organized with priorities, deadlines and calm planning.",
  },
  {
    title: "Guided Challenges",
    description: "Follow structured programs designed to build discipline and momentum.",
  },
  {
    title: "Personal Journal",
    description: "Capture thoughts, emotions and reflections in one private space.",
  },
  {
    title: "Analytics",
    description: "Track progress, streaks and completion rates over time.",
  },
];

const testimonials = [
  { name: "Sarah M.", quote: "Unevenness became the center of my daily routine." },
  { name: "Daniel R.", quote: "Finally an app where habits, tasks and journaling work together." },
];

export default function Home() {
  return (
    <AppShell isPublic>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_transparent_45%),linear-gradient(135deg,_#020617,_#111827)] px-6 py-16 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">Unevenness</p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Build a better version of yourself, one day at a time.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Unevenness is an all-in-one personal growth platform that helps you build habits, organize your work, complete guided challenges, reflect through journaling and measure your progress.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="rounded-full bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-400">Get Started</Link>
                <Link href="/login" className="rounded-full border border-white/20 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/10">Sign In</Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Today’s focus</p>
                <h2 className="mt-2 text-2xl font-semibold">Consistency over intensity</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li>✔ Morning workout</li>
                  <li>✔ Read 20 pages</li>
                  <li>○ Meditation</li>
                  <li>○ Plan the week</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Why Unevenness?</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {[
                "Build discipline",
                "Improve consistency",
                "Understand your habits",
                "Reduce procrastination",
                "Measure real progress",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">{item}</div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-lg text-slate-200">“{testimonial.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-indigo-300">{testimonial.name}</p>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-white/10 bg-indigo-500/10 p-8 text-center">
            <h2 className="text-3xl font-semibold">Start building your best self today.</h2>
            <Link href="/register" className="mt-6 inline-flex rounded-full bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-400">Create Account</Link>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
