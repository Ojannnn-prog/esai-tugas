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
      include: {
        submissions: {
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Ujian tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(exam);
  } catch (error) {
    console.error("Get exam detail error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail soal ujian." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, subject, description, questionContent, durationMinutes, isActive } = body;

    const parsedDuration = parseInt(durationMinutes, 10);
    const validDuration = isNaN(parsedDuration) || parsedDuration < 60 ? 60 : parsedDuration;

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        title: title?.trim(),
        subject: subject !== undefined ? (subject ? subject.trim() : null) : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        questionContent: questionContent?.trim(),
        durationMinutes: validDuration,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json(updatedExam);
  } catch (error) {
    console.error("Update exam error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui soal ujian." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.exam.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Soal ujian berhasil dihapus." });
  } catch (error) {
    console.error("Delete exam error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus soal ujian." },
      { status: 500 }
    );
  }
}
