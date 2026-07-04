"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [journals, setJournals] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    fetchCalendarData();
  }, [loading, user, currentMonth]);

  const fetchCalendarData = async () => {
    setFetching(true);
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    try {
      const [tasksRes, journalsRes] = await Promise.all([
        fetch(`${API_URL}/api/tasks`, { credentials: "include", headers: { Accept: "application/json" } }),
        fetch(`${API_URL}/api/journals?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        }),
      ]);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (journalsRes.ok) setJournals(await journalsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const getEventsForDay = (day) => {
    const dateStr = day.toISOString().split("T")[0];
    const dayTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(dateStr));
    const dayJournals = journals.filter((j) => j.date && j.date.startsWith(dateStr));
    return { tasks: dayTasks, journals: dayJournals };
  };

  const daysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
    return days;
  };

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  if (loading || fetching) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Loading calendar...</p>
        </main>
      </AppShell>
    );
  }

  if (!user) return null;

  const monthLabel = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Calendar</p>
            <h1 className="mt-3 text-3xl font-semibold">Plan your consistency</h1>
            <p className="mt-3 text-slate-400">Track habits, tasks and journal entries across the month.</p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => changeMonth(-1)} className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10">← Previous</button>
              <h2 className="text-xl font-semibold capitalize">{monthLabel}</h2>
              <button onClick={() => changeMonth(1)} className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10">Next →</button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => (
                <div key={day} className="text-center text-xs text-slate-400 py-2">{day}</div>
              ))}
              {daysInMonth().map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="aspect-square rounded-lg" />;
                const events = getEventsForDay(day);
                const hasEvents = events.tasks.length > 0 || events.journals.length > 0;
                return (
                  <div
                    key={day.toISOString()}
                    className={`aspect-square rounded-lg border border-white/5 p-1 text-xs ${
                      hasEvents ? "bg-indigo-500/20 border-indigo-400/30" : ""
                    }`}
                  >
                    <p className="font-semibold">{day.getDate()}</p>
                    {events.tasks.length > 0 && (
                      <p className="text-amber-400 mt-0.5 truncate">{events.tasks.length} task(s)</p>
                    )}
                    {events.journals.length > 0 && (
                      <p className="text-purple-400 mt-0.5 truncate">{events.journals.length} entry(s)</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}