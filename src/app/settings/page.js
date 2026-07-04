"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const [profile, setProfile] = useState({ firstName: "", lastName: "", username: "", bio: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    fetchProfile();
  }, [loading, user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        username: data.username || "",
        bio: data.bio || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update profile");
      }
      setMessage("Profile updated successfully.");
      if (refresh) refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/api/users/me/password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(passwordForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }
      setMessage("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell isPublic={false}>
        <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <p>Loading settings...</p>
        </main>
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell isPublic={false}>
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Settings</p>
            <h1 className="mt-3 text-3xl font-semibold">Personal preferences</h1>
            <p className="mt-3 text-slate-400">Manage your profile, password and account settings.</p>
          </section>

          {/* Profile */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
                placeholder="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
              <input
                className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
                placeholder="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
            <input
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
              placeholder="Username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
            <textarea
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
              placeholder="Bio"
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
            <button
              onClick={updateProfile}
              disabled={saving}
              className="rounded-full bg-indigo-500 px-5 py-3 text-white hover:bg-indigo-400 transition disabled:opacity-70"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </section>

          {/* Password */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none"
              placeholder="New Password (min 8 characters)"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <button
              onClick={changePassword}
              disabled={saving}
              className="rounded-full bg-indigo-500 px-5 py-3 text-white hover:bg-indigo-400 transition disabled:opacity-70"
            >
              {saving ? "Saving..." : "Change Password"}
            </button>
          </section>

          {message && (
            <div className="rounded-2xl border border-green-400/30 bg-green-400/10 p-4 text-sm text-green-400">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-400">
              {error}
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}