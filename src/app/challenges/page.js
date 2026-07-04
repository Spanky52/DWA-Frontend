"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function ChallengesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", difficulty: "MEDIUM", durationDays: 30 });
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    fetchData();
  }, [loading, user]);

  const fetchData = async () => {
    setFetching(true);
    try {
      const [allRes, myRes] = await Promise.all([
        fetch(`${API_URL}/api/challenges`, { credentials: "include", headers: { Accept: "application/json" } }),
        fetch(`${API_URL}/api/challenges/my`, { credentials: "include", headers: { Accept: "application/json" } }),
      ]);
      if (allRes.ok) setChallenges(await allRes.json());
      if (myRes.ok) setMyChallenges(await myRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const createChallenge = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/challenges`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create challenge");
      }
      setShowModal(false);
      setForm({ title: "", description: "", difficulty: "MEDIUM", durationDays: 30 });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      const res = await fetch(`${API_URL}/api/challenges/${challengeId}/join`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to join");
        return;
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const advanceProgress = async (challengeId) => {
    try {
      const res = await fetch(`${API_URL}/api/challenges/${challengeId}/progress`, {
        method: "PATCH",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to update progress");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || fetching) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Loading challenges...</p>
        </main>
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 flex justify-between items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Challenges</p>
              <h1 className="mt-3 text-3xl font-semibold">Push your limits with guided challenges.</h1>
            </div>
            <button onClick={() => setShowModal(true)} className="rounded-full bg-indigo-500 px-5 py-3 text-white hover:bg-indigo-400 transition">
              + Create Challenge
            </button>
          </section>

          {/* My Active Challenges */}
          {myChallenges.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">My Active Challenges</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {myChallenges.map((cp) => (
                  <div key={cp.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-lg font-semibold text-indigo-300">{cp.challenge?.title || "Challenge"}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Day {cp.currentDay} / {cp.challenge?.durationDays || 30} – {cp.progress}%
                    </p>
                    <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${cp.progress}%` }}></div>
                    </div>
                    {!cp.completed && (
                      <button onClick={() => advanceProgress(cp.challengeId)} className="mt-4 rounded-full bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400 transition">
                        + 1 Day
                      </button>
                    )}
                    {cp.completed && (
                      <span className="mt-4 inline-block rounded-full border border-green-400/30 px-4 py-2 text-sm text-green-400">
                        Completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Available Challenges */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Available Challenges</h2>
            {challenges.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                No challenges available yet.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{challenge.description}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Difficulty: {challenge.difficulty} · {challenge.durationDays} days
                    </p>
                    <button
                      onClick={() => joinChallenge(challenge.id)}
                      className="mt-4 rounded-full bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400 transition"
                    >
                      Join Challenge
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">New Challenge</p>
                <div className="mt-4 space-y-3">
                  <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                    <input type="number" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Days" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: parseInt(e.target.value) || 30 })} />
                  </div>
                  {error && <p className="text-sm text-rose-400">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={createChallenge} className="flex-1 rounded-2xl bg-indigo-500 px-4 py-3 text-white hover:bg-indigo-400 transition">
                      Create
                    </button>
                    <button onClick={() => setShowModal(false)} className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-slate-300 hover:bg-white/10 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}