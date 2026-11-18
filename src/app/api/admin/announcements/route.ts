import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Fetch announcements error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar pengumuman." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, isPinned } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul dan isi pengumuman wajib diisi." },
        { status: 400 }
      );
    }

    const created = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        isPinned: Boolean(isPinned),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pengumuman baru." },
      { status: 500 }
    );
  }
}
