import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileQuestion,
  GraduationCap,
  Clock,
  CheckCircle2,
  PlusCircle,
  Megaphone,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalExams, totalSubmissions, pendingSubmissions, publishedSubmissions] =
    await Promise.all([
      prisma.exam.count(),
      prisma.submission.count(),
      prisma.submission.count({ where: { score: null } }),
      prisma.submission.count({ where: { isPublished: true } }),
    ]);

  const recentSubmissions = await prisma.submission.findMany({
    take: 6,
    orderBy: { submittedAt: "desc" },
    include: {
      exam: {
        select: {
          title: true,
          subject: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ringkasan Dashboard Administrator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pantau seluruh aktivitas pengerjaan soal esai, status koreksi, dan pengumuman nilai siswa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/exams/create"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Soal Ujian</span>
          </Link>
          <Link
            href="/admin/announcements"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            <Megaphone className="w-4 h-4 text-indigo-400" />
            <span>Kelola Pengumuman</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Soal Ujian</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{totalExams}</div>
          <p className="text-[11px] text-slate-500">Soal esai yang dibuat guru</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Jawaban Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{totalSubmissions}</div>
          <p className="text-[11px] text-slate-500">Esai dikirimkan oleh siswa</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Belum Dinilai</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-400">{pendingSubmissions}</div>
          <p className="text-[11px] text-slate-500">Memerlukan koreksi & skor</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Nilai Dipublikasikan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-400">{publishedSubmissions}</div>
          <p className="text-[11px] text-slate-500">Tampil di dashboard publik</p>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Jawaban Esai Siswa Terbaru</h2>
            <p className="text-xs text-slate-400">
              Daftar pengumpulan terakhir yang masuk dari siswa tanpa login.
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>Lihat Semua Jawaban</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Belum ada jawaban esai yang dikirimkan oleh siswa.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Judul Soal</th>
                  <th className="py-3 px-4">Waktu Kirim</th>
                  <th className="py-3 px-4">Status & Nilai</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {sub.studentName}
                    </td>
                    <td className="py-3.5 px-4">{sub.studentClass}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-indigo-300">
                      {sub.exam.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(sub.submittedAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.score !== null ? (
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                            {sub.score}
                          </span>
                          {sub.isPublished && (
                            <span className="text-[10px] text-slate-400">
                              (Dipublikasi)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                          Belum Dinilai
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/submissions/${sub.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors font-medium"
                      >
                        <span>{sub.score !== null ? "Ubah Nilai" : "Beri Nilai"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
