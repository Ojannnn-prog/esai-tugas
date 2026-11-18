import Navbar from "@/components/Navbar";
import AnnouncementBoard from "@/components/AnnouncementBoard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  Clock,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Shield,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch active exams
  const exams = await prisma.exam.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch announcements
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  // Fetch published grades
  const publishedScores = await prisma.submission.findMany({
    where: {
      isPublished: true,
      score: { not: null },
    },
    orderBy: { gradedAt: "desc" },
    include: {
      exam: {
        select: {
          title: true,
          subject: true,
        },
      },
    },
  });

  const formattedScores = publishedScores.map((s) => ({
    id: s.id,
    studentName: s.studentName,
    studentClass: s.studentClass,
    score: s.score,
    feedback: s.feedback,
    gradedAt: s.gradedAt ? s.gradedAt.toISOString() : null,
    submittedAt: s.submittedAt.toISOString(),
    isExpired: s.isExpired,
    exam: {
      title: s.exam.title,
      subject: s.exam.subject,
    },
  }));

  const formattedAnnouncements = announcements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    isPinned: a.isPinned,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 sm:p-12 shadow-xl shadow-indigo-950/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Portal Ujian Esai Mandiri Siswa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Kerjakan Ujian Esai Langsung Tanpa Perlu Login
            </h1>
            <p className="text-indigo-100 text-base sm:text-lg leading-relaxed">
              Pilih soal esai aktif di bawah ini, isi Nama dan Kelas Anda, lalu tuangkan gagasan Anda
              menggunakan editor teks kaya ala blog lengkap dengan penataan paragraf, format tulisan, dan
              penghitung waktu mundur otomatis.
            </p>

            {/* Quick badges */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-indigo-200">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Tanpa Akun / Langsung Kerjakan</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Timer Otomatis (Minimal 60 Menit)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-indigo-300" />
                <span>Penilaian & Feedback Langsung dari Guru</span>
              </div>
            </div>
          </div>

          {/* Background Decorative Graphic */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Section 1: Papan Pengumuman & Hasil Nilai */}
        <AnnouncementBoard
          announcements={formattedAnnouncements}
          scores={formattedScores}
        />

        {/* Section 2: Daftar Ujian / Soal Esai Tersedia */}
        <div id="daftar-soal" className="space-y-6 pt-4">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xl">
                <FileText className="w-6 h-6 text-indigo-600" />
                <h2>Daftar Soal Esai Aktif yang Siap Dikerjakan</h2>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Silakan pilih soal ujian yang ingin Anda kerjakan. Pastikan Anda memiliki waktu luang minimal 60 menit.
              </p>
            </div>
          </div>

          {exams.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-white">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                Belum Ada Soal Ujian yang Aktif
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                Guru belum membuka sesi ujian esai saat ini. Silakan hubungi guru pengajar atau kembali lagi nanti.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="group bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        {exam.subject && (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {exam.subject}
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {exam.title}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold whitespace-nowrap shadow-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{exam.durationMinutes} Menit</span>
                      </div>
                    </div>

                    {exam.description && (
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {exam.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Waktu pengerjaan minimal 60 menit
                    </span>

                    <Link
                      href={`/exam/${exam.id}`}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 group-hover:bg-indigo-600 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
                    >
                      <span>Mulai Kerjakan</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Portal Ujian Esai Terpadu. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center space-x-4">
            <Link href="/admin/login" className="hover:text-indigo-600 transition-colors">
              Masuk Administrator
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
