import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  Megaphone,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string; status?: string; search?: string }>;
}) {
  const { examId, status, search } = await searchParams;

  const where: Record<string, unknown> = {};

  if (examId) {
    where.examId = examId;
  }

  if (status === "graded") {
    where.score = { not: null };
  } else if (status === "pending") {
    where.score = null;
  }

  if (search) {
    where.OR = [
      { studentName: { contains: search, mode: "insensitive" } },
      { studentClass: { contains: search, mode: "insensitive" } },
    ];
  }

  const [submissions, exams] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      include: {
        exam: {
          select: {
            title: true,
            subject: true,
            durationMinutes: true,
          },
        },
      },
    }),
    prisma.exam.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Penilaian Jawaban Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Periksa seluruh esai yang dikirimkan, berikan skor 0–100 beserta catatan guru, dan publikasikan nilai ke dashboard.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filter:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1">
          <Link
            href="/admin/submissions"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !status
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Semua ({submissions.length})
          </Link>
          <Link
            href="/admin/submissions?status=pending"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              status === "pending"
                ? "bg-amber-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Belum Dinilai
          </Link>
          <Link
            href="/admin/submissions?status=graded"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              status === "graded"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Sudah Dinilai
          </Link>
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">Tidak ada data jawaban yang cocok.</p>
            <p className="mt-1">Jawaban yang dikirimkan oleh siswa akan otomatis muncul di sini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">Kelas</th>
                  <th className="py-3.5 px-4">Judul Soal</th>
                  <th className="py-3.5 px-4">Waktu Selesai</th>
                  <th className="py-3.5 px-4">Status Pengumpulan</th>
                  <th className="py-3.5 px-4">Nilai</th>
                  <th className="py-3.5 px-4">Publikasi</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {sub.studentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {sub.studentClass}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-indigo-300">
                      {sub.exam.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatDate(sub.submittedAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.isExpired ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Waktu Habis / Hangus</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Tepat Waktu</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.score !== null ? (
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/30">
                          {sub.score}
                        </span>
                      ) : (
                        <span className="text-amber-400/90 italic text-[11px]">
                          Belum Dinilai
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {sub.isPublished ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Megaphone className="w-3 h-3" />
                          <span>Publik</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Draf Guru</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/submissions/${sub.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-xs"
                      >
                        <span>{sub.score !== null ? "Edit Nilai" : "Koreksi Esai"}</span>
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
