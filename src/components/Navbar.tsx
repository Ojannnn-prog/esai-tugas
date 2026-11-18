"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ShieldCheck, Home, Bell } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight block">
              Portal Esai Siswa
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              Sistem Pengerjaan & Penilaian Esai
            </span>
          </div>
        </Link>

        {/* Links & Admin Button */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Beranda</span>
          </Link>

          <Link
            href="/#pengumuman"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline">Pengumuman & Nilai</span>
          </Link>

          {!isAdminArea ? (
            <Link
              href="/admin/login"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login Admin</span>
            </Link>
          ) : (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Panel Admin</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
