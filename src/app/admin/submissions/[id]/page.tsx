"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextViewer from "@/components/RichTextViewer";
import {
  ArrowLeft,
  GraduationCap,
  Award,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Save,
  Megaphone,
  User,
  BookOpen,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SubmissionDetail {
  id: string;
  studentName: string;
  studentClass: string;
  essayAnswer: string;
  startedAt: string;
  submittedAt: string;
  isExpired: boolean;
  score: number | null;
  feedback: string | null;
  isPublished: boolean;
  gradedAt: string | null;
  exam: {
    id: string;
    title: string;
    subject: string | null;
    questionContent: string;
    durationMinutes: number;
  };
}

export default function GradeSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [score, setScore] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(true); // default to true so it publishes per user request
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/submissions/${id}`);
        if (!res.ok) {
          throw new Error("Jawaban siswa tidak ditemukan.");
        }
        const data = await res.json();
        setSubmission(data);
        if (data.score !== null) setScore(data.score.toString());
        if (data.feedback) setFeedback(data.feedback);
        if (data.isPublished !== undefined) setIsPublished(data.isPublished);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();

    if (score === "" || isNaN(parseFloat(score))) {
      alert("Silakan masukkan nilai angka yang valid antara 0 dan 100.");
      return;
    }

    const numScore = parseFloat(score);
    if (numScore < 0 || numScore > 100) {
      alert("Nilai harus berada pada rentang 0 hingga 100.");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: numScore,
          feedback,
          isPublished,
        }),
      });

      const updated = await res.json();

      if (!res.ok) {
        throw new Error(updated.error || "Gagal menyimpan penilaian.");
      }

      setSubmission((prev) => (prev ? { ...prev, ...updated } : null));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan penilaian.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Memuat berkas jawaban esai siswa...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-white font-bold">{error || "Data tidak ditemukan"}</h3>
        <Link
          href="/admin/submissions"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Jawaban</span>
        </Link>
      </div>
    );
  }

  // Calculate word count from answer
  const rawText = submission.essayAnswer.replace(/<[^>]*>/g, " ");
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/submissions"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
              Lembar Koreksi Esai
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {submission.studentName} — Kelas {submission.studentClass}
            </h1>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {submission.isExpired ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
              <span>Terkumpul Otomatis (Waktu Habis / Hangus)</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>Terkumpul Tepat Waktu</span>
            </span>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Penilaian berhasil disimpan!{" "}
            {isPublished && "Nilai telah diterbitkan ke dashboard pengumuman siswa."}
          </span>
        </div>
      )}

      {/* Main Grid: Left is Essay & Question, Right is Grading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Soal & Jawaban Siswa */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Reference Card */}
          <details className="bg-slate-900 border border-slate-800 rounded-2xl p-5 group open:ring-1 open:ring-indigo-500/30">
            <summary className="flex items-center justify-between cursor-pointer list-none text-slate-300 hover:text-white">
              <div className="flex items-center space-x-2 text-sm font-semibold">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Lihat Teks Soal Ujian: {submission.exam.title}</span>
              </div>
              <span className="text-xs text-indigo-400 font-medium group-open:hidden">
                Buka Soal ▼
              </span>
              <span className="text-xs text-slate-400 font-medium hidden group-open:inline">
                Tutup Soal ▲
              </span>
            </summary>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs bg-slate-950 p-4 rounded-xl">
              <RichTextViewer content={submission.exam.questionContent} />
            </div>
          </details>

          {/* Student Essay Card */}
          <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Jawaban Esai Siswa
                </h2>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span>
                  Jumlah Kata: <strong>{wordCount}</strong>
                </span>
                <span>•</span>
                <span>
                  Diserahkan: {formatDate(submission.submittedAt)}
                </span>
              </div>
            </div>

            {/* Formatted Content View */}
            <div className="min-h-[300px] py-2">
              <RichTextViewer content={submission.essayAnswer} />
            </div>
          </div>
        </div>

        {/* Right Side: Form Penilaian Guru */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 sticky top-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
            <Award className="w-5 h-5 text-amber-400" />
            <h3>Form Penilaian Guru</h3>
          </div>

          <form onSubmit={handleSaveGrade} className="space-y-4">
            {/* Input Nilai */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nilai Ujian (Skala 0 - 100) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  placeholder="Misal: 88.5"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Masukkan skor numerik hasil evaluasi esai siswa.
              </p>
            </div>

            {/* Input Catatan & Masukan Guru */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Catatan & Masukan Guru</span>
                <span className="text-[10px] text-indigo-400">Tampil di Papan Pengumuman</span>
              </label>
              <textarea
                rows={4}
                placeholder="Berikan apresiasi dan catatan bagian yang perlu ditingkatkan oleh siswa..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Ulasan ini menjadi bahan evaluasi agar siswa paham letak kelebihan & kekurangan jawabannya.
              </p>
            </div>

            {/* Checkbox Publikasikan ke Dashboard */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 bg-slate-900 border-slate-700"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Kirim ke Dashboard Pengumuman Siswa</span>
                  </span>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Jika dicentang, nama siswa, kelas, nilai, dan ulasan akan langsung muncul di halaman beranda siswa.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan Nilai..." : "Simpan & Publikasikan Nilai"}</span>
            </button>
          </form>

          {/* Submission Info Summary */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1.5">
            <div className="flex justify-between">
              <span>Waktu Mulai:</span>
              <span className="text-slate-400">{formatDate(submission.startedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu Selesai:</span>
              <span className="text-slate-400">{formatDate(submission.submittedAt)}</span>
            </div>
            {submission.gradedAt && (
              <div className="flex justify-between">
                <span>Terakhir Dinilai:</span>
                <span className="text-emerald-400">{formatDate(submission.gradedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
