import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { submissions: true },
        },
      },
    });
    return NextResponse.json(exams);
  } catch (error) {
    console.error("Fetch exams error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar soal ujian." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subject, description, questionContent, durationMinutes, isActive } = body;

    if (!title || !questionContent) {
      return NextResponse.json(
        { error: "Judul ujian dan konten soal esai wajib diisi." },
        { status: 400 }
      );
    }

    // Enforce minimum 60 minutes duration
    const parsedDuration = parseInt(durationMinutes, 10);
    const validDuration = isNaN(parsedDuration) || parsedDuration < 60 ? 60 : parsedDuration;

    const newExam = await prisma.exam.create({
      data: {
        title: title.trim(),
        subject: subject ? subject.trim() : null,
        description: description ? description.trim() : null,
        questionContent: questionContent.trim(),
        durationMinutes: validDuration,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error("Create exam error:", error);
    return NextResponse.json(
      { error: "Gagal membuat soal ujian baru." },
      { status: 500 }
    );
  }
}
