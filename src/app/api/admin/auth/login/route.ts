import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAdminToken, COOKIE_NAME } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Direct check for specified admin credentials or verify in database
    let admin = await prisma.admin.findUnique({
      where: { username },
    });

    // Auto-create or verify if default admin
    if (!admin && username === "admin" && password === "admin231") {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
          name: "Administrator Utama",
        },
      });
    }

    if (!admin) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Verify password against hash, or fallback check
    const isPasswordValid =
      (await bcrypt.compare(password, admin.password)) ||
      (username === "admin" && password === "admin231");

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signAdminToken({
      id: admin.id,
      username: admin.username,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server saat login." },
      { status: 500 }
    );
  }
}
