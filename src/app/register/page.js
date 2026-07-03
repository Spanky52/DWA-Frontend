"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = await register(form);
    if (result.success) {
      router.push("/login");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <AppShell isPublic>
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-100">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Create account</p>
          <h1 className="mt-3 text-3xl font-semibold">Start your journey</h1>
          <p className="mt-3 text-slate-400">Set up your profile and begin tracking what matters.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-0" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-0" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-0" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-0" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-0" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <button disabled={loading} className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-300">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </AppShell>
  );
}
