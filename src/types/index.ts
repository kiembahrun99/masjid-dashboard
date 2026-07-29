export type UserRole = 'SUPER_ADMIN' | 'BENDAHARA' | 'SEKRETARIS' | 'PENGURUS' | 'MARBOT';

export interface User {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: UserRole;
  avatarUrl?: string;
  aktif: boolean;
  masjidId: string;
}

export type JenisTransaksi = 'MASUK' | 'KELUAR';
export type MetodeBayar = 'TUNAI' | 'TRANSFER' | 'QRIS';

export interface KategoriTransaksi {
  id: string;
  nama: string;
  jenis: JenisTransaksi;
  ikon: string;
  warna: string;
}

export interface Transaksi {
  id: string;
  tanggal: string;
  jenis: JenisTransaksi;
  kategoriId: string;
  nominal: number;
  uraian: string;
  buktiUrl?: string;
  metodeBayar: MetodeBayar;
  agendaId?: string;
  campaignId?: string;
  dicatatOlehId: string;
  createdAt: string;
}

export interface Anggaran {
  id: string;
  kategoriId: string;
  bulan: number;
  tahun: number;
  targetNominal: number;
}

export interface Campaign {
  id: string;
  judul: string;
  deskripsi: string;
  targetDana: number;
  danaTerkumpul: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  gambarUrl?: string;
  status: 'AKTIF' | 'SELESAI' | 'DITUTUP';
  slug: string;
}

export interface Donatur {
  id: string;
  nama: string;
  noHp?: string;
  anonim: boolean;
  campaignId: string;
  nominal: number;
  tanggal: string;
  pesan?: string;
}

export type StatusJamaah = 'JAMAAH_TETAP' | 'MUSAFIR' | 'SIMPATISAN';
export type KategoriJamaah = 'MUALLAF' | 'LANSIA' | 'YATIM' | 'DHUAFA' | 'MUSTAHIK' | 'MUZAKKI';

export interface Jamaah {
  id: string;
  nama: string;
  nik?: string;
  alamat: string;
  rt: string;
  rw: string;
  noHp: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir?: string;
  status: StatusJamaah;
  kategori: KategoriJamaah[];
  kepalaKeluargaId?: string;
  catatan?: string;
}

export type JenisAgenda = 'KAJIAN_RUTIN' | 'KAJIAN_AKBAR' | 'PENGAJIAN_IBU' | 'TPQ' | 'RAPAT_DKM' | 'KERJA_BAKTI' | 'SANTUNAN' | 'EVENT_REMAJA' | 'PHBI';
export type StatusAgenda = 'RENCANA' | 'BERLANGSUNG' | 'SELESAI' | 'BATAL';

export interface Agenda {
  id: string;
  judul: string;
  deskripsi: string;
  jenis: JenisAgenda;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  pemateri?: string;
  posterUrl?: string;
  anggaran?: number;
  recurring: boolean;
  recurringRule?: string;
  status: StatusAgenda;
}

export interface Kehadiran {
  id: string;
  agendaId: string;
  jamaahId: string;
  waktuHadir: string;
}

export type PeranPetugas = 'IMAM' | 'MUADZIN' | 'KHATIB' | 'PENCERAMAH';

export interface JadwalPetugas {
  id: string;
  tanggal: string;
  peran: PeranPetugas;
  waktuSholat: string;
  petugasNama: string;
  kontak?: string;
  tema?: string;
  statusKonfirmasi: boolean;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  kategori: string;
  prioritas: 'RENDAH' | 'SEDANG' | 'TINGGI';
  tanggalTayang: string;
  tanggalKedaluwarsa?: string;
  tampilPublik: boolean;
  dibuatOlehId: string;
}

export type KondisiAset = 'BAIK' | 'RUSAK_RINGAN' | 'RUSAK_BERAT';

export interface Inventaris {
  id: string;
  nama: string;
  kategori: string;
  jumlah: number;
  kondisi: KondisiAset;
  tanggalBeli?: string;
  hargaBeli?: number;
  lokasi: string;
  fotoUrl?: string;
  jadwalMaintenance?: string;
}

export interface Peminjaman {
  id: string;
  inventarisId: string;
  peminjam: string;
  tanggalPinjam: string;
  tanggalKembali?: string;
  status: 'DIPINJAM' | 'DIKEMBALIKAN';
}

export type JenisZakat = 'FITRAH' | 'MAAL' | 'PENGHASILAN' | 'PERDAGANGAN';

export interface Zakat {
  id: string;
  jenis: JenisZakat;
  muzakkiNama: string;
  jumlahJiwa?: number;
  nominal?: number;
  beratBeras?: number;
  tanggal: string;
  tahunHijriah: number;
}

export type Asnaf = 'FAKIR' | 'MISKIN' | 'AMIL' | 'MUALLAF' | 'RIQAB' | 'GHARIM' | 'FISABILILLAH' | 'IBNU_SABIL';

export interface PenyaluranZakat {
  id: string;
  asnaf: Asnaf;
  penerimaNama: string;
  nominal: number;
  tanggal: string;
  keterangan?: string;
}

export type JenisHewan = 'SAPI' | 'KAMBING' | 'DOMBA';
export type TipeQurban = 'INDIVIDU' | 'PATUNGAN';

export interface Qurban {
  id: string;
  tahun: number;
  shohibulNama: string;
  jenisHewan: JenisHewan;
  tipeQurban: TipeQurban;
  slotKe?: number;
  hewanId: string;
  nominal: number;
  lunas: boolean;
}

export interface HewanQurban {
  id: string;
  tahun: number;
  jenis: JenisHewan;
  berat: number;
  hargaBeli: number;
  penjual: string;
  fotoUrl?: string;
  jumlahSlot: number;
}

export interface ChecklistHarian {
  id: string;
  tanggal: string;
  tugas: string;
  selesai: boolean;
  petugasId: string;
  waktuSelesai?: string;
}

export interface LogAktivitas {
  id: string;
  userId: string;
  aksi: string;
  modul: string;
  detail: string;
  createdAt: string;
}

export interface Masjid {
  id: string;
  nama: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  latitude: number;
  longitude: number;
  logoUrl?: string;
  fotoUrl?: string;
  telepon: string;
  email: string;
  rekeningBank: string;
  nomorRekening: string;
  qrisUrl?: string;
  metodeHisab: string;
  koreksiMenit: number;
}