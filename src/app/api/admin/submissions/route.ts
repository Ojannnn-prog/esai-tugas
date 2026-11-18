import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("examId");
    const status = searchParams.get("status"); // "graded" | "pending"
    const search = searchParams.get("search");

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

    const submissions = await prisma.submission.findMany({
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
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar jawaban siswa." },
      { status: 500 }
    );
  }
}
