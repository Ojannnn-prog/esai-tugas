"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
import RichTextViewer from "@/components/RichTextViewer";
import CountdownTimer from "@/components/CountdownTimer";
import {
  User,
  GraduationCap,
  Send,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface ExamDetail {
  id: string;
  title: string;
  subject: string | null;
  description: string | null;
  questionContent: string;
  durationMinutes: number;
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Student Input State
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [essayAnswer, setEssayAnswer] = useState("");

  // Exam flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    id: string;
    studentName: string;
    studentClass: string;
    submittedAt: string;
    isExpired: boolean;
  } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [startTime] = useState<string>(() => new Date().toISOString());

  // Storage key for autosave
  const storagePrefix = `exam_${id}_student`;

  // Fetch Exam Data
  useEffect(() => {
    async function fetchExam() {
      try {
        setLoading(true);
        const res = await fetch(`/api/exams/${id}`);
        if (!res.ok) {
          throw new Error("Soal ujian tidak ditemukan atau telah ditutup oleh guru.");
        }
        const data = await res.json();
        setExam(data);

        // Restore saved draft if exists
        const savedName = localStorage.getItem(`${storagePrefix}_name`);
        const savedClass = localStorage.getItem(`${storagePrefix}_class`);
        const savedAnswer = localStorage.getItem(`${storagePrefix}_answer`);

        if (savedName) setStudentName(savedName);
        if (savedClass) setStudentClass(savedClass);
        if (savedAnswer) setEssayAnswer(savedAnswer);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }
    fetchExam();
  }, [id, storagePrefix]);

  // Autosave draft locally
  useEffect(() => {
    if (!isSubmitted && exam) {
      if (studentName) localStorage.setItem(`${storagePrefix}_name`, studentName);
      if (studentClass) localStorage.setItem(`${storagePrefix}_class`, studentClass);
      if (essayAnswer) localStorage.setItem(`${storagePrefix}_answer`, essayAnswer);
    }
  }, [studentName, studentClass, essayAnswer, isSubmitted, exam, storagePrefix]);

  // Submission handler
  const handleSubmit = async (forcedExpire = false) => {
    if (!studentName.trim()) {
      alert("Silakan masukkan Nama Lengkap Anda terlebih dahulu.");
      return;
    }
    if (!studentClass.trim()) {
      alert("Silakan masukkan Kelas Anda terlebih dahulu.");
      return;
    }
    if (!forcedExpire && (!essayAnswer || essayAnswer.trim() === "<p></p>")) {
      alert("Silakan ketik jawaban esai Anda sebelum mengumpulkan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: id,
          studentName,
          studentClass,
          essayAnswer: essayAnswer || "<p><em>(Jawaban terkirim otomatis saat waktu habis)</em></p>",
          startedAt: startTime,
          isExpired: forcedExpire,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mengumpulkan jawaban.");
      }

      // Clear local draft upon successful submission
      localStorage.removeItem(`${storagePrefix}_name`);
      localStorage.removeItem(`${storagePrefix}_class`);
      localStorage.removeItem(`${storagePrefix}_answer`);
      localStorage.removeItem(`${storagePrefix}_start`);

      setSubmissionReceipt({
        id: result.submissionId,
        studentName,
        studentClass,
        submittedAt: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        isExpired: result.isExpired,
      });

      setIsSubmitted(true);
      setShowConfirmModal(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat mengumpulkan jawaban.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called when countdown reaches 00:00:00
  const handleTimerExpire = () => {
    setIsExpired(true);
    // Auto-submit immediately per Option A
    handleSubmit(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Memuat soal ujian esai...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Ujian Tidak Tersedia</h2>
            <p className="text-sm text-slate-600">{error || "Soal tidak ditemukan."}</p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success Receipt Screen
  if (isSubmitted && submissionReceipt) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 flex items-center justify-center">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-lg text-center space-y-6 w-full">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Jawaban Esai Berhasil Dikumpulkan!
              </h1>
              <p className="text-sm text-slate-600">
                Terima kasih telah mengerjakan ujian ini secara jujur dan tepat waktu. Jawaban Anda
                telah tersimpan dengan aman dan menunggu proses koreksi oleh guru.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-3">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Judul Soal:</span>
                <span className="font-bold text-slate-900">{exam.title}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Nama Siswa:</span>
                <span className="font-bold text-slate-900">{submissionReceipt.studentName}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Kelas:</span>
                <span className="font-bold text-slate-900">{submissionReceipt.studentClass}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Waktu Pengumpulan:</span>
                <span className="font-bold text-slate-900">{submissionReceipt.submittedAt}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Status Pengumpulan:</span>
                {submissionReceipt.isExpired ? (
                  <span className="font-bold text-rose-600 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Terkirim Otomatis (Waktu Habis / Hangus)</span>
                  </span>
                ) : (
                  <span className="font-bold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tepat Waktu (Diserahkan Sendiri)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#pengumuman"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                Lihat Papan Pengumuman & Nilai
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sticky Header with Timer & Submit Action */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              href="/"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="truncate max-w-xs sm:max-w-md">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
                {exam.subject || "Ujian Esai"}
              </span>
              <h1 className="text-base font-bold text-slate-900 truncate">{exam.title}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* 60+ min Countdown Timer */}
            <CountdownTimer
              durationMinutes={exam.durationMinutes}
              storageKey={storagePrefix}
              onExpire={handleTimerExpire}
              disabled={isSubmitted}
            />

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting || isExpired}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Mengirim..." : "Kirim Jawaban"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Alert for Time Expired */}
        {isExpired && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center space-x-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-sm font-medium">
              Batas waktu ujian telah berakhir! Form jawaban telah dikunci dan draf jawaban Anda telah
              dikirimkan secara otomatis.
            </p>
          </div>
        )}

        {/* 1. Student Identity Section (No login required) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Identitas Siswa</h2>
            <span className="text-xs text-rose-500 font-semibold">*Wajib Diisi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap Siswa
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Fauzan"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled={isExpired || isSubmitted}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kelas
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: XII IPA 1 / XI RPL 2"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  disabled={isExpired || isSubmitted}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Soal Ujian Esai */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Pertanyaan & Instruksi Esai</h2>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Durasi: {exam.durationMinutes} Menit</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100">
            <RichTextViewer content={exam.questionContent} />
          </div>
        </section>

        {/* 3. Lembar Jawaban Siswa (WordPress / Blog Style Rich Text Editor) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Lembar Jawaban Esai Siswa
              </h2>
              <p className="text-xs text-slate-500">
                Gunakan alat bantu format tulisan (Tebal, Miring, Garis Bawah, Rata Kiri-Kanan / Justify,
                Poin, dan Kutipan) untuk menyusun jawaban esai yang berbobot.
              </p>
            </div>
          </div>

          <RichTextEditor
            value={essayAnswer}
            onChange={setEssayAnswer}
            editable={!isExpired && !isSubmitted}
            placeholder="Tuliskan jawaban esai Anda secara lengkap dan argumentatif di sini..."
            minHeight="420px"
          />
        </section>

        {/* Bottom Submission Bar */}
        <div className="p-6 rounded-3xl bg-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-indigo-950/20">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base">Sudah Selesai Mengerjakan?</h4>
            <p className="text-xs text-indigo-200">
              Pastikan nama, kelas, dan seluruh bagian esai telah terisi dengan cermat sebelum dikumpulkan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting || isExpired}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-indigo-950 bg-white hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send className="w-4 h-4 text-indigo-700" />
            <span>Kirim Jawaban Sekarang</span>
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Konfirmasi Pengumpulan Jawaban
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin mengirimkan jawaban esai ini sekarang? Setelah dikumpulkan,
                jawaban Anda tidak dapat diubah kembali dan akan langsung masuk ke antrean koreksi guru.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 space-y-1">
              <div>
                <span className="font-semibold text-slate-500">Nama:</span>{" "}
                <span className="font-bold">{studentName || "(Belum diisi)"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Kelas:</span>{" "}
                <span className="font-bold">{studentClass || "(Belum diisi)"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="w-1/2 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                {isSubmitting ? "Mengirim..." : "Ya, Kirim Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
