import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Active exams available for students to take
    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subject: true,
        description: true,
        durationMinutes: true,
        createdAt: true,
      },
    });

    // 2. Announcements
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 10,
    });

    // 3. Published grades/evaluations
    // Sesuai konfirmasi user: "ya tampilkan semua biar mereka sadar dan paham untuk bahan evaluasi"
    // Tampilkan Nama Lengkap, Kelas, Nilai, dan Catatan Guru
    const publishedScores = await prisma.submission.findMany({
      where: {
        isPublished: true,
        score: { not: null },
      },
      orderBy: { gradedAt: "desc" },
      select: {
        id: true,
        studentName: true,
        studentClass: true,
        score: true,
        feedback: true,
        gradedAt: true,
        submittedAt: true,
        isExpired: true,
        exam: {
          select: {
            title: true,
            subject: true,
          },
        },
      },
    });

    return NextResponse.json({
      exams,
      announcements,
      publishedScores,
    });
  } catch (error) {
    console.error("Public data error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data publik." },
      { status: 500 }
    );
  }
}
