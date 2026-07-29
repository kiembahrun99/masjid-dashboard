# 🕌 MASJIDKU — Sistem Manajemen Masjid Modern

> **Dokumen Spesifikasi Produk (PRD) untuk AI Coding Agent**
> Versi 1.0 · Bahasa: Indonesia · Target: Web App (Responsive, Mobile-First)

---

## 📌 CARA PAKAI DOKUMEN INI

Hai Agent 👋 Dokumen ini adalah blueprint lengkap. Kerjakan **secara bertahap** sesuai urutan Fase di bagian `ROADMAP EKSEKUSI`. Jangan lompat fase. Setelah setiap fase selesai, jalankan build + lint dan laporkan hasilnya.

**Aturan wajib:**
1. Semua teks UI berbahasa **Indonesia** (kecuali istilah teknis yang umum).
2. Mobile-first. Desktop adalah enhancement, bukan sebaliknya.
3. Jangan pakai data dummy hardcoded di komponen — pakai layer `mock-data/` yang gampang diganti API asli.
4. Setiap fitur harus punya empty state, loading state, dan error state.
5. Aksesibilitas: kontras minimal WCAG AA, semua tombol punya `aria-label`.

---

## 1. 🎯 KONTEKS & MASALAH

Masjid di Indonesia masih mengelola operasional dengan cara manual: uang kas dicatat di buku tulis, pengumuman lewat papan tulis, jadwal imam ditulis di kertas, laporan keuangan diumumkan lisan tiap Jumat. Akibatnya:

- ❌ Transparansi keuangan rendah → jamaah kurang percaya
- ❌ Data jamaah & aset tidak terdata
- ❌ Jadwal kajian/imam sering bentrok atau lupa
- ❌ Program sosial (zakat, qurban, santunan) tidak terlacak
- ❌ Generasi muda tidak terlibat karena "terasa jadul"

**Solusi:** Dashboard manajemen masjid all-in-one dengan UI yang fresh, modern, dan bikin remaja masjid semangat pakai.

---

## 2. 👥 TARGET PENGGUNA & ROLE

| Role | Siapa | Akses Utama |
|---|---|---|
| **Super Admin** | Ketua DKM / Takmir | Semua fitur + manajemen user + setting masjid |
| **Bendahara** | Bendahara masjid | Keuangan, donasi, laporan, kas |
| **Sekretaris** | Sekretaris DKM | Jamaah, agenda, pengumuman, surat, inventaris |
| **Pengurus Program** | Remaja masjid / panitia | Kajian, event, zakat, qurban, TPQ |
| **Marbot / Petugas** | Petugas harian | Checklist kebersihan, jadwal adzan, inventaris |
| **Jamaah (Public View)** | Masyarakat umum | Halaman publik: laporan keuangan, jadwal, pengumuman (read-only, tanpa login) |

> Implementasi RBAC (Role Based Access Control). Menu di sidebar otomatis tersembunyi kalau role tidak punya akses.

---

## 3. 🧩 DAFTAR FITUR LENGKAP

### 3.1 🏠 Dashboard Utama (Beranda)

Halaman pertama setelah login. Isinya ringkasan cepat:

- **Hero Card Waktu Sholat** — jam sholat berikutnya + countdown besar (`02:14:33 menuju Ashar`), lokasi masjid, tanggal Hijriah + Masehi
- **4 Stat Card animated counter:**
  - Saldo Kas Masjid (Rp)
  - Donasi Bulan Ini (Rp) + % naik/turun vs bulan lalu
  - Total Jamaah Terdaftar
  - Agenda Minggu Ini
- **Grafik Arus Kas** — area chart 6 bulan terakhir (pemasukan vs pengeluaran)
- **Donut Chart** — komposisi sumber dana (Infaq Jumat, Kotak Amal, Donasi Online, Zakat, Lainnya)
- **Timeline Agenda Terdekat** — 5 event terdekat dengan countdown
- **Feed Aktivitas Terbaru** — "Bendahara mencatat pemasukan Rp 2.500.000", dsb.
- **Quick Action Floating Button** — Catat Pemasukan · Catat Pengeluaran · Buat Pengumuman · Tambah Agenda

---

### 3.2 💰 Manajemen Keuangan (Modul Paling Penting)

**a. Kas & Transaksi**
- Catat pemasukan & pengeluaran dengan kategori
- Kategori pemasukan: Infaq Jumat, Kotak Amal Harian, Donasi Perorangan, Donasi Perusahaan, Zakat, Sedekah, Wakaf, Hasil Usaha (parkir/kantin/sewa aula)
- Kategori pengeluaran: Listrik & Air, Gaji Marbot/Imam, Kebersihan, Perbaikan & Renovasi, Konsumsi Kajian, Operasional TPQ, Santunan, Peralatan, Lainnya
- Upload bukti transaksi (foto nota/struk)
- Filter: periode, kategori, jenis, pencari
- Saldo berjalan otomatis (running balance)

**b. Buku Kas Digital**
- Tampilan tabel ala buku kas: Tanggal · Uraian · Debit · Kredit · Saldo
- Export ke Excel & PDF
- Cetak laporan format standar DKM

**c. Laporan Keuangan**
- Laporan Mingguan (untuk diumumkan tiap Jumat) — auto-generate
- Laporan Bulanan & Tahunan
- **Poster Laporan Jumat** — generate gambar 1080x1080 siap posting ke WhatsApp/Instagram berisi ringkasan kas minggu ini 🔥 (fitur pembeda!)
- Perbandingan anggaran vs realisasi

**d. Anggaran (Budgeting)**
- Set target anggaran per kategori per bulan
- Progress bar konsumsi anggaran, warning kalau lebih dari 80%

**e. Donasi & Penggalangan Dana**
- Buat campaign donasi (contoh: "Renovasi Kubah Masjid — Target Rp 150jt")
- Progress bar target dana, jumlah donatur, sisa hari
- Halaman publik campaign + QRIS untuk share
- Daftar donatur (opsi anonim / hamba Allah)
- Ucapan terima kasih otomatis

---

### 3.3 🕋 Jadwal Sholat & Ibadah

- Jadwal sholat 5 waktu otomatis berdasarkan koordinat masjid (API Aladhan / hitung lokal)
- Setting metode perhitungan (Kemenag RI, MWL, dll) + koreksi menit manual
- Jadwal Imam & Muadzin harian/mingguan (drag & drop rotasi)
- Jadwal Khatib Jumat (nama, tema khutbah, kontak, status konfirmasi)
- Reminder otomatis ke petugas H-1 (WhatsApp/Notifikasi)
- Jadwal khusus Ramadhan: Imam Tarawih, Penceramah Kultum, Jadwal Imsakiyah
- Arah kiblat & countdown adzan

---

### 3.4 📅 Agenda & Kegiatan

- Kalender bulanan / mingguan / list view
- Jenis kegiatan: Kajian Rutin, Kajian Akbar, Pengajian Ibu-ibu, TPQ, Rapat DKM, Kerja Bakti, Santunan, Event Remaja Masjid, Peringatan Hari Besar Islam
- Detail: judul, pemateri, tema, waktu, tempat, target peserta, poster
- Kegiatan berulang (recurring) — mingguan/bulanan
- Absensi peserta (scan QR / manual)
- Anggaran per kegiatan → auto-link ke modul Keuangan
- Dokumentasi foto setelah acara
- Generate poster kegiatan otomatis (template siap share)

---

### 3.5 👨‍👩‍👧‍👦 Data Jamaah

- Database jamaah: nama, alamat, RT/RW, no HP, jenis kelamin, tanggal lahir, status (Jamaah Tetap / Musafir / Simpatisan)
- Data keluarga (kepala keluarga + anggota)
- Kategori khusus: Muallaf, Lansia, Yatim/Piatu, Dhuafa, Penerima Zakat (Mustahik), Pembayar Zakat (Muzakki)
- Import/export CSV
- Peta sebaran jamaah per RT (opsional)
- Ulang tahun jamaah bulan ini (buat ucapan)
- Catatan khusus (contoh: butuh santunan, sakit, dsb.)

---

### 3.6 🤲 Zakat, Infaq, Sedekah (ZIS)

- **Kalkulator Zakat** — Zakat Fitrah, Zakat Maal, Zakat Penghasilan, Zakat Perdagangan
- Pencatatan Muzakki (pembayar) & Mustahik (penerima)
- Distribusi zakat ke 8 asnaf dengan tracking
- Laporan penerimaan & penyaluran zakat
- Kwitansi digital zakat (PDF, bisa dikirim WA)
- Mode Ramadhan: input zakat fitrah massal (beras/uang) dengan hitung cepat

---

### 3.7 🐄 Manajemen Qurban (Musiman)

- Pendaftaran shohibul qurban (nama, jenis hewan, patungan/individu)
- Data hewan qurban: jenis, berat, harga, penjual, foto
- Manajemen patungan sapi (1 sapi = 7 orang) dengan slot tracker
- Pembagian daging: jumlah paket, daftar penerima, checklist distribusi
- Panitia & pembagian tugas
- Laporan qurban + sertifikat digital untuk shohibul qurban

---

### 3.8 📢 Pengumuman & Konten

- Buat pengumuman (judul, isi, kategori, prioritas, tanggal tayang & kedaluwarsa)
- Tampil di dashboard + halaman publik
- Generate poster pengumuman untuk share ke WhatsApp Group
- Arsip pengumuman
- Mode "Running Text" untuk ditampilkan di TV/layar masjid

---

### 3.9 📦 Inventaris & Aset

- Daftar aset: Karpet, Sound System, AC, Kipas, Mimbar, Al-Quran, Tikar, Genset, Kendaraan Ambulans, dll
- Data: nama, jumlah, kondisi (Baik/Rusak Ringan/Rusak Berat), tanggal beli, harga, lokasi, foto
- Peminjaman aset (siapa pinjam, kapan, kapan kembali)
- Jadwal maintenance & reminder (contoh: servis AC tiap 3 bulan)
- Nilai total aset masjid

---

### 3.10 🧹 Operasional Harian (Marbot)

- Checklist harian: sapu, pel, bersihkan toilet, isi galon, cek sound, kunci pintu
- Absensi petugas (check-in/check-out)
- Laporan kerusakan cepat (foto + deskripsi → notif ke pengurus)
- Log kegiatan harian

---

### 3.11 📖 TPQ / Madrasah (Opsional Modul)

- Data santri & pengajar
- Kelas & jadwal
- Absensi santri
- Progress hafalan / iqro (level tracker)
- SPP & pembayaran
- Rapor sederhana

---

### 3.12 🌐 Halaman Publik (Tanpa Login)

Subdomain/route `/publik` — supaya jamaah bisa lihat transparansi:

- Profil masjid + foto
- Jadwal sholat hari ini
- **Laporan keuangan terbuka** (grafik + ringkasan) ← membangun kepercayaan
- Agenda kegiatan mendatang
- Pengumuman terbaru
- Campaign donasi aktif + QRIS
- Kontak & lokasi (embed maps)

---

### 3.13 ⚙️ Pengaturan

- Profil masjid (nama, alamat, koordinat, logo, foto, kontak, rekening bank, QRIS)
- Manajemen pengguna & role
- Struktur organisasi DKM
- Kategori transaksi (custom)
- Backup & restore data (export JSON)
- Log aktivitas / audit trail
- Tema: Light / Dark / Auto

---

## 4. 🎨 DESIGN SYSTEM — "GEN Z ISLAMIC MODERN"

### 4.1 Prinsip Desain

> **Vibe:** Kalau Duolingo, Spotify, dan aplikasi fintech modern bikin app masjid. Bersih, playful tapi tetap respectful, banyak whitespace, sudut membulat, dan micro-interaction yang bikin nagih.

**Do:**
- ✅ Rounded corners besar (`rounded-2xl` sampai `rounded-3xl`)
- ✅ Soft shadow, bukan border tebal
- ✅ Gradient halus (mesh gradient) di hero & card penting
- ✅ Glassmorphism tipis untuk overlay & bottom nav
- ✅ Bento grid layout untuk dashboard
- ✅ Emoji & ikon sebagai penanda kategori (tapi jangan berlebihan)
- ✅ Micro-animation: hover lift, counter count-up, skeleton shimmer, confetti saat target donasi tercapai 🎉
- ✅ Ornamen geometri Islami sebagai background pattern (opacity 3-5%, subtle banget)
- ✅ Dark mode yang beneran enak dilihat, bukan sekadar invert

**Don't:**
- ❌ Kaligrafi berlebihan / ornamen emas kitsch
- ❌ Warna hijau tua + kuning emas ala template masjid 2010
- ❌ Tabel padat tanpa spacing
- ❌ Font serif klasik untuk body text
- ❌ Gambar kubah/masjid clipart

### 4.2 Palet Warna

```css
/* LIGHT MODE */
--bg-base:        #F7F8FA;   /* abu sangat terang */
--bg-surface:     #FFFFFF;
--bg-subtle:      #F1F3F7;

--primary:        #16A34A;   /* Emerald — hijau segar, bukan hijau tua */
--primary-hover:  #15803D;
--primary-soft:   #DCFCE7;

--accent:         #6366F1;   /* Indigo — untuk highlight & CTA sekunder */
--accent-soft:    #E0E7FF;

--gold:           #F59E0B;   /* Amber — untuk zakat/donasi, bukan emas norak */
--danger:         #EF4444;   /* pengeluaran */
--success:        #10B981;   /* pemasukan */
--info:           #0EA5E9;

--text-primary:   #0F172A;
--text-secondary: #64748B;
--text-muted:     #94A3B8;
--border:         #E2E8F0;

/* DARK MODE */
--bg-base-dark:     #0B0F14;
--bg-surface-dark:  #151B23;
--bg-subtle-dark:   #1E262F;
--text-primary-dark:#F1F5F9;
--border-dark:      #263141;

/* GRADIENT SIGNATURE */
--gradient-hero:  linear-gradient(135deg, #16A34A 0%, #059669 45%, #0EA5E9 100%);
--gradient-donasi:linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
--gradient-mesh:  radial-gradient(at 20% 20%, #DCFCE7 0px, transparent 50%),
                  radial-gradient(at 80% 0%, #E0E7FF 0px, transparent 50%),
                  radial-gradient(at 60% 90%, #FEF3C7 0px, transparent 50%);
```

### 4.3 Tipografi

```
Heading & UI : "Plus Jakarta Sans" (fallback: Inter, system-ui)
Body         : "Inter"
Angka/Nominal: "Space Grotesk" atau tabular-nums dari Inter
Arab         : "Amiri Quran" / "Scheherazade New" (khusus teks Arab saja)
```

Skala: `12 · 14 · 16 · 20 · 24 · 32 · 40 · 56`
Heading pakai `font-weight: 700-800`, `letter-spacing: -0.02em` (tight, modern).
Nominal uang selalu `tabular-nums` biar rata.

### 4.4 Komponen Kunci

| Komponen | Spesifikasi |
|---|---|
| **Card** | `rounded-3xl`, `p-6`, `shadow-[0_2px_12px_rgba(15,23,42,0.06)]`, hover: `translate-y-[-2px]` + shadow naik |
| **Stat Card** | Ikon dalam squircle berwarna soft, angka besar `text-3xl font-extrabold`, badge tren (↑12%) |
| **Button Primary** | `rounded-full`, `px-6 py-3`, gradient, `active:scale-95`, transisi 150ms |
| **Input** | `rounded-2xl`, `bg-subtle`, border transparan, focus: ring 2px primary + bg putih |
| **Sidebar (Desktop)** | Fixed kiri 260px, ikon + label, item aktif = pill background primary-soft |
| **Bottom Nav (Mobile)** | 5 item, glassmorphism, ikon aktif membesar + label muncul, floating `rounded-3xl` di atas safe-area |
| **Table** | Zebra halus, header sticky, `rounded-2xl` overflow hidden, di mobile berubah jadi card list |
| **Modal** | Center di desktop, **bottom sheet** di mobile dengan drag handle |
| **Chart** | Recharts, gradient fill, tanpa gridline vertikal, tooltip rounded gelap |
| **Empty State** | Ilustrasi sederhana + copy santai ("Belum ada transaksi nih. Yuk catat yang pertama! ✨") |
| **Toast** | Muncul dari atas, rounded-full, ikon + teks singkat |

### 4.5 Copywriting (Tone of Voice)

Ramah, ringkas, sedikit playful — tapi tetap sopan dan tidak lebay.

| Konteks | ❌ Jangan | ✅ Pakai |
|---|---|---|
| Empty state | "Data tidak ditemukan" | "Belum ada data di sini. Yuk mulai tambah! ✨" |
| Sukses simpan | "Data berhasil disimpan" | "Tersimpan! Barakallahu fiik 🤲" |
| Konfirmasi hapus | "Anda yakin?" | "Yakin mau hapus? Aksi ini nggak bisa dibatalkan ya." |
| Target tercapai | "Target terpenuhi" | "MasyaAllah! Target donasi tercapai 🎉" |
| Loading | "Loading..." | "Sebentar ya..." |

---

## 5. 🛠️ SPESIFIKASI TEKNIS

### 5.1 Tech Stack

```
Framework    : Next.js 14+ (App Router) + TypeScript
Styling      : Tailwind CSS + shadcn/ui
Ikon         : lucide-react
Chart        : Recharts
Animasi      : Framer Motion
Form         : React Hook Form + Zod
State        : Zustand (global) + TanStack Query (server state)
Tabel        : TanStack Table
Database     : PostgreSQL + Prisma  (fase awal: mock JSON / localStorage)
Auth         : NextAuth.js (Credentials + Google)
Tanggal      : date-fns + hijri-date untuk kalender Hijriah
Export       : xlsx (Excel), jspdf + html2canvas (PDF & poster)
Upload       : UploadThing / Cloudinary
Jadwal Sholat: api.aladhan.com atau library adhan-js (offline)
```

> Kalau agent tidak bisa setup database di awal, **wajib** buat layer abstraksi `lib/data-provider.ts` supaya nanti gampang switch dari mock ke API asli.

### 5.2 Struktur Folder

```
/app
  /(auth)/login
  /(dashboard)
    /page.tsx                 → Beranda
    /keuangan
      /transaksi
      /buku-kas
      /laporan
      /anggaran
      /donasi
    /jadwal
      /sholat
      /imam-khatib
    /agenda
    /jamaah
    /zis
    /qurban
    /pengumuman
    /inventaris
    /operasional
    /tpq
    /pengaturan
  /publik
/components
  /ui            → shadcn base
  /layout        → Sidebar, Topbar, BottomNav
  /charts
  /shared        → StatCard, EmptyState, PageHeader, DataTable
  /features      → komponen per modul
/lib
  /utils.ts
  /data-provider.ts
  /prayer-time.ts
  /hijri.ts
  /currency.ts   → formatRupiah()
  /permissions.ts
/mock-data
/types
/hooks
/store
```

### 5.3 Skema Data Inti (Prisma-style)

```prisma
model Masjid {
  id, nama, alamat, kelurahan, kecamatan, kota, provinsi,
  latitude, longitude, logoUrl, fotoUrl, telepon, email,
  rekeningBank, nomorRekening, qrisUrl, metodeHisab, koreksiMenit
}

model User {
  id, nama, email, password, role, avatarUrl, aktif, masjidId
}
// role: SUPER_ADMIN | BENDAHARA | SEKRETARIS | PENGURUS | MARBOT

model Transaksi {
  id, tanggal, jenis (MASUK|KELUAR), kategoriId, nominal,
  uraian, buktiUrl, metodeBayar (TUNAI|TRANSFER|QRIS),
  agendaId?, campaignId?, dicatatOlehId, createdAt
}

model KategoriTransaksi { id, nama, jenis, ikon, warna }

model Anggaran { id, kategoriId, bulan, tahun, targetNominal }

model Campaign {
  id, judul, deskripsi, targetDana, danaTerkumpul,
  tanggalMulai, tanggalSelesai, gambarUrl, status, slug
}

model Donatur { id, nama, noHp, anonim, campaignId, nominal, tanggal, pesan }

model Jamaah {
  id, nama, nik?, alamat, rt, rw, noHp, jenisKelamin,
  tanggalLahir, status, kategori[], kepalaKeluargaId?, catatan
}

model Agenda {
  id, judul, deskripsi, jenis, tanggalMulai, tanggalSelesai,
  lokasi, pemateri, posterUrl, anggaran, recurring, recurringRule,
  status (RENCANA|BERLANGSUNG|SELESAI|BATAL)
}

model Kehadiran { id, agendaId, jamaahId, waktuHadir }

model JadwalPetugas {
  id, tanggal, peran (IMAM|MUADZIN|KHATIB|PENCERAMAH),
  waktuSholat, petugasNama, kontak, tema?, statusKonfirmasi
}

model Pengumuman {
  id, judul, isi, kategori, prioritas, tanggalTayang,
  tanggalKedaluwarsa, tampilPublik, dibuatOlehId
}

model Inventaris {
  id, nama, kategori, jumlah, kondisi, tanggalBeli, hargaBeli,
  lokasi, fotoUrl, jadwalMaintenance?
}

model Peminjaman { id, inventarisId, peminjam, tanggalPinjam, tanggalKembali, status }

model Zakat {
  id, jenis (FITRAH|MAAL|PENGHASILAN|PERDAGANGAN),
  muzakkiNama, jumlahJiwa?, nominal?, beratBeras?, tanggal, tahunHijriah
}

model PenyaluranZakat { id, asnaf, penerimaNama, nominal, tanggal, keterangan }

model Qurban {
  id, tahun, shohibulNama, jenisHewan (SAPI|KAMBING|DOMBA),
  tipeQurban (INDIVIDU|PATUNGAN), slotKe?, hewanId, nominal, lunas
}

model HewanQurban { id, tahun, jenis, berat, hargaBeli, penjual, fotoUrl, jumlahSlot }

model ChecklistHarian { id, tanggal, tugas, selesai, petugasId, waktuSelesai }

model LogAktivitas { id, userId, aksi, modul, detail, createdAt }
```

### 5.4 Aturan Format

- Mata uang: `Rp 2.500.000` (titik pemisah ribuan, tanpa desimal)
- Tanggal: `29 Juli 2026` · pendek: `29 Jul 2026` · dengan hari: `Rabu, 29 Juli 2026`
- Hijriah tampil di bawah Masehi: `14 Safar 1448 H`
- Waktu: format 24 jam `05:12`
- Angka besar di stat card boleh disingkat: `Rp 2,5 jt` dengan tooltip nilai penuh

---

## 6. 🗺️ ROADMAP EKSEKUSI (untuk Agent)

### FASE 1 — Fondasi ⚙️
- [ ] Setup Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Implementasi design token (warna, font, spacing) di `tailwind.config.ts` + `globals.css`
- [ ] Layout shell: Sidebar desktop, Topbar, Bottom Nav mobile, dark mode toggle
- [ ] Komponen shared: `StatCard`, `PageHeader`, `EmptyState`, `DataTable`, `Modal/BottomSheet`, `Toast`
- [ ] Helper: `formatRupiah`, `formatTanggal`, `toHijri`
- [ ] Halaman login (UI saja dulu) + mock auth dengan role switcher

### FASE 2 — Dashboard & Keuangan 💰 (prioritas tertinggi)
- [ ] Halaman Beranda lengkap dengan bento grid, chart, countdown sholat
- [ ] CRUD Transaksi + kategori + upload bukti
- [ ] Buku Kas dengan running balance
- [ ] Filter, search, pagination
- [ ] Export Excel & PDF
- [ ] Halaman Laporan Bulanan + generator Poster Laporan Jumat

### FASE 3 — Jadwal & Agenda 📅
- [ ] Jadwal sholat otomatis + countdown + setting koreksi
- [ ] Jadwal Imam/Muadzin/Khatib dengan drag & drop
- [ ] Kalender agenda (month/week/list view) + CRUD kegiatan
- [ ] Absensi peserta

### FASE 4 — Jamaah, Pengumuman, Inventaris 👥
- [ ] CRUD Jamaah + import/export CSV + filter kategori
- [ ] Pengumuman + generator poster
- [ ] Inventaris + peminjaman + reminder maintenance
- [ ] Checklist operasional harian

### FASE 5 — Donasi & ZIS 🤲
- [ ] Campaign donasi + progress bar + halaman publik + QRIS
- [ ] Kalkulator zakat (4 jenis)
- [ ] Pencatatan muzakki & penyaluran 8 asnaf
- [ ] Kwitansi digital PDF

### FASE 6 — Modul Musiman & Publik 🌐
- [ ] Modul Qurban lengkap
- [ ] Modul Ramadhan (imsakiyah, jadwal tarawih, kultum)
- [ ] Halaman publik `/publik` (transparansi keuangan, jadwal, agenda)
- [ ] Modul TPQ

### FASE 7 — Polish & Integrasi ✨
- [ ] Framer Motion micro-interaction di semua transisi halaman
- [ ] Skeleton loading di semua data fetch
- [ ] PWA: installable, offline shell, ikon, splash screen
- [ ] Notifikasi WhatsApp (Fonnte/Wablas) untuk reminder petugas
- [ ] Audit aksesibilitas + Lighthouse (target: Performance >90, A11y >95)
- [ ] Seed data realistis untuk demo

---

## 7. ✅ DEFINITION OF DONE

Setiap fitur dianggap selesai jika:

1. Responsive di 375px, 768px, 1440px — tidak ada horizontal scroll
2. Punya loading, empty, error, dan success state
3. Dark mode tampil benar
4. Form punya validasi Zod + pesan error bahasa Indonesia
5. Tidak ada `console.error` dan tidak ada TypeScript error
6. Semua nominal pakai `formatRupiah`, semua tanggal pakai helper tanggal
7. Bisa diakses keyboard (Tab, Enter, Esc)
8. Data mengalir lewat `data-provider`, bukan hardcoded di komponen

---

## 8. 💡 IDE PEMBEDA (Nice to Have)

Kalau fase utama sudah kelar, ini bikin produk terasa spesial:

- 🎉 **Confetti** saat target donasi tercapai
- 📸 **Auto-Poster Generator** — laporan keuangan & pengumuman jadi gambar siap posting IG/WA
- 📺 **Mode Layar Masjid** — tampilan fullscreen jam digital + jadwal sholat + running text untuk TV di masjid
- 🏆 **Leaderboard Kegiatan Remaja Masjid** — gamifikasi keaktifan pengurus (poin & badge)
- 🔔 **Smart Reminder** — otomatis WA ke khatib H-2 kalau belum konfirmasi
- 🗣️ **Voice Input** untuk marbot mencatat pengeluaran cepat
- 📊 **Widget Transparansi Embed** — kode iframe supaya laporan keuangan bisa ditempel di website lain
- 🌙 **Ramadhan Mode** — tema UI berubah + fitur imsakiyah & jadwal tarawih otomatis aktif
- 🤖 **AI Ringkasan Bulanan** — auto-generate narasi laporan untuk dibacakan saat rapat DKM

---

## 9. 🚫 OUT OF SCOPE (Versi 1)

- Payment gateway langsung (cukup QRIS statis + konfirmasi manual)
- Aplikasi mobile native (PWA sudah cukup)
- Multi-masjid / multi-tenant (fokus 1 masjid dulu)
- Live streaming kajian
- Integrasi accounting software eksternal

---

**Mulai dari FASE 1. Laporkan progres setelah tiap fase selesai. Bismillah 🚀**
