import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examId, studentName, studentClass, essayAnswer, startedAt, isExpired } = body;

    if (!examId) {
      return NextResponse.json(
        { error: "ID Ujian tidak valid." },
        { status: 400 }
      );
    }

    if (!studentName || !studentName.trim()) {
      return NextResponse.json(
        { error: "Nama siswa wajib diisi." },
        { status: 400 }
      );
    }

    if (!studentClass || !studentClass.trim()) {
      return NextResponse.json(
        { error: "Kelas siswa wajib diisi." },
        { status: 400 }
      );
    }

    // Verify exam exists and is active
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam || !exam.isActive) {
      return NextResponse.json(
        { error: "Ujian tidak ditemukan atau sudah ditutup." },
        { status: 400 }
      );
    }

    const startDateTime = startedAt ? new Date(startedAt) : new Date();
    const submitDateTime = new Date();

    // Check if time exceeded exam duration (plus 2 mins buffer for network latency)
    const elapsedMinutes = (submitDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
    const expiredFlag = Boolean(isExpired) || elapsedMinutes > (exam.durationMinutes + 2);

    const submission = await prisma.submission.create({
      data: {
        examId,
        studentName: studentName.trim(),
        studentClass: studentClass.trim(),
        essayAnswer: essayAnswer ? essayAnswer.trim() : "<p><em>(Jawaban kosong / terkirim otomatis saat waktu habis)</em></p>",
        startedAt: startDateTime,
        submittedAt: submitDateTime,
        isExpired: expiredFlag,
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      isExpired: expiredFlag,
      message: expiredFlag
        ? "Waktu pengerjaan telah habis. Jawaban Anda berhasil dikumpulkan secara otomatis (Hangus/Waktu Habis)."
        : "Jawaban esai Anda berhasil dikirimkan ke guru untuk dinilai.",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Gagal mengirimkan jawaban esai." },
      { status: 500 }
    );
  }
}
