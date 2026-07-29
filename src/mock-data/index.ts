import type {
  User, Transaksi, KategoriTransaksi, Anggaran, Campaign, Donatur,
  Jamaah, Agenda, Kehadiran, JadwalPetugas, Pengumuman, Inventaris,
  Peminjaman, Zakat, PenyaluranZakat, Qurban, HewanQurban,
  ChecklistHarian, LogAktivitas, Masjid,
} from '@/types';

const now = new Date();
const today = now.toISOString().split('T')[0];

export const mockMasjid: Masjid = {
  id: 'msj-1',
  nama: 'Masjid Al Qohar',
  alamat: 'Jl. Lidah Kulon No. 45, Lidah Kulon',
  kelurahan: 'Lidah Kulon',
  kecamatan: 'Lakarsantri',
  kota: 'Surabaya',
  provinsi: 'Jawa Timur',
  latitude: -7.2969,
  longitude: 112.6749,
  logoUrl: '',
  fotoUrl: '',
  telepon: '031-1234567',
  email: 'masjid.alqohar@email.com',
  rekeningBank: 'Bank Syariah Indonesia',
  nomorRekening: '1234567890',
  qrisUrl: '',
  metodeHisab: 'KEMENAG',
  koreksiMenit: 2,
};

export const mockUsers: User[] = [
  { id: 'u1', nama: 'Ahmad Fauzi', email: 'admin@masjid.app', password: 'admin123', role: 'SUPER_ADMIN', avatarUrl: '', aktif: true, masjidId: 'msj-1' },
  { id: 'u2', nama: 'Budi Santoso', email: 'bendahara@masjid.app', password: 'bendahara123', role: 'BENDAHARA', avatarUrl: '', aktif: true, masjidId: 'msj-1' },
  { id: 'u3', nama: 'Citra Dewi', email: 'sekretaris@masjid.app', password: 'sekretaris123', role: 'SEKRETARIS', avatarUrl: '', aktif: true, masjidId: 'msj-1' },
  { id: 'u4', nama: 'Doni Prasetyo', email: 'pengurus@masjid.app', password: 'pengurus123', role: 'PENGURUS', avatarUrl: '', aktif: true, masjidId: 'msj-1' },
  { id: 'u5', nama: 'Eko Saputra', email: 'marbot@masjid.app', password: 'marbot123', role: 'MARBOT', avatarUrl: '', aktif: true, masjidId: 'msj-1' },
];

export const mockKategoriTransaksi: KategoriTransaksi[] = [
  { id: 'kt-1', nama: 'Infaq Jumat', jenis: 'MASUK', ikon: 'HandCoins', warna: '#16A34A' },
  { id: 'kt-2', nama: 'Kotak Amal Harian', jenis: 'MASUK', ikon: 'Coffe', warna: '#22C55E' },
  { id: 'kt-3', nama: 'Donasi Perorangan', jenis: 'MASUK', ikon: 'UserPlus', warna: '#6366F1' },
  { id: 'kt-4', nama: 'Donasi Perusahaan', jenis: 'MASUK', ikon: 'Building2', warna: '#0EA5E9' },
  { id: 'kt-5', nama: 'Zakat', jenis: 'MASUK', ikon: 'Heart', warna: '#F59E0B' },
  { id: 'kt-6', nama: 'Sedekah', jenis: 'MASUK', ikon: 'Gift', warna: '#10B981' },
  { id: 'kt-7', nama: 'Wakaf', jenis: 'MASUK', ikon: 'Landmark', warna: '#8B5CF6' },
  { id: 'kt-8', nama: 'Hasil Usaha', jenis: 'MASUK', ikon: 'Store', warna: '#EC4899' },
  { id: 'kt-9', nama: 'Listrik & Air', jenis: 'KELUAR', ikon: 'Zap', warna: '#EF4444' },
  { id: 'kt-10', nama: 'Gaji Marbot/Imam', jenis: 'KELUAR', ikon: 'Users', warna: '#F97316' },
  { id: 'kt-11', nama: 'Kebersihan', jenis: 'KELUAR', ikon: 'SprayCan', warna: '#06B6D4' },
  { id: 'kt-12', nama: 'Perbaikan & Renovasi', jenis: 'KELUAR', ikon: 'Hammer', warna: '#F43F5E' },
  { id: 'kt-13', nama: 'Konsumsi Kajian', jenis: 'KELUAR', ikon: 'Utensils', warna: '#84CC16' },
  { id: 'kt-14', nama: 'Operasional TPQ', jenis: 'KELUAR', ikon: 'BookOpen', warna: '#14B8A6' },
  { id: 'kt-15', nama: 'Santunan', jenis: 'KELUAR', ikon: 'HeartHandshake', warna: '#FF6900' },
  { id: 'kt-16', nama: 'Peralatan', jenis: 'KELUAR', ikon: 'Package', warna: '#7C3AED' },
  { id: 'kt-17', nama: 'Lainnya', jenis: 'KELUAR', ikon: 'MoreHorizontal', warna: '#64748B' },
];

const dateSub = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const mockTransaksi: Transaksi[] = [
  { id: 'tr-1', tanggal: dateSub(0), jenis: 'MASUK', kategoriId: 'kt-1', nominal: 3500000, uraian: 'Infaq Jumat 25 Juli 2026', metodeBayar: 'TUNAI', dicatatOlehId: 'u2', createdAt: dateSub(0) },
  { id: 'tr-2', tanggal: dateSub(1), jenis: 'MASUK', kategoriId: 'kt-2', nominal: 875000, uraian: 'Kotak amal harian', metodeBayar: 'TUNAI', dicatatOlehId: 'u2', createdAt: dateSub(1) },
  { id: 'tr-3', tanggal: dateSub(2), jenis: 'MASUK', kategoriId: 'kt-3', nominal: 5000000, uraian: 'Donasi H. Rahmat untuk pembangunan', metodeBayar: 'TRANSFER', dicatatOlehId: 'u2', createdAt: dateSub(2) },
  { id: 'tr-4', tanggal: dateSub(2), jenis: 'KELUAR', kategoriId: 'kt-9', nominal: 1200000, uraian: 'Tagihan listrik Juli 2026', metodeBayar: 'TRANSFER', dicatatOlehId: 'u2', createdAt: dateSub(2) },
  { id: 'tr-5', tanggal: dateSub(3), jenis: 'KELUAR', kategoriId: 'kt-10', nominal: 3000000, uraian: 'Gaji marbot & imam bulan Juli', metodeBayar: 'TUNAI', dicatatOlehId: 'u2', createdAt: dateSub(3) },
  { id: 'tr-6', tanggal: dateSub(3), jenis: 'MASUK', kategoriId: 'kt-5', nominal: 2500000, uraian: 'Zakat fitrah & maal', metodeBayar: 'TUNAI', dicatatOlehId: 'u2', createdAt: dateSub(3) },
  { id: 'tr-7', tanggal: dateSub(5), jenis: 'KELUAR', kategoriId: 'kt-13', nominal: 750000, uraian: 'Konsumsi kajian rutin Rabu', metodeBayar: 'TUNAI', dicatatOlehId: 'u2', createdAt: dateSub(5) },
  { id: 'tr-8', tanggal: dateSub(7), jenis: 'MASUK', kategoriId: 'kt-4', nominal: 10000000, uraian: 'Donasi PT Berkah Sejahtera', metodeBayar: 'TRANSFER', dicatatOlehId: 'u2', createdAt: dateSub(7) },
  { id: 'tr-9', tanggal: dateSub(7), jenis: 'KELUAR', kategoriId: 'kt-12', nominal: 4500000, uraian: 'Perbaikan kubah bocor', metodeBayar: 'TUNAI', dicatatOlehId: 'u2', createdAt: dateSub(7) },
  { id: 'tr-10', tanggal: dateSub(10), jenis: 'MASUK', kategoriId: 'kt-6', nominal: 500000, uraian: 'Sedekah jamaah anonim', metodeBayar: 'QRIS', dicatatOlehId: 'u2', createdAt: dateSub(10) },
  { id: 'tr-11', tanggal: dateSub(10), jenis: 'KELUAR', kategoriId: 'kt-15', nominal: 2000000, uraian: 'Santunan anak yatim 10 orang', metodeBayar: 'TUNAI', dicatatOlehId: 'u2', createdAt: dateSub(10) },
  { id: 'tr-12', tanggal: dateSub(14), jenis: 'MASUK', kategoriId: 'kt-7', nominal: 15000000, uraian: 'Wakaf tunai Bapak H. Ahmad', metodeBayar: 'TRANSFER', dicatatOlehId: 'u2', createdAt: dateSub(14) },
];

export const mockAnggaran: Anggaran[] = [
  { id: 'ang-1', kategoriId: 'kt-9', bulan: 7, tahun: 2026, targetNominal: 1500000 },
  { id: 'ang-2', kategoriId: 'kt-10', bulan: 7, tahun: 2026, targetNominal: 3000000 },
  { id: 'ang-3', kategoriId: 'kt-13', bulan: 7, tahun: 2026, targetNominal: 1000000 },
  { id: 'ang-4', kategoriId: 'kt-15', bulan: 7, tahun: 2026, targetNominal: 3000000 },
];

export const mockCampaigns: Campaign[] = [
  { id: 'cmp-1', judul: 'Renovasi Kubah Masjid', deskripsi: 'Mari bersama-sama merenovasi kubah masjid yang sudah mulai bocor', targetDana: 150000000, danaTerkumpul: 98500000, tanggalMulai: '2026-05-01', tanggalSelesai: '2026-08-30', status: 'AKTIF', slug: 'renovasi-kubah' },
  { id: 'cmp-2', judul: 'Pembangunan Taman Masjid', deskripsi: 'Buat masjid kita lebih asri dengan taman hijau', targetDana: 75000000, danaTerkumpul: 75000000, tanggalMulai: '2026-03-01', tanggalSelesai: '2026-06-30', status: 'SELESAI', slug: 'taman-masjid' },
  { id: 'cmp-3', judul: 'Santunan 100 Anak Yatim', deskripsi: 'Program santunan Idul Adha untuk 100 anak yatim', targetDana: 50000000, danaTerkumpul: 32500000, tanggalMulai: '2026-07-01', tanggalSelesai: '2026-09-15', status: 'AKTIF', slug: 'santunan-yatim' },
];

export const mockDonatur: Donatur[] = [
  { id: 'dn-1', nama: 'H. Rahmat', anonim: false, campaignId: 'cmp-1', nominal: 5000000, tanggal: dateSub(5), pesan: 'Semoga berkah' },
  { id: 'dn-2', nama: 'Ibu Siti', anonim: true, campaignId: 'cmp-1', nominal: 250000, tanggal: dateSub(3) },
  { id: 'dn-3', nama: 'Bapak Agus', anonim: false, campaignId: 'cmp-3', nominal: 1000000, tanggal: dateSub(2), pesan: 'Untuk anak yatim' },
  { id: 'dn-4', nama: 'PT Berkah Sejahtera', anonim: false, campaignId: 'cmp-1', nominal: 15000000, tanggal: dateSub(7) },
];

export const mockJamaah: Jamaah[] = [
  { id: 'jm-1', nama: 'Abdullah Hakim', alamat: 'Jl. Merdeka No. 10', rt: '01', rw: '03', noHp: '081234567890', jenisKelamin: 'L', status: 'JAMAAH_TETAP', kategori: ['MUZAKKI'] },
  { id: 'jm-2', nama: 'Fatimah Az-Zahra', alamat: 'Jl. Merdeka No. 25', rt: '01', rw: '03', noHp: '087654321098', jenisKelamin: 'P', status: 'JAMAAH_TETAP', kategori: [] },
  { id: 'jm-3', nama: 'Muhammad Ilham', alamat: 'Jl. Pahlawan No. 5', rt: '02', rw: '03', noHp: '085612345678', jenisKelamin: 'L', status: 'JAMAAH_TETAP', kategori: ['MUZAKKI'] },
  { id: 'jm-4', nama: 'Aisyah Putri', alamat: 'Jl. Pahlawan No. 8', rt: '02', rw: '03', noHp: '089876543210', jenisKelamin: 'P', status: 'SIMPATISAN', kategori: ['MUALLAF'] },
  { id: 'jm-5', nama: 'H. Ahmad Sanusi', alamat: 'Jl. Diponegoro No. 15', rt: '03', rw: '03', noHp: '082134567890', jenisKelamin: 'L', status: 'JAMAAH_TETAP', kategori: ['MUZAKKI'] },
  { id: 'jm-6', nama: 'Maimunah', alamat: 'Jl. Merdeka No. 30', rt: '01', rw: '03', noHp: '081908070605', jenisKelamin: 'P', status: 'JAMAAH_TETAP', kategori: ['LANSIA', 'MUSTAHIK'] },
  { id: 'jm-7', nama: 'Yusuf Abdullah', alamat: 'Jl. Diponegoro No. 3', rt: '03', rw: '03', noHp: '081377665544', jenisKelamin: 'L', status: 'JAMAAH_TETAP', kategori: [] },
  { id: 'jm-8', nama: 'Khadijah Rahmah', alamat: 'Jl. Pahlawan No. 12', rt: '02', rw: '03', noHp: '081255443322', jenisKelamin: 'P', status: 'JAMAAH_TETAP', kategori: ['DHUAFA', 'YATIM'] },
];

const nextDays = (days: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const mockAgenda: Agenda[] = [
  { id: 'ag-1', judul: 'Kajian Rutin Rabu Malam', deskripsi: 'Kajian tafsir Al-Quran bersama Ustadz Ahmad', jenis: 'KAJIAN_RUTIN', tanggalMulai: nextDays(0), tanggalSelesai: nextDays(0), lokasi: 'Masjid Al Qohar', pemateri: 'Ustadz Ahmad Fauzi', recurring: true, recurringRule: 'WEEKLY', status: 'RENCANA' },
  { id: 'ag-2', judul: 'Rapat DKM Bulanan', deskripsi: 'Pembahasan program kerja bulan depan', jenis: 'RAPAT_DKM', tanggalMulai: nextDays(1), tanggalSelesai: nextDays(1), lokasi: 'Ruang Serbaguna', recurring: false, status: 'RENCANA' },
  { id: 'ag-3', judul: 'Kajian Akbar: Malam Jumat', deskripsi: 'Kajian umum dengan Ustadz kondang', jenis: 'KAJIAN_AKBAR', tanggalMulai: nextDays(3), tanggalSelesai: nextDays(3), lokasi: 'Halaman Masjid', pemateri: 'Ustadz Abdul Somad', recurring: false, status: 'RENCANA' },
  { id: 'ag-4', judul: 'Pengajian Ibu-Ibu', deskripsi: 'Pengajian rutin pekanan ibu-ibu', jenis: 'PENGAJIAN_IBU', tanggalMulai: nextDays(2), tanggalSelesai: nextDays(2), lokasi: 'Aula Masjid', pemateri: 'Ustadzah Fatimah', recurring: true, recurringRule: 'WEEKLY', status: 'RENCANA' },
  { id: 'ag-5', judul: 'Santunan Anak Yatim', deskripsi: 'Pembagian santunan bulanan', jenis: 'SANTUNAN', tanggalMulai: nextDays(5), tanggalSelesai: nextDays(5), lokasi: 'Masjid Al Qohar', recurring: false, status: 'RENCANA' },
  { id: 'ag-6', judul: 'Kerja Bakti Lingkungan', deskripsi: 'Bersih-bersih masjid dan lingkungan sekitar', jenis: 'KERJA_BAKTI', tanggalMulai: nextDays(7), tanggalSelesai: nextDays(7), lokasi: 'Lingkungan Masjid', recurring: false, status: 'RENCANA' },
  { id: 'ag-7', judul: 'Event Remaja: Islamic Youth Camp', deskripsi: 'Kegiatan kepemudaan Islami', jenis: 'EVENT_REMAJA', tanggalMulai: nextDays(14), tanggalSelesai: nextDays(16), lokasi: 'Bumi Perkemahan', recurring: false, status: 'RENCANA' },
];

export const mockJadwalPetugas: JadwalPetugas[] = [
  { id: 'jp-1', tanggal: today, peran: 'IMAM', waktuSholat: '04:30', petugasNama: 'Ahmad Fauzi', statusKonfirmasi: true },
  { id: 'jp-2', tanggal: today, peran: 'MUADZIN', waktuSholat: '04:30', petugasNama: 'Budi Santoso', statusKonfirmasi: true },
  { id: 'jp-3', tanggal: today, peran: 'IMAM', waktuSholat: '12:10', petugasNama: 'Ahmad Fauzi', statusKonfirmasi: true },
  { id: 'jp-4', tanggal: today, peran: 'MUADZIN', waktuSholat: '12:10', petugasNama: 'Doni Prasetyo', statusKonfirmasi: false },
  { id: 'jp-5', tanggal: today, peran: 'KHATIB', waktuSholat: '12:10', petugasNama: 'Ustadz Abdul Somad', tema: 'Keutamaan Sedekah', statusKonfirmasi: true },
];

export const mockPengumuman: Pengumuman[] = [
  { id: 'pg-1', judul: 'Jadwal Kajian Bulan Ini', isi: 'Assalamualaikum... Berikut jadwal kajian bulan Juli 2026...', kategori: 'Kegiatan', prioritas: 'SEDANG', tanggalTayang: dateSub(0), tampilPublik: true, dibuatOlehId: 'u3' },
  { id: 'pg-2', judul: 'Info Pembayaran Zakat Fitrah', isi: 'Pembayaran zakat fitrah dapat dilakukan melalui...', kategori: 'Zakat', prioritas: 'TINGGI', tanggalTayang: dateSub(2), tanggalKedaluwarsa: nextDays(30), tampilPublik: true, dibuatOlehId: 'u3' },
  { id: 'pg-3', judul: 'Pengumuman Hasil Rapat DKM', isi: 'Hasil rapat DKM bulan Juni 2026 menyepakati...', kategori: 'Organisasi', prioritas: 'RENDAH', tanggalTayang: dateSub(7), tampilPublik: false, dibuatOlehId: 'u3' },
];

export const mockInventaris: Inventaris[] = [
  { id: 'inv-1', nama: 'Karpet Masjid', kategori: 'Perlengkapan', jumlah: 50, kondisi: 'BAIK', tanggalBeli: '2025-01-15', hargaBeli: 25000000, lokasi: 'Ruang Utama' },
  { id: 'inv-2', nama: 'Sound System', kategori: 'Elektronik', jumlah: 1, kondisi: 'BAIK', tanggalBeli: '2024-06-01', hargaBeli: 15000000, lokasi: 'Ruang Utama', jadwalMaintenance: nextDays(30) },
  { id: 'inv-3', nama: 'AC Ruang Utama', kategori: 'Elektronik', jumlah: 4, kondisi: 'RUSAK_RINGAN', tanggalBeli: '2023-03-01', hargaBeli: 32000000, lokasi: 'Ruang Utama', jadwalMaintenance: nextDays(14) },
  { id: 'inv-4', nama: 'Mimbar', kategori: 'Furnitur', jumlah: 1, kondisi: 'BAIK', tanggalBeli: '2024-08-01', hargaBeli: 5000000, lokasi: 'Mihrab' },
  { id: 'inv-5', nama: 'Al-Quran', kategori: 'Perlengkapan', jumlah: 100, kondisi: 'RUSAK_RINGAN', tanggalBeli: '2023-12-01', hargaBeli: 10000000, lokasi: 'Rak Al-Quran' },
  { id: 'inv-6', nama: 'Genset', kategori: 'Elektronik', jumlah: 1, kondisi: 'BAIK', tanggalBeli: '2025-06-01', hargaBeli: 20000000, lokasi: 'Gudang Belakang', jadwalMaintenance: nextDays(90) },
];

export const mockPeminjaman: Peminjaman[] = [
  { id: 'pm-1', inventarisId: 'inv-4', peminjam: 'Majelis Taklim Ibu-Ibu', tanggalPinjam: dateSub(7), tanggalKembali: dateSub(3), status: 'DIKEMBALIKAN' },
  { id: 'pm-2', inventarisId: 'inv-6', peminjam: 'Panitia PHBI', tanggalPinjam: dateSub(1), status: 'DIPINJAM' },
];

export const mockZakat: Zakat[] = [
  { id: 'zk-1', jenis: 'FITRAH', muzakkiNama: 'Abdullah Hakim', jumlahJiwa: 4, nominal: 200000, beratBeras: 10, tanggal: dateSub(30), tahunHijriah: 1447 },
  { id: 'zk-2', jenis: 'MAAL', muzakkiNama: 'H. Ahmad Sanusi', nominal: 5000000, tanggal: dateSub(14), tahunHijriah: 1447 },
  { id: 'zk-3', jenis: 'PENGHASILAN', muzakkiNama: 'Muhammad Ilham', nominal: 250000, tanggal: dateSub(7), tahunHijriah: 1447 },
];

export const mockPenyaluranZakat: PenyaluranZakat[] = [
  { id: 'pz-1', asnaf: 'FAKIR', penerimaNama: 'Maimunah', nominal: 500000, tanggal: dateSub(7) },
  { id: 'pz-2', asnaf: 'MISKIN', penerimaNama: 'Khadijah Rahmah', nominal: 500000, tanggal: dateSub(7) },
  { id: 'pz-3', asnaf: 'FISABILILLAH', penerimaNama: 'Santri TPQ', nominal: 1000000, tanggal: dateSub(7) },
];

export const mockHewanQurban: HewanQurban[] = [
  { id: 'hq-1', tahun: 1448, jenis: 'SAPI', berat: 350, hargaBeli: 25000000, penjual: 'Peternakan Berkah', jumlahSlot: 7 },
  { id: 'hq-2', tahun: 1448, jenis: 'KAMBING', berat: 35, hargaBeli: 3500000, penjual: 'Peternakan Berkah', jumlahSlot: 1 },
  { id: 'hq-3', tahun: 1448, jenis: 'SAPI', berat: 320, hargaBeli: 23000000, penjual: 'CV Ternak Jaya', jumlahSlot: 7 },
];

export const mockQurban: Qurban[] = [
  { id: 'qb-1', tahun: 1448, shohibulNama: 'H. Ahmad Sanusi', jenisHewan: 'SAPI', tipeQurban: 'PATUNGAN', slotKe: 1, hewanId: 'hq-1', nominal: 4000000, lunas: true },
  { id: 'qb-2', tahun: 1448, shohibulNama: 'Abdullah Hakim', jenisHewan: 'SAPI', tipeQurban: 'PATUNGAN', slotKe: 2, hewanId: 'hq-1', nominal: 4000000, lunas: true },
  { id: 'qb-3', tahun: 1448, shohibulNama: 'Muhammad Ilham', jenisHewan: 'KAMBING', tipeQurban: 'INDIVIDU', hewanId: 'hq-2', nominal: 3500000, lunas: false },
];

export const mockChecklistHarian: ChecklistHarian[] = [
  { id: 'ch-1', tanggal: today, tugas: 'Sapu lantai utama', selesai: true, petugasId: 'u5', waktuSelesai: '06:30' },
  { id: 'ch-2', tanggal: today, tugas: 'Pel lantai utama', selesai: true, petugasId: 'u5', waktuSelesai: '07:00' },
  { id: 'ch-3', tanggal: today, tugas: 'Bersihkan toilet', selesai: false, petugasId: 'u5' },
  { id: 'ch-4', tanggal: today, tugas: 'Isi galon air minum', selesai: true, petugasId: 'u5', waktuSelesai: '07:15' },
  { id: 'ch-5', tanggal: today, tugas: 'Cek sound system', selesai: true, petugasId: 'u5', waktuSelesai: '07:30' },
  { id: 'ch-6', tanggal: today, tugas: 'Kunci pintu setelah isya', selesai: false, petugasId: 'u5' },
];

export const mockLogAktivitas: LogAktivitas[] = [
  { id: 'lg-1', userId: 'u2', aksi: 'Catat Pemasukan', modul: 'Keuangan', detail: 'Rp 3.500.000 - Infaq Jumat', createdAt: dateSub(0) },
  { id: 'lg-2', userId: 'u3', aksi: 'Buat Pengumuman', modul: 'Pengumuman', detail: 'Jadwal Kajian Bulan Ini', createdAt: dateSub(0) },
  { id: 'lg-3', userId: 'u2', aksi: 'Catat Pengeluaran', modul: 'Keuangan', detail: 'Rp 1.200.000 - Listrik', createdAt: dateSub(2) },
  { id: 'lg-4', userId: 'u5', aksi: 'Selesaikan Tugas', modul: 'Operasional', detail: 'Sapu lantai utama', createdAt: dateSub(0) },
  { id: 'lg-5', userId: 'u4', aksi: 'Buat Agenda', modul: 'Agenda', detail: 'Kajian Akbar Malam Jumat', createdAt: dateSub(3) },
];

// Prayer times mock
export const mockPrayerTimes = [
  { name: 'Subuh', waktu: '04:30', ikon: 'Moon' },
  { name: 'Dzuhur', waktu: '12:10', ikon: 'Sun' },
  { name: 'Ashar', waktu: '15:30', ikon: 'SunDim' },
  { name: 'Maghrib', waktu: '17:55', ikon: 'Sunset' },
  { name: 'Isya', waktu: '19:10', ikon: 'MoonStar' },
];

// Dashboard stats
export function getDashboardStats() {
  const totalPemasukan = mockTransaksi.filter(t => t.jenis === 'MASUK').reduce((s, t) => s + t.nominal, 0);
  const totalPengeluaran = mockTransaksi.filter(t => t.jenis === 'KELUAR').reduce((s, t) => s + t.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // Last month (approx)
  const lastMonthTotal = mockTransaksi.filter(t => {
    const d = new Date(t.tanggal);
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return d >= lastMonth && d < now;
  }).reduce((s, t) => s + t.nominal, 0);

  return {
    saldoKas: totalPemasukan - totalPengeluaran,
    donasiBulanIni: totalPemasukan,
    totalJamaah: mockJamaah.length,
    agendaMingguIni: mockAgenda.filter(a => {
      const d = new Date(a.tanggalMulai);
      const weekAhead = new Date(now);
      weekAhead.setDate(weekAhead.getDate() + 7);
      return d >= now && d <= weekAhead;
    }).length,
    perubahanDonasi: 12.5,
  };
}

export function getMonthlyCashFlow() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const currentMonth = now.getMonth();
  return months.slice(0, currentMonth + 1).map((name, i) => {
    const monthTx = mockTransaksi.filter(t => {
      const d = new Date(t.tanggal);
      return d.getMonth() === i;
    });
    const masuk = monthTx.filter(t => t.jenis === 'MASUK').reduce((s, t) => s + t.nominal, 0);
    const keluar = monthTx.filter(t => t.jenis === 'KELUAR').reduce((s, t) => s + t.nominal, 0);
    return { name, pemasukan: masuk, pengeluaran: keluar };
  });
}

export function getDonasiKomposisi() {
  return [
    { name: 'Infaq Jumat', value: 3500000, warna: '#16A34A' },
    { name: 'Kotak Amal', value: 875000, warna: '#22C55E' },
    { name: 'Donasi Online', value: 5000000, warna: '#6366F1' },
    { name: 'Zakat', value: 2500000, warna: '#F59E0B' },
    { name: 'Lainnya', value: 500000, warna: '#94A3B8' },
  ];
}

export const mockDb = {
  masjid: mockMasjid,
  users: mockUsers,
  transaksi: mockTransaksi,
  kategoriTransaksi: mockKategoriTransaksi,
  anggaran: mockAnggaran,
  campaigns: mockCampaigns,
  donatur: mockDonatur,
  jamaah: mockJamaah,
  agenda: mockAgenda,
  jadwalPetugas: mockJadwalPetugas,
  pengumuman: mockPengumuman,
  inventaris: mockInventaris,
  peminjaman: mockPeminjaman,
  zakat: mockZakat,
  penyaluranZakat: mockPenyaluranZakat,
  qurban: mockQurban,
  hewanQurban: mockHewanQurban,
  checklistHarian: mockChecklistHarian,
  logAktivitas: mockLogAktivitas,
  prayerTimes: mockPrayerTimes,
  getDashboardStats,
  getMonthlyCashFlow,
  getDonasiKomposisi,
};