import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        exam: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Jawaban siswa tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Get submission detail error:", error);
    return NextResponse.json(
      { error: "Gagal memuat detail jawaban siswa." },
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
    const { score, feedback, isPublished } = body;

    let parsedScore: number | null = null;
    if (score !== undefined && score !== null && score !== "") {
      parsedScore = parseFloat(score);
      if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
        return NextResponse.json(
          { error: "Nilai harus berupa angka antara 0 dan 100." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        score: parsedScore,
        feedback: feedback !== undefined ? feedback : undefined,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
        gradedAt: parsedScore !== null ? new Date() : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Grade submission error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan penilaian." },
      { status: 500 }
    );
  }
}
