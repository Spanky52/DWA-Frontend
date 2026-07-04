"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function HabitsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [habits, setHabits] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", category: "", frequency: "DAILY", goal: 1, color: "", icon: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    fetchHabits();
  }, [loading, user]);

  const fetchHabits = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_URL}/api/habits`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to load habits");
      const data = await res.json();
      setHabits(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const openCreate = () => {
    setEditMode(null);
    setForm({ title: "", description: "", category: "", frequency: "DAILY", goal: 1, color: "", icon: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (habit) => {
    setEditMode(habit.id);
    setForm({
      title: habit.title,
      description: habit.description || "",
      category: habit.category || "",
      frequency: habit.frequency || "DAILY",
      goal: habit.goal || 1,
      color: habit.color || "",
      icon: habit.icon || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    const url = editMode
      ? `${API_URL}/api/habits/${editMode}`
      : `${API_URL}/api/habits`;
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save habit");
      }
      setShowModal(false);
      fetchHabits();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleHabit = async (habitId) => {
    try {
      const res = await fetch(`${API_URL}/api/habits/${habitId}/toggle`, {
        method: "PATCH",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to toggle habit");
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (habitId) => {
    if (!confirm("Delete this habit?")) return;
    try {
      const res = await fetch(`${API_URL}/api/habits/${habitId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || fetching) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Loading habits...</p>
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
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Habits</p>
              <h1 className="mt-3 text-3xl font-semibold">Build consistency without pressure.</h1>
            </div>
            <button onClick={openCreate} className="rounded-full bg-indigo-500 px-5 py-3 text-white hover:bg-indigo-400 transition">
              + New Habit
            </button>
          </section>

          {habits.length === 0 ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              No habits yet. Create your first habit to start tracking.
            </section>
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {habits.map((habit) => (
                <div key={habit.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 relative">
                  <h2 className="text-lg font-semibold">{habit.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{habit.description}</p>
                  <p className="mt-4 text-3xl font-semibold">{habit.streak ?? 0} days</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className="rounded-full bg-indigo-500 px-3 py-1 text-xs text-white hover:bg-indigo-400 transition"
                    >
                      ✓ Today
                    </button>
                    <button
                      onClick={() => openEdit(habit)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
                  {editMode ? "Edit Habit" : "New Habit"}
                </p>
                <div className="mt-4 space-y-3">
                  <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                    </select>
                  </div>
                  {error && <p className="text-sm text-rose-400">{error}</p>}
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSave} className="flex-1 rounded-2xl bg-indigo-500 px-4 py-3 text-white hover:bg-indigo-400 transition">
                      {editMode ? "Update" : "Create"}
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