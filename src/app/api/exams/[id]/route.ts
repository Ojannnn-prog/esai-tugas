import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exam = await prisma.exam.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        subject: true,
        description: true,
        questionContent: true,
        durationMinutes: true,
        isActive: true,
      },
    });

    if (!exam || !exam.isActive) {
      return NextResponse.json(
        { error: "Soal ujian tidak ditemukan atau sedang tidak aktif." },
        { status: 404 }
      );
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Get exam student error:", error);
    return NextResponse.json(
      { error: "Gagal memuat soal ujian." },
      { status: 500 }
    );
  }
}
