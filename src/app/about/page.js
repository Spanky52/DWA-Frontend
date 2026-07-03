import AppShell from "../components/AppShell";

export default function AboutPage() {
  return (
    <AppShell isPublic>
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-300">About</p>
          <h1 className="mt-3 text-4xl font-semibold">Designed for steady progress and intentional growth.</h1>
          <p className="mt-4 text-lg text-slate-300">
            Unevenness combines structure, reflection and insight into a single experience that helps people build consistency without pressure.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
