'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import DataTable from '@/components/shared/DataTable';
import Modal from '@/components/shared/Modal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/shared/Toast';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek } from '@/lib/date';
import { Users, GraduationCap, BookOpen, UserCheck, Search, Check, X, Clock, Calendar, Wallet, BookMarked, ClipboardCheck } from 'lucide-react';

type Santri = {
  id: string; nama: string; umur: number;
  kelas: 'A' | 'B' | 'C'; level: string; levelProgress: number;
  orangTua: string; kontakOrtu: string; alamat: string; statusAktif: boolean;
};

const mockSantri: Santri[] = [
  { id: 's1', nama: 'Ahmad Fauzan', umur: 8, kelas: 'A', level: 'Iqro 3', levelProgress: 50, orangTua: 'Pak Fauzi', kontakOrtu: '081234567001', alamat: 'Jl. Merdeka No 10', statusAktif: true },
  { id: 's2', nama: 'Fatimah Az-Zahra', umur: 7, kelas: 'A', level: 'Iqro 2', levelProgress: 75, orangTua: 'Bu Siti', kontakOrtu: '081234567002', alamat: 'Jl. Pahlawan No 12', statusAktif: true },
  { id: 's3', nama: 'Muhammad Ilham', umur: 9, kelas: 'B', level: 'Iqro 4', levelProgress: 30, orangTua: 'Pak Ilham', kontakOrtu: '081234567003', alamat: 'Jl. Diponegoro 5', statusAktif: true },
  { id: 's4', nama: 'Aisyah Putri', umur: 10, kelas: 'B', level: 'Quran', levelProgress: 60, orangTua: 'Bu Aisyah', kontakOrtu: '081234567004', alamat: 'Jl. Merdeka No 25', statusAktif: true },
  { id: 's5', nama: 'Abdullah Karim', umur: 6, kelas: 'A', level: 'Iqro 1', levelProgress: 40, orangTua: 'Pak Karim', kontakOrtu: '081234567005', alamat: 'Jl. Melati No 3', statusAktif: true },
  { id: 's6', nama: 'Khadijah Rahma', umur: 11, kelas: 'C', level: 'Quran', levelProgress: 85, orangTua: 'Bu Khadijah', kontakOrtu: '081234567006', alamat: 'Jl. Mawar No 8', statusAktif: true },
  { id: 's7', nama: 'Yusuf Abdullah', umur: 8, kelas: 'A', level: 'Iqro 2', levelProgress: 20, orangTua: 'Pak Yusuf', kontakOrtu: '081234567007', alamat: 'Jl. Anggrek No 11', statusAktif: false },
  { id: 's8', nama: 'Zainab Nabila', umur: 9, kelas: 'B', level: 'Iqro 5', levelProgress: 90, orangTua: 'Bu Nabila', kontakOrtu: '081234567008', alamat: 'Jl. Kenanga No 7', statusAktif: true },
  { id: 's9', nama: 'Bilal Hasan', umur: 12, kelas: 'C', level: 'Quran', levelProgress: 45, orangTua: 'Pak Hasan', kontakOrtu: '081234567009', alamat: 'Jl. Cempaka No 2', statusAktif: true },
  { id: 's10', nama: 'Maryam Salsabila', umur: 7, kelas: 'A', level: 'Iqro 1', levelProgress: 65, orangTua: 'Bu Maryam', kontakOrtu: '081234567010', alamat: 'Jl. Dahlia No 15', statusAktif: true },
];

const kelasJadwal = [
  { kelas: 'A', umur: '5-8 th', jumlah: 5, pengajar: 'Ustadzah Fatimah', warna: 'from-emerald-500 to-teal-500', jadwal: [
    { hari: 'Senin', jam: '16:00-17:00', materi: 'Iqro 1-2' },
    { hari: 'Selasa', jam: '16:00-17:00', materi: 'Doa Harian' },
    { hari: 'Rabu', jam: '16:00-17:00', materi: 'Iqro Lanjut' },
    { hari: 'Kamis', jam: '16:00-17:00', materi: 'Tajwid Dasar' },
    { hari: 'Jumat', jam: '15:30-16:30', materi: 'Kisah Nabi' },
  ]},
  { kelas: 'B', umur: '9-10 th', jumlah: 3, pengajar: 'Ustadz Ahmad', warna: 'from-violet-500 to-purple-500', jadwal: [
    { hari: 'Senin', jam: '16:30-17:30', materi: 'Iqro 3-5' },
    { hari: 'Selasa', jam: '16:30-17:30', materi: 'Juz 30' },
    { hari: 'Rabu', jam: '16:30-17:30', materi: 'Fiqih Anak' },
    { hari: 'Kamis', jam: '16:30-17:30', materi: 'Tajwid Lanjut' },
    { hari: 'Jumat', jam: '16:00-17:00', materi: 'Praktek Sholat' },
  ]},
  { kelas: 'C', umur: '11-12 th', jumlah: 2, pengajar: 'Ustadz Abdullah', warna: 'from-amber-500 to-orange-500', jadwal: [
    { hari: 'Senin', jam: '17:00-18:00', materi: 'Al-Quran' },
    { hari: 'Selasa', jam: '17:00-18:00', materi: 'Tafsir Juz 30' },
    { hari: 'Rabu', jam: '17:00-18:00', materi: 'Hadist Pilihan' },
    { hari: 'Kamis', jam: '17:00-18:00', materi: 'Tahsin' },
    { hari: 'Jumat', jam: '16:30-17:30', materi: 'Kajian Akhlak' },
  ]},
];

type SPPRecord = { id: string; santriId: string; bulan: string; status: 'LUNAS' | 'BELUM'; nominal: number; tanggalBayar?: string; };
const mockSPP: SPPRecord[] = mockSantri.slice(0, 8).flatMap((s, idx) =>
  ['2026-06', '2026-07'].map((bulan, bIdx) => ({
    id: `spp-${s.id}-${bulan}`, santriId: s.id, bulan,
    status: (idx + bIdx) % 3 === 0 ? 'BELUM' as const : 'LUNAS' as const,
    nominal: 50000,
    tanggalBayar: (idx + bIdx) % 3 === 0 ? undefined : `2026-07-${String(5 + idx).padStart(2,'0')}`,
  }))
);

const levelColor: Record<string, string> = {
  'Iqro 1': 'bg-amber-100 text-amber-700', 'Iqro 2': 'bg-orange-100 text-orange-700',
  'Iqro 3': 'bg-emerald-100 text-emerald-700', 'Iqro 4': 'bg-teal-100 text-teal-700',
  'Iqro 5': 'bg-cyan-100 text-cyan-700', 'Iqro 6': 'bg-blue-100 text-blue-700',
  'Quran': 'bg-violet-100 text-violet-700',
};

export default function TpqPage() {
  const { toast } = useToast();
  const [searchSantri, setSearchSantri] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [absensiDate, setAbsensiDate] = useState(new Date().toISOString().split('T')[0]);
  const [absensiMap, setAbsensiMap] = useState<Record<string, boolean>>({});

  const totalAktif = mockSantri.filter(s => s.statusAktif).length;

  const filteredSantri = useMemo(() => {
    if (!searchSantri) return mockSantri;
    const q = searchSantri.toLowerCase();
    return mockSantri.filter(s => s.nama.toLowerCase().includes(q) || s.level.toLowerCase().includes(q));
  }, [searchSantri]);

  return (
    <div className="space-y-6">
      <PageHeader title="TPQ Al-Ikhlas" subtitle="Taman Pendidikan Al-Quran — kelola santri, jadwal & hafalan" action={{ label: 'Tambah Santri', onClick: () => setShowModal(true) }} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total Santri Aktif" value={`${totalAktif} anak`} icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-50" format="text" />
        <StatCard title="Pengajar" value="3 ustadz" icon={GraduationCap} iconColor="text-violet-600" iconBg="bg-violet-50" format="text" />
        <StatCard title="Kelas" value="3 kelas" icon={BookOpen} iconColor="text-amber-600" iconBg="bg-amber-50" format="text" />
        <StatCard title="Rata Kehadiran" value="92%" icon={UserCheck} iconColor="text-cyan-600" iconBg="bg-cyan-50" format="text" trend={3} />
      </div>

      <Tabs defaultValue="santri" className="w-full">
        <TabsList className="rounded-2xl bg-muted p-1 w-full grid grid-cols-5 h-auto">
          <TabsTrigger value="santri" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Users className="w-3 h-3 mr-1" />Santri</TabsTrigger>
          <TabsTrigger value="kelas" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Calendar className="w-3 h-3 mr-1" />Kelas</TabsTrigger>
          <TabsTrigger value="absensi" className="rounded-xl text-[11px] data-[state=active]:bg-white"><ClipboardCheck className="w-3 h-3 mr-1" />Absensi</TabsTrigger>
          <TabsTrigger value="hafalan" className="rounded-xl text-[11px] data-[state=active]:bg-white"><BookMarked className="w-3 h-3 mr-1" />Hafalan</TabsTrigger>
          <TabsTrigger value="spp" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Wallet className="w-3 h-3 mr-1" />SPP</TabsTrigger>
        </TabsList>

        <TabsContent value="santri" className="mt-4">
          <Card className="rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
            <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
              <h3 className="font-bold text-sm">Daftar Santri ({filteredSantri.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={searchSantri} onChange={e => setSearchSantri(e.target.value)} placeholder="Cari nama / level..." className="pl-10 rounded-2xl bg-muted border-0 text-sm" />
              </div>
            </div>
            <DataTable
              searchable={false}
              data={filteredSantri}
              columns={[
                { key: 'nama', label: 'Nama', sortable: true, render: (s: Santri) => (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-xs font-bold">{s.nama.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                    <div><div className="font-semibold text-sm">{s.nama}</div><div className="text-[11px] text-muted-foreground">{s.alamat}</div></div>
                  </div>
                )},
                { key: 'umur', label: 'Umur', render: (s: Santri) => <span className="text-sm">{s.umur} th</span> },
                { key: 'kelas', label: 'Kelas', render: (s: Santri) => <Badge className="rounded-full border-0 bg-muted text-foreground text-[11px]">Kelas {s.kelas}</Badge> },
                { key: 'level', label: 'Level', render: (s: Santri) => <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${levelColor[s.level] || 'bg-muted'}`}>{s.level}</span> },
                { key: 'ortu', label: 'Orang Tua', render: (s: Santri) => <div><div className="text-sm font-medium">{s.orangTua}</div><div className="text-[11px] text-muted-foreground">{s.kontakOrtu}</div></div> },
                { key: 'status', label: 'Status', render: (s: Santri) => s.statusAktif ? <span className="text-emerald-600 text-xs font-semibold">✓ Aktif</span> : <span className="text-muted-foreground text-xs">Nonaktif</span> },
              ]}
            />
          </Card>
        </TabsContent>

        <TabsContent value="kelas" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kelasJadwal.map(k => (
              <Card key={k.kelas} className="rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
                <div className={`h-1.5 w-full bg-gradient-to-r ${k.warna}`} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${k.warna} text-white flex items-center justify-center font-bold`}>{k.kelas}</div>
                    <div><div className="font-bold text-sm">Kelas {k.kelas}</div><div className="text-[11px] text-muted-foreground">{k.umur} • {k.jumlah} santri • {k.pengajar}</div></div>
                  </div>
                  <div className="space-y-2 mt-3">
                    {k.jadwal.map(j => (
                      <div key={j.hari} className="flex items-center justify-between p-2.5 rounded-2xl bg-muted/60">
                        <div><div className="text-xs font-semibold">{j.hari}</div><div className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{j.jam}</div></div>
                        <Badge variant="outline" className="rounded-full text-[10px]">{j.materi}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="absensi" className="mt-4">
          <Card className="rounded-3xl p-5">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
              <h3 className="font-bold text-sm flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /> Absensi — {formatTanggalPendek(absensiDate)}</h3>
              <div className="flex gap-2">
                <Input type="date" value={absensiDate} onChange={e => setAbsensiDate(e.target.value)} className="rounded-2xl bg-muted border-0 text-sm w-auto" />
                <button onClick={() => toast('success', `Absensi ${formatTanggalPendek(absensiDate)} disimpan! ✅`)} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Simpan</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mockSantri.filter(s=>s.statusAktif).map(s => {
                const hadir = absensiMap[s.id] ?? false;
                return (
                  <div key={s.id} className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${hadir ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-border'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-xs font-bold">{s.nama.slice(0,2).toUpperCase()}</div>
                      <div><div className="text-sm font-semibold">{s.nama}</div><div className="text-[11px] text-muted-foreground">Kelas {s.kelas} • {s.level}</div></div>
                    </div>
                    <button onClick={() => setAbsensiMap(p=>({...p,[s.id]:!p[s.id]}))} className={`w-8 h-8 rounded-full flex items-center justify-center ${hadir ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>{hadir ? <Check className="w-4 h-4"/> : <X className="w-4 h-4"/>}</button>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="hafalan" className="mt-4">
          <Card className="rounded-3xl p-5">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><BookMarked className="w-4 h-4" /> Tracker Hafalan & Level Iqro</h3>
            <div className="space-y-3">
              {mockSantri.filter(s=>s.statusAktif).map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-muted/40">
                  <div className="flex justify-between mb-2"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center text-xs font-bold">{s.nama.slice(0,2).toUpperCase()}</div><div className="text-sm font-semibold">{s.nama}</div></div><span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${levelColor[s.level] || 'bg-muted'}`}>{s.level}</span></div>
                  <Progress value={s.levelProgress} className="h-2" />
                  <div className="flex justify-between mt-1"><span className="text-[11px] text-muted-foreground">Progress {s.level}</span><span className="text-xs font-bold">{s.levelProgress}%</span></div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="spp" className="mt-4">
          <Card className="rounded-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2"><Wallet className="w-4 h-4"/> SPP TPQ — {formatRupiah(50000)}/bulan</h3>
              <span className="text-xs text-muted-foreground">{mockSPP.filter(r=>r.status==='LUNAS').length} lunas • {mockSPP.filter(r=>r.status==='BELUM').length} belum</span>
            </div>
            <DataTable
              searchable
              searchKeys={['bulan','status']}
              data={mockSPP.map(r => ({ ...r, namaSantri: mockSantri.find(x=>x.id===r.santriId)?.nama || '-', kelas: mockSantri.find(x=>x.id===r.santriId)?.kelas || '-' }))}
              columns={[
                { key: 'namaSantri', label: 'Santri', render: (row: SPPRecord & {namaSantri:string; kelas:string}) => <span className="font-medium text-sm">{row.namaSantri} <span className="text-[11px] text-muted-foreground">Kelas {row.kelas}</span></span> },
                { key: 'bulan', label: 'Bulan', render: (row: SPPRecord) => <span className="text-sm">{row.bulan}</span> },
                { key: 'nominal', label: 'Nominal', render: (row: SPPRecord) => <span className="text-sm tabular-nums">{formatRupiah(row.nominal)}</span> },
                { key: 'status', label: 'Status', render: (row: SPPRecord) => row.status==='LUNAS' ? <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">LUNAS</span> : <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold">BELUM</span> },
                { key: 'tanggalBayar', label: 'Tgl Bayar', render: (row: SPPRecord) => row.tanggalBayar ? <span className="text-xs text-muted-foreground">{formatTanggalPendek(row.tanggalBayar)}</span> : <span className="text-xs">-</span> },
                { key: 'aksi', label: '', render: (row: SPPRecord) => row.status==='BELUM' ? <button onClick={() => toast('success','Ditandai lunas! 🤲')} className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">Tandai Lunas</button> : null },
              ]}
            />
          </Card>
        </TabsContent>
      </Tabs>

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Tambah Santri">
        <form onSubmit={e => { e.preventDefault(); toast('success','Santri ditambahkan! 📚'); setShowModal(false); }} className="space-y-3">
          <Input placeholder="Nama lengkap santri" required className="rounded-2xl bg-muted border-0" />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Umur" className="rounded-2xl bg-muted border-0" />
            <select className="px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm"><option>Kelas A</option><option>Kelas B</option><option>Kelas C</option></select>
          </div>
          <select className="w-full px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm"><option>Iqro 1</option><option>Iqro 2</option><option>Iqro 3</option><option>Iqro 4</option><option>Iqro 5</option><option>Iqro 6</option><option>Quran</option></select>
          <Input placeholder="Nama orang tua" className="rounded-2xl bg-muted border-0" />
          <Input placeholder="Kontak orang tua" className="rounded-2xl bg-muted border-0" />
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}
