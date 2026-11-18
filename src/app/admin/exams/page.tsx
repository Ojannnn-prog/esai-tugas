import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  PlusCircle,
  FileQuestion,
  Clock,
  GraduationCap,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { submissions: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kelola Bank Soal Esai
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Daftar seluruh soal ujian esai yang telah dibuat beserta durasi dan status akses siswa.
          </p>
        </div>

        <Link
          href="/admin/exams/create"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Soal Ujian Baru</span>
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <FileQuestion className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300">Belum Ada Soal Ujian</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Mulai dengan membuat soal esai baru dengan durasi minimal 60 menit.
          </p>
          <Link
            href="/admin/exams/create"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Buat Soal Pertama</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    {exam.subject && (
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {exam.subject}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {exam.title}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      exam.isActive
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {exam.isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Siswa Dapat Mengerjakan</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-400" />
                        <span>Sesi Ditutup</span>
                      </>
                    )}
                  </span>
                </div>

                {exam.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Batas Waktu: <strong>{exam.durationMinutes} Menit</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                    <span><strong>{exam._count.submissions}</strong> Jawaban Masuk</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  Dibuat: {formatDate(exam.createdAt)}
                </span>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/exam/${exam.id}`}
                    target="_blank"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Siswa</span>
                  </Link>

                  <Link
                    href={`/admin/submissions?examId=${exam.id}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors font-medium"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Periksa Jawaban</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
