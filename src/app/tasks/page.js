"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const STATUS_STYLES = {
  PENDING: "border-slate-400 text-slate-400",
  IN_PROGRESS: "border-amber-400 text-amber-400",
  COMPLETED: "border-green-400 text-green-400",
};

export default function TasksPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM", status: "PENDING", dueDate: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    fetchTasks();
  }, [loading, user]);

  const fetchTasks = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const openCreate = () => {
    setEditMode(null);
    setForm({ title: "", description: "", priority: "MEDIUM", status: "PENDING", dueDate: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditMode(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "MEDIUM",
      status: task.status || "PENDING",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    const url = editMode
      ? `${API_URL}/api/tasks/${editMode}`
      : `${API_URL}/api/tasks`;
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
          description: form.description,
          priority: form.priority,
          status: form.status,
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save task");
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to delete");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || fetching) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Loading tasks...</p>
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
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Tasks</p>
              <h1 className="mt-3 text-3xl font-semibold">Organize your work with calm focus.</h1>
            </div>
            <button onClick={openCreate} className="rounded-full bg-indigo-500 px-5 py-3 text-white hover:bg-indigo-400 transition">
              + New Task
            </button>
          </section>

          {tasks.length === 0 ? (
            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
              No tasks yet. Create your first task to get organized.
            </section>
          ) : (
            <section className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
                  <div className="flex-1">
                    <h2 className="font-semibold">{task.title}</h2>
                    <p className="text-sm text-slate-400">
                      Priority {task.priority}
                      {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                      className={`rounded-full border px-3 py-1 text-sm bg-transparent ${STATUS_STYLES[task.status] || "border-slate-400 text-slate-400"}`}
                    >
                      <option value="PENDING" className="bg-slate-900">Pending</option>
                      <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
                      <option value="COMPLETED" className="bg-slate-900">Completed</option>
                    </select>
                    <button
                      onClick={() => openEdit(task)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
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
                  {editMode ? "Edit Task" : "New Task"}
                </p>
                <div className="mt-4 space-y-3">
                  <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <input className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <div className="grid grid-cols-3 gap-3">
                    <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                    <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <input type="date" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
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