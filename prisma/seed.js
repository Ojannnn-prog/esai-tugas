const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed default admin
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: "admin" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin231", 10);
    await prisma.admin.create({
      data: {
        username: "admin",
        password: hashedPassword,
        name: "Administrator Utama",
      },
    });
    console.log("Default admin created (username: admin, password: admin231)");
  } else {
    // Update password if needed to ensure it matches admin231
    const hashedPassword = await bcrypt.hash("admin231", 10);
    await prisma.admin.update({
      where: { username: "admin" },
      data: { password: hashedPassword },
    });
    console.log("Admin account verified/updated.");
  }

  // Seed sample announcement if none exists
  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.create({
      data: {
        title: "Selamat Datang di Portal Ujian Esai Terpadu",
        content:
          "Siswa dapat langsung memilih soal ujian yang tersedia di bawah ini tanpa perlu login. Masukkan Nama Lengkap dan Kelas dengan benar sebelum mengerjakan. Waktu ujian minimal 60 menit dan timer akan otomatis mengunci saat batas waktu berakhir.",
        isPinned: true,
      },
    });
    console.log("Initial announcement created.");
  }

  // Seed a sample exam if none exists
  const examCount = await prisma.exam.count();
  if (examCount === 0) {
    await prisma.exam.create({
      data: {
        title: "Ujian Esai Tengah Semester: Literasi Digital & Etika Berinternet",
        subject: "Bahasa Indonesia & TIK",
        description: "Ujian pemahaman kritis mengenai dampak kecerdasan buatan dan etika berselancar di dunia maya bagi generasi muda.",
        questionContent: `<h3>Petunjuk Pengerjaan Soal:</h3>
<p>Jawablah pertanyaan esai di bawah ini secara mendalam dan terstruktur. Gunakan kaidah bahasa yang baik dan benar.</p>
<hr />
<h3>Pertanyaan Esai:</h3>
<ol>
  <li><strong>Analisis Kritis:</strong> Bagaimana perkembangan teknologi informasi dan kecerdasan buatan (AI) memengaruhi gaya belajar siswa saat ini? Berikan contoh konkret dari pengalaman Anda!</li>
  <li><strong>Studi Kasus & Etika:</strong> Banyak tantangan terkait penyebaran informasi palsu (hoaks) dan pelanggaran privasi di media sosial. Strategi konkret apa yang harus dilakukan oleh pelajar untuk menjaga integritas dan keamanan digital?</li>
  <li><strong>Solusi Masa Depan:</strong> Rumuskan gagasan orisinal Anda mengenai bagaimana sekolah dan generasi muda dapat memanfaatkan teknologi secara produktif tanpa kehilangan nilai-nilai kemanusiaan dan empati.</li>
</ol>`,
        durationMinutes: 60,
        isActive: true,
      },
    });
    console.log("Sample exam created.");
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
