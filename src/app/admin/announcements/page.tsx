"use client";

import { useEffect, useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  AlertCircle,
  Pin,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      setAnnouncements(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Judul dan isi pengumuman wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, isPinned }),
      });

      if (!res.ok) {
        throw new Error("Gagal membuat pengumuman.");
      }

      setTitle("");
      setContent("");
      setIsPinned(false);
      fetchAnnouncements();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) return;
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
      alert("Gagal menghapus pengumuman.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Kelola Pengumuman Dashboard Utama
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pengumuman di sini akan tampil di halaman depan sebelum siswa memilih soal ujian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Create Announcement Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Tambah Pengumuman Baru</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Judul Pengumuman
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Jadwal Ujian Tengah Semester Esai"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Isi Pengumuman
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan pesan atau instruksi penting untuk siswa..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
              <span className="flex items-center space-x-1">
                <Pin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sematkan ke Bagian Paling Atas (Pinned)</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
            >
              {submitting ? "Menerbitkan..." : "Terbitkan Pengumuman"}
            </button>
          </form>
        </div>

        {/* Existing Announcements List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-300">
            Daftar Pengumuman Aktif ({announcements.length})
          </h2>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Memuat pengumuman...
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Belum ada pengumuman yang diterbitkan.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-2 transition-colors ${
                    item.isPinned ? "border-indigo-500/40 bg-indigo-950/10" : "border-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      {item.isPinned && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-600 text-white">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Pinned</span>
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Hapus Pengumuman"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  <div className="pt-2 text-[10px] text-slate-500 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Diterbitkan: {formatDate(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
