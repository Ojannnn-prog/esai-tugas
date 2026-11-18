# Portal Ujian Esai Siswa & Penilaian Guru

Aplikasi web modern berbasis **Next.js 15**, **Prisma ORM**, **Neon PostgreSQL**, dan **Tiptap Rich Text Editor** untuk ujian esai mandiri siswa tanpa perlu login dan sistem manajemen & penilaian esai oleh guru/admin.

---

## 🌟 Fitur Utama

### 🎓 Sisi Siswa (Tanpa Perlu Login)
- **Akses Langsung**: Siswa dapat langsung melihat daftar soal ujian esai yang aktif tanpa harus mendaftar atau login.
- **Identitas Siswa**: Cukup mengisi **Nama Lengkap** dan **Kelas** pada lembar jawaban.
- **Editor Esai Kaya (WordPress / Blog Style)**:
  - Format teks: Tebal (Bold), Miring (Italic), Garis Bawah (Underline), Coret (Strikethrough), Kode.
  - Penataan Paragraf: **Rata Kiri**, **Rata Tengah**, **Rata Kanan**, dan **Rata Kiri-Kanan (Justify)**.
  - Struktur Tulisan: Judul (H1, H2, H3), Daftar Poin (Bullet List), Daftar Nomor (Numbered List), Kutipan (Blockquote), Garis Pemisah (Horizontal Rule).
  - Penghitung kata (*word count*) dan karakter (*character count*) real-time.
  - Penyimpanan draf otomatis secara lokal (*autosave draft*) agar jawaban tidak hilang bila halaman tidak sengaja tertutup.
- **Batas Waktu Minimal 60 Menit**:
  - Countdown timer hitung mundur visual dengan peringatan warna saat waktu menipis.
  - **Opsi A (Auto-Submit)**: Bila waktu mencapai `00:00:00`, lembar jawaban otomatis terkunci dan draf jawaban terkirim ke database dengan penanda status *"Waktu Habis / Hangus"*.
- **Papan Pengumuman & Hasil Nilai Transparan**:
  - Halaman awal beranda memuat papan pengumuman guru serta hasil penilaian esai (Nama Siswa, Kelas, Judul Ujian, Nilai 0-100, dan Catatan Guru) untuk bahan evaluasi bersama.

### 🛡️ Sisi Admin / Guru (Dengan Login & Proteksi)
- **Tombol Login Admin**: Tersedia di navigasi atas halaman utama.
- **Kredensial Default**:
  - **Username**: `admin`
  - **Password**: `admin231`
- **Kelola Soal Esai**:
  - Buat soal ujian baru lengkap dengan teks pertanyaan kaya.
  - Validasi batas waktu pengerjaan minimal **60 menit**.
  - Buka/tutup sesi pengerjaan siswa (Aktif / Non-aktif).
- **Koreksi & Penilaian Jawaban Siswa**:
  - Membaca jawaban esai siswa lengkap dengan format aslinya, jumlah kata, dan durasi pengerjaan.
  - Berikan skor numerik (0–100) dan catatan/feedback evaluasi bagi siswa.
  - Pilihan untuk langsung mengirimkan/menerbitkan nilai ke **Dashboard Pengumuman Beranda**.
- **Kelola Pengumuman**:
  - Buat pengumuman umum dan sematkan (*pin*) pengumuman penting di halaman depan.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS 3
- **ORM**: Prisma Client & Prisma CLI
- **Database**: Neon Serverless PostgreSQL
- **Rich Text Editor**: Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-text-align`, `@tiptap/extension-underline`)
- **Authentication**: JWT Cookie (`jose`, `bcryptjs`) & Next.js Middleware
- **Deployment**: Vercel Ready

---

## 🚀 Cara Menjalankan Secara Lokal

### 1. Clone & Masuk Direktori
```bash
git clone https://github.com/Ojannnn-prog/esai-tugas.git
cd esai-tugas
```

### 2. Install Dependensi
```bash
npm install --legacy-peer-deps
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat berkas `.env` dan masukkan connection string Neon DB:
```env
DATABASE_URL="postgresql://neondb_owner:npg_s0XdbmoNG5nE@ep-frosty-glitter-az6qde1l-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="esai-tugas-super-secret-key-2026-production"
```

### 4. Sinkronisasi Database & Seed Admin
```bash
# Push skema ke Neon DB
npx prisma db push

# Generate client
npx prisma generate

# Seed akun default admin (admin : admin231) dan data awal
npm run prisma:seed
```

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🌐 Panduan Deploy ke Vercel

1. Buka dashboard [Vercel](https://vercel.com/) dan klik **Add New Project**.
2. Hubungkan repositori GitHub: `https://github.com/Ojannnn-prog/esai-tugas.git`.
3. Pada bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL`: Isi dengan connection string Neon PostgreSQL Anda.
   - `JWT_SECRET`: Buat string rahasia untuk token login admin (contoh: `kunci-rahasia-esai-2026`).
4. Klik **Deploy**.
5. Setelah selesai, aplikasi Anda sudah dapat diakses online oleh siswa dan guru!
