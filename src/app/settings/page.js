import AppShell from "../components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Settings</p>
          <h1 className="mt-3 text-3xl font-semibold">Personal preferences</h1>
          <p className="mt-3 text-slate-400">Adjust notifications, focus mode and account preferences.</p>
        </div>
      </main>
    </AppShell>
  );
}
