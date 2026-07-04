"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { login, user, loading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /*
   * Si ya existe una sesión válida,
   * redirigir automáticamente.
   */
  useEffect(() => {
    if (loading) return;

    if (!user) return;

    router.replace(
      user.role === "ADMIN"
        ? "/admin"
        : "/dashboard"
    );
  }, [loading, user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const result = await login(
      form.email,
      form.password
    );

    if (!result.success) {
      setError(result.message);
    }

    setSubmitting(false);
  };

  return (
    <AppShell isPublic>

      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-slate-100">

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">

          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
            Sign in
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Welcome back
          </h1>

          <p className="mt-3 text-slate-400">
            Access your personalized growth space and continue building momentum.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4"
          >

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
            />

            {error && (
              <p className="text-sm text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Signing in..."
                : "Continue"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            New here?{" "}

            <Link
              href="/register"
              className="font-medium text-indigo-300"
            >
              Create account
            </Link>

          </p>

        </div>

      </main>

    </AppShell>
  );
}