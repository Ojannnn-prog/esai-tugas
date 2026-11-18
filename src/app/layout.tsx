import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Ujian Esai Siswa & Penilaian Guru",
  description: "Platform ujian esai interaktif tanpa login dengan editor teks kaya ala blog dan sistem penilaian terpadu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
