"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function JournalPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", mood: "", date: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    fetchEntries();
  }, [loading, user]);

  const fetchEntries = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_URL}/api/journals`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to load entries");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const openCreate = () => {
    setEditMode(null);
    setForm({ title: "", content: "", mood: "", date: new Date().toISOString().split("T")[0] });
    setError("");
    setShowModal(true);
  };

  const openEdit = (entry) => {
    setEditMode(entry.id);
    setForm({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || "",
      date: entry.date ? entry.date.split("T")[0] : "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    const url = editMode
      ? `${API_URL}/api/journals/${editMode}`
      : `${API_URL}/api/journals`;
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          mood: form.mood || null,
          date: new Date(form.date).toISOString(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save entry");
      }
      setShowModal(false);
      fetchEntries();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteEntry = async (entryId) => {
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`${API_URL}/api/journals/${entryId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || fetching) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Loading journal...</p>
        </main>
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 flex justify-between items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Journal</p>
              <h1 className="mt-3 text-3xl font-semibold">Your Reflections</h1>
              <p className="mt-3 text-slate-400">Capture your thoughts, emotions and daily experiences.</p>
            </div>
            <button onClick={openCreate} className="rounded-full bg-indigo-500 px-5 py-3 text-white hover:bg-indigo-400 transition">
              + New Entry
            </button>
          </section>

          {entries.length === 0 ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              No journal entries yet. Start writing your first reflection.
            </section>
          ) : (
            <section className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">{entry.title}</h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {new Date(entry.date).toLocaleDateString()}
                        {entry.mood && ` · Mood: ${entry.mood}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(entry)} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 transition">
                        Edit
                      </button>
                      <button onClick={() => deleteEntry(entry.id)} className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-300 line-clamp-4">{entry.content}</p>
                </div>
              ))}
            </section>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">
                  {editMode ? "Edit Entry" : "New Entry"}
                </p>
                <div className="mt-4 space-y-3">
                  <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <textarea className="w-full min-h-32 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Write your thoughts..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Mood (e.g. Happy, Reflective)" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} />
                    <input type="date" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
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