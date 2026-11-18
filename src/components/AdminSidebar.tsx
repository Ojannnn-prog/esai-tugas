"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileQuestion,
  PlusCircle,
  GraduationCap,
  Megaphone,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    {
      label: "Ringkasan Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Kelola Soal Ujian",
      href: "/admin/exams",
      icon: FileQuestion,
    },
    {
      label: "Buat Soal Baru",
      href: "/admin/exams/create",
      icon: PlusCircle,
    },
    {
      label: "Penilaian Jawaban Siswa",
      href: "/admin/submissions",
      icon: GraduationCap,
    },
    {
      label: "Pengumuman Dashboard",
      href: "/admin/announcements",
      icon: Megaphone,
    },
  ];

  const handleLogout = async () => {
    if (!confirm("Apakah Anda yakin ingin keluar dari panel admin?")) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error(e);
      setLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Admin Brand */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-900/50">
              A
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Panel Pendidik
              </h2>
              <span className="text-xs text-indigo-400 font-medium">
                Admin & Guru Esai
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>Lihat Portal Siswa</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{loggingOut ? "Keluar..." : "Keluar (Logout)"}</span>
        </button>
      </div>
    </aside>
  );
}
