"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";
import {
  ArrowLeft,
  Save,
  Clock,
  AlertCircle,
  FileQuestion,
  Info,
} from "lucide-react";

export default function CreateExamPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [questionContent, setQuestionContent] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Judul ujian wajib diisi.");
      return;
    }

    if (!questionContent.trim() || questionContent === "<p></p>") {
      setError("Konten pertanyaan esai wajib diisi.");
      return;
    }

    if (durationMinutes < 60) {
      setError("Batas waktu pengisian minimal harus 60 menit sesuai instruksi ujian.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          description,
          questionContent,
          durationMinutes,
          isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat soal ujian.");
      }

      router.push("/admin/exams");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center space-x-3">
        <Link
          href="/admin/exams"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Buat Soal Ujian Esai Baru
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Buat lembar pertanyaan esai lengkap dengan batas waktu pengerjaan minimal 60 menit.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-white font-semibold text-sm pb-2 border-b border-slate-800">
            <FileQuestion className="w-4 h-4 text-indigo-400" />
            <span>Informasi Pokok Ujian</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Judul Soal Ujian <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ujian Tengah Semester: Bahasa Indonesia & Esai Kritis"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mata Pelajaran / Topik
              </label>
              <input
                type="text"
                placeholder="Contoh: Bahasa Indonesia"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Deskripsi Singkat / Pengantar
            </label>
            <textarea
              rows={2}
              placeholder="Berikan ringkasan materi atau tujuan penulisan esai ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Batas Waktu Pengerjaan (Menit) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={60}
                  step={5}
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(60, parseInt(e.target.value) || 60))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-amber-400/90 mt-1 flex items-center space-x-1">
                <Info className="w-3 h-3" />
                <span>Batas waktu minimal 60 menit. Timer siswa akan berjalan otomatis.</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Status Sesi Ujian
              </label>
              <div className="flex items-center space-x-3 pt-2">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="accent-indigo-600"
                  />
                  <span>Aktif (Siswa Dapat Mengerjakan)</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="accent-indigo-600"
                  />
                  <span>Tutup / Non-aktif</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content Card (Rich Text) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-2 border-b border-slate-800">
            <span className="text-white font-semibold text-sm">
              Teks Pertanyaan & Petunjuk Esai Lengkap <span className="text-rose-400">*</span>
            </span>
            <span className="text-xs text-slate-400">
              Mendukung heading, tebal, miring, daftar nomor, dan garis pemisah.
            </span>
          </div>

          <RichTextEditor
            value={questionContent}
            onChange={setQuestionContent}
            placeholder="Tuliskan petunjuk pengerjaan dan daftar pertanyaan esai di sini..."
            minHeight="300px"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Link
            href="/admin/exams"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/30"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan Soal..." : "Simpan & Terbitkan Soal"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
