"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const privateLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/habits", label: "Habits" },
  { href: "/tasks", label: "Tasks" },
  { href: "/challenges", label: "Challenges" },
  { href: "/journal", label: "Journal" },
  { href: "/calendar", label: "Calendar" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export default function AppShell({ children, isPublic = true }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const links = isPublic ? publicLinks : privateLinks;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
          <Link href={isPublic ? "/" : "/dashboard"} className="text-xl font-semibold tracking-tight text-white">
            Unevenness
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-2 transition ${active ? "bg-indigo-500 text-white" : "hover:bg-white/10 hover:text-white"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isPublic ? (
              user ? (
                <button onClick={handleLogout} className="rounded-full border border-white/15 px-3 py-2 hover:bg-white/10">
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" className="rounded-full border border-white/15 px-3 py-2 hover:bg-white/10">Sign In</Link>
                  <Link href="/register" className="rounded-full bg-indigo-500 px-3 py-2 text-white hover:bg-indigo-400">Register</Link>
                </>
              )
            ) : (
              <button onClick={handleLogout} className="rounded-full border border-white/15 px-3 py-2 hover:bg-white/10">
                {loading ? "Loading..." : "Logout"}
              </button>
            )}
          </nav>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}
