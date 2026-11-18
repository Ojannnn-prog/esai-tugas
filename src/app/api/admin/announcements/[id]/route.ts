import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.announcement.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Pengumuman berhasil dihapus." });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pengumuman." },
      { status: 500 }
    );
  }
}
