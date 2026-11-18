"use client";

import { useState } from "react";
import {
  Megaphone,
  Award,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface PublishedScore {
  id: string;
  studentName: string;
  studentClass: string;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string;
  isExpired: boolean;
  exam: {
    title: string;
    subject: string | null;
  };
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

interface AnnouncementBoardProps {
  announcements: AnnouncementItem[];
  scores: PublishedScore[];
}

export default function AnnouncementBoard({
  announcements,
  scores,
}: AnnouncementBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("ALL");

  // Extract unique classes for filter
  const classes = Array.from(new Set(scores.map((s) => s.studentClass))).filter(Boolean);

  const filteredScores = scores.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exam.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = selectedClass === "ALL" || item.studentClass === selectedClass;

    return matchesSearch && matchesClass;
  });

  return (
    <div id="pengumuman" className="space-y-8">
      {/* Pengumuman Guru & Sekolah */}
      {announcements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-indigo-700 font-bold text-lg">
            <Megaphone className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h2>Papan Pengumuman Guru & Ujian</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.isPinned
                    ? "bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 border-indigo-200 shadow-sm"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.isPinned && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>Penting</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.createdAt)}</span>
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Papan Hasil Nilai & Evaluasi Siswa */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-lg">
              <Award className="w-5 h-5 text-amber-500" />
              <h2>Hasil Penilaian & Catatan Evaluasi Siswa</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparansi nilai esai dan catatan perbaikan dari guru untuk bahan evaluasi belajar bersama.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 w-44 sm:w-56"
              />
            </div>

            {classes.length > 0 && (
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                >
                  <option value="ALL">Semua Kelas</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {filteredScores.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">
              Belum Ada Nilai yang Dipublikasikan
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Hasil penilaian esai akan tampil di sini setelah guru memeriksa dan mempublikasikannya.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScores.map((item) => {
              const scoreNum = item.score ?? 0;
              const isExcellent = scoreNum >= 85;
              const isGood = scoreNum >= 75 && !isExcellent;
              const isPass = scoreNum >= 65 && !isGood && !isExcellent;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Name, Class, and Score Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {item.studentName}
                        </h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                            Kelas: {item.studentClass}
                          </span>
                          {item.isExpired ? (
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                              <AlertCircle className="w-2.5 h-2.5" />
                              <span>Waktu Habis</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Tepat Waktu</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div
                        className={`flex flex-col items-center justify-center min-w-[56px] h-14 rounded-xl px-2 shadow-xs ${
                          isExcellent
                            ? "bg-emerald-500 text-white"
                            : isGood
                            ? "bg-indigo-600 text-white"
                            : isPass
                            ? "bg-amber-500 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                          NILAI
                        </span>
                        <span className="text-xl font-extrabold leading-none">
                          {item.score}
                        </span>
                      </div>
                    </div>

                    {/* Exam Name */}
                    <div className="text-xs text-indigo-600 font-medium mb-3">
                      📝 {item.exam.title}
                    </div>

                    {/* Teacher Feedback / Catatan Evaluasi */}
                    {item.feedback ? (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 space-y-1">
                        <div className="flex items-center space-x-1 font-semibold text-slate-800">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Catatan & Masukan Guru:</span>
                        </div>
                        <p className="italic leading-relaxed">"{item.feedback}"</p>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Belum ada catatan khusus dari guru.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
                    <span>Dikoreksi: {formatDate(item.gradedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
