'use client';

import { useState, useRef } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import Modal from '@/components/shared/Modal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/shared/Toast';
import { getDb } from '@/lib/data-provider';
import { useThemeStore } from '@/store/theme-store';
import { formatTanggalPendek } from '@/lib/date';
import type { UserRole } from '@/types';
import {
  Building2, Users, GitBranch, Tags, Database, Palette,
  Save, Trash2, Pencil, Plus, Sun, Moon, Monitor,
  Crown, UserCog, HeartHandshake, BookOpen, Wrench, Megaphone, Wallet,
  Upload, Download, FileUp, Image as ImageIcon, Shield,
} from 'lucide-react';

const roleColors: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-violet-100 text-violet-700 border-violet-200',
  BENDAHARA: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  SEKRETARIS: 'bg-blue-100 text-blue-700 border-blue-200',
  PENGURUS: 'bg-amber-100 text-amber-700 border-amber-200',
  MARBOT: 'bg-slate-100 text-slate-700 border-slate-200',
};

const roleLabel: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin', BENDAHARA: 'Bendahara', SEKRETARIS: 'Sekretaris', PENGURUS: 'Pengurus', MARBOT: 'Marbot',
};

export default function PengaturanPage() {
  const { toast } = useToast();
  const db = getDb();
  const { theme, setTheme } = useThemeStore();
  const [temaMode, setTemaMode] = useState<'light' | 'dark' | 'auto'>(theme as 'light' | 'dark' === theme ? theme as 'light' | 'dark' : 'light');
  const [showUserModal, setShowUserModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [masjidForm, setMasjidForm] = useState({
    nama: db.masjid.nama, alamat: db.masjid.alamat,
    kelurahan: db.masjid.kelurahan, kecamatan: db.masjid.kecamatan, kota: db.masjid.kota, provinsi: db.masjid.provinsi,
    latitude: String(db.masjid.latitude), longitude: String(db.masjid.longitude),
    telepon: db.masjid.telepon, email: db.masjid.email,
    rekeningBank: db.masjid.rekeningBank, nomorRekening: db.masjid.nomorRekening,
    metodeHisab: db.masjid.metodeHisab, koreksiMenit: String(db.masjid.koreksiMenit),
  });

  const [kategoriList, setKategoriList] = useState(db.kategoriTransaksi);
  const [editingKat, setEditingKat] = useState<string | null>(null);
  const [editKatNama, setEditKatNama] = useState('');
  const [users, setUsers] = useState(db.users);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ masjid: db.masjid, users: db.users.slice(0,3), transaksi: db.transaksi, kategori: db.kategoriTransaksi, eksporPada: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `backup-masjid-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url); toast('success','Backup JSON diunduh! 📦');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { const json = JSON.parse(ev.target?.result as string); toast('success',`Import berhasil: ${Object.keys(json).join(', ')}`); }
      catch { toast('error','File JSON tidak valid'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" subtitle="Kelola profil, pengguna, organisasi & preferensi masjid" />

      <Tabs defaultValue="masjid">
        <TabsList className="rounded-2xl bg-muted p-1 w-full grid grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="masjid" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Building2 className="w-3 h-3 mr-1" />Profil</TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Users className="w-3 h-3 mr-1" />Pengguna</TabsTrigger>
          <TabsTrigger value="org" className="rounded-xl text-[11px] data-[state=active]:bg-white"><GitBranch className="w-3 h-3 mr-1" />DKM</TabsTrigger>
          <TabsTrigger value="kategori" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Tags className="w-3 h-3 mr-1" />Kategori</TabsTrigger>
          <TabsTrigger value="backup" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Database className="w-3 h-3 mr-1" />Backup</TabsTrigger>
          <TabsTrigger value="tema" className="rounded-xl text-[11px] data-[state=active]:bg-white"><Palette className="w-3 h-3 mr-1" />Tema</TabsTrigger>
        </TabsList>

        {/* Profil Masjid */}
        <TabsContent value="masjid" className="mt-4">
          <Card className="rounded-3xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="w-28 h-28 rounded-3xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 group">
                <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                <span className="text-[10px] text-muted-foreground font-medium">Logo Masjid</span>
              </div>
              <div className="w-44 h-28 rounded-3xl border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 group">
                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                <span className="text-[10px] text-muted-foreground font-medium">Foto Masjid</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-xs font-semibold text-muted-foreground mb-1 block">Nama Masjid</label><Input value={masjidForm.nama} onChange={e=>setMasjidForm({...masjidForm,nama:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div className="md:col-span-2"><label className="text-xs font-semibold text-muted-foreground mb-1 block">Alamat Lengkap</label><Input value={masjidForm.alamat} onChange={e=>setMasjidForm({...masjidForm,alamat:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Kelurahan</label><Input value={masjidForm.kelurahan} onChange={e=>setMasjidForm({...masjidForm,kelurahan:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Kecamatan</label><Input value={masjidForm.kecamatan} onChange={e=>setMasjidForm({...masjidForm,kecamatan:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Kota / Kab</label><Input value={masjidForm.kota} onChange={e=>setMasjidForm({...masjidForm,kota:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Provinsi</label><Input value={masjidForm.provinsi} onChange={e=>setMasjidForm({...masjidForm,provinsi:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Latitude</label><Input value={masjidForm.latitude} onChange={e=>setMasjidForm({...masjidForm,latitude:e.target.value})} className="rounded-2xl bg-muted border-0" placeholder="-6.9175" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Longitude</label><Input value={masjidForm.longitude} onChange={e=>setMasjidForm({...masjidForm,longitude:e.target.value})} className="rounded-2xl bg-muted border-0" placeholder="107.6191" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Telepon</label><Input value={masjidForm.telepon} onChange={e=>setMasjidForm({...masjidForm,telepon:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Email</label><Input type="email" value={masjidForm.email} onChange={e=>setMasjidForm({...masjidForm,email:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Bank</label><Input value={masjidForm.rekeningBank} onChange={e=>setMasjidForm({...masjidForm,rekeningBank:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">No. Rekening</label><Input value={masjidForm.nomorRekening} onChange={e=>setMasjidForm({...masjidForm,nomorRekening:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Metode Hisab</label><select value={masjidForm.metodeHisab} onChange={e=>setMasjidForm({...masjidForm,metodeHisab:e.target.value})} className="w-full px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm"><option value="KEMENAG">KEMENAG RI</option><option value="MUHAMMADIYAH">Muhammadiyah</option><option value="MWL">Muslim World League</option><option value="UMM_AL_QURA">Umm Al-Qura</option><option value="EGYPTIAN">Egyptian General Authority</option></select></div>
              <div><label className="text-xs font-semibold text-muted-foreground mb-1 block">Koreksi Menit</label><Input type="number" value={masjidForm.koreksiMenit} onChange={e=>setMasjidForm({...masjidForm,koreksiMenit:e.target.value})} className="rounded-2xl bg-muted border-0" /></div>
            </div>
            <button onClick={()=>toast('success','Profil masjid disimpan! Barakallahu fiik 🕌')} className="mt-6 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 flex items-center gap-2"><Save className="w-4 h-4"/> Simpan Perubahan</button>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-4">
          <Card className="rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2"><Shield className="w-4 h-4"/> {users.length} Pengguna</h3>
              <button onClick={()=>setShowUserModal(true)} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/90"><Plus className="w-3.5 h-3.5"/> Tambah User</button>
            </div>
            <DataTable
              searchable searchKeys={['nama','email','role']} data={users}
              columns={[
                { key: 'nama', label: 'Nama', render: (u: typeof users[0]) => (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white flex items-center justify-center text-[11px] font-bold">{u.nama.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</div>
                    <div><div className="text-sm font-semibold">{u.nama}</div><div className="text-[11px] text-muted-foreground">{u.email}</div></div>
                  </div>
                )},
                { key: 'role', label: 'Role', render: (u: typeof users[0]) => <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleColors[u.role]}`}>{roleLabel[u.role]}</span> },
                { key: 'aktif', label: 'Aktif', render: (u: typeof users[0]) => (
                  <button onClick={()=>setUsers(prev=>prev.map(x=>x.id===u.id?{...x,aktif:!x.aktif}:x))} className={`w-10 h-6 rounded-full flex items-center transition-all px-0.5 ${u.aktif ? 'bg-emerald-500 justify-end' : 'bg-muted justify-start'}`}><div className="w-5 h-5 rounded-full bg-white shadow-sm" /></button>
                )},
                { key: 'aksi', label: '', render: () => <button className="p-1.5 rounded-xl hover:bg-muted"><Pencil className="w-3.5 h-3.5" /></button> },
              ]}
            />
          </Card>
        </TabsContent>

        {/* Org DKM */}
        <TabsContent value="org" className="mt-4">
          <Card className="rounded-3xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
            <h3 className="font-bold text-sm mb-6">Struktur Organisasi DKM Masjid Al Qohar</h3>
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg flex items-center gap-2"><Crown className="w-4 h-4"/><div><div className="text-xs font-bold">Ketua DKM</div><div className="text-[11px] text-white/80">H. Ahmad Sanusi</div></div></div>
                <div className="w-0.5 h-6 bg-border" />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center"><div className="w-0.5 h-4 bg-border"/><div className="px-5 py-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-2"><UserCog className="w-3.5 h-3.5"/><div><div className="text-[11px] font-bold">Sekretaris</div><div className="text-[10px]">Citra Dewi</div></div></div></div>
                  <div className="flex flex-col items-center"><div className="w-0.5 h-4 bg-border"/><div className="px-5 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2"><Wallet className="w-3.5 h-3.5"/><div><div className="text-[11px] font-bold">Bendahara</div><div className="text-[10px]">Budi Santoso</div></div></div></div>
                </div>
                <div className="w-0.5 h-6 bg-border mt-2" /><div className="h-0.5 w-[280px] bg-border" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
                {[
                  { label: 'Ibadah & Dakwah', icon: BookOpen, color: 'bg-violet-50 border-violet-200 text-violet-700', nama: 'Ustadz Ahmad' },
                  { label: 'Sarpras', icon: Wrench, color: 'bg-amber-50 border-amber-200 text-amber-700', nama: 'Eko Saputra' },
                  { label: 'Humas & Media', icon: Megaphone, color: 'bg-cyan-50 border-cyan-200 text-cyan-700', nama: 'Doni Prasetyo' },
                  { label: 'Sosial', icon: HeartHandshake, color: 'bg-rose-50 border-rose-200 text-rose-700', nama: 'Fatimah Az-Zahra' },
                ].map(s => {
                  const Icon = s.icon;
                  return (<div key={s.label} className="flex flex-col items-center"><div className="w-0.5 h-4 bg-border"/><div className={`px-4 py-2.5 rounded-2xl border ${s.color} flex flex-col items-center gap-1 text-center w-full`}><Icon className="w-4 h-4"/><div className="text-[11px] font-bold leading-tight">{s.label}</div><div className="text-[10px] opacity-80">{s.nama}</div></div></div>);
                })}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Kategori */}
        <TabsContent value="kategori" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['MASUK','KELUAR'] as const).map(jenis => (
              <Card key={jenis} className="rounded-3xl p-5">
                <h4 className="text-xs font-bold mb-3 flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${jenis==='MASUK'?'bg-emerald-500':'bg-red-500'}`} /> {jenis==='MASUK'?'Pemasukan':'Pengeluaran'}</h4>
                <div className="space-y-2">
                  {kategoriList.filter(k=>k.jenis===jenis).map(k => (
                    <div key={k.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 hover:bg-muted transition-colors group">
                      {editingKat===k.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input value={editKatNama} onChange={e=>setEditKatNama(e.target.value)} className="rounded-xl bg-white border text-sm h-8 flex-1" autoFocus />
                          <button onClick={()=>{ setKategoriList(prev=>prev.map(x=>x.id===k.id?{...x,nama:editKatNama}:x)); setEditingKat(null); toast('success','Kategori diperbarui'); }} className="px-3 py-1 rounded-full bg-primary text-white text-xs">OK</button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs" style={{ backgroundColor: `${k.warna}20`, color: k.warna }}>◍</div><span className="text-sm font-medium">{k.nama}</span></div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>{ setEditingKat(k.id); setEditKatNama(k.nama); }} className="p-1.5 rounded-xl hover:bg-white"><Pencil className="w-3.5 h-3.5"/></button>
                            <button onClick={()=>setKategoriList(prev=>prev.filter(x=>x.id!==k.id))} className="p-1.5 rounded-xl hover:bg-white text-destructive"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup" className="mt-4">
          <Card className="rounded-3xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] space-y-6">
            <div><h3 className="font-bold text-sm mb-1">Backup & Restore</h3><p className="text-xs text-muted-foreground">Simpan data masjid secara lokal atau pulihkan dari file backup.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3"><Download className="w-5 h-5 text-emerald-600"/></div>
                <h4 className="font-semibold text-sm">Export Database</h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Unduh seluruh data masjid dalam format JSON.</p>
                <button onClick={handleExport} className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center gap-2"><Download className="w-3.5 h-3.5"/> Download Backup JSON</button>
                <div className="mt-4 text-[11px] text-muted-foreground">Terakhir backup: {formatTanggalPendek(new Date().toISOString())} • {db.transaksi.length} transaksi</div>
              </div>
              <div className="p-5 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100">
                <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3"><FileUp className="w-5 h-5 text-violet-600"/></div>
                <h4 className="font-semibold text-sm">Import Database</h4>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Pulihkan data dari file backup JSON.</p>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                <button onClick={()=>fileInputRef.current?.click()} className="px-5 py-2.5 rounded-full bg-violet-600 text-white text-xs font-semibold flex items-center gap-2"><Upload className="w-3.5 h-3.5"/> Pilih File JSON</button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tema */}
        <TabsContent value="tema" className="mt-4">
          <Card className="rounded-3xl p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
            <h3 className="font-bold text-sm mb-1">Tampilan & Tema</h3>
            <p className="text-xs text-muted-foreground mb-6">Pilih tema yang nyaman untuk mata.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
              {[
                { id: 'light', label: 'Terang', desc: 'Selalu mode light', icon: Sun, preview: 'bg-white border text-slate-800' },
                { id: 'dark', label: 'Gelap', desc: 'Selalu mode dark', icon: Moon, preview: 'bg-slate-900 border-slate-700 text-white' },
                { id: 'auto', label: 'Otomatis', desc: 'Ikuti sistem', icon: Monitor, preview: 'bg-gradient-to-br from-white to-slate-900 border text-slate-700' },
              ].map(opt => {
                const Icon = opt.icon;
                const selected = temaMode === opt.id;
                return (
                  <button key={opt.id} onClick={()=>{
                    setTemaMode(opt.id as 'light' | 'dark' | 'auto');
                    if (opt.id === 'auto') {
                      const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
                      setTheme(prefersDark ? 'dark' : 'light');
                    } else setTheme(opt.id as 'light' | 'dark');
                    toast('success',`Tema ${opt.label} aktif!`);
                  }} className={`p-4 rounded-3xl border-2 text-left transition-all ${selected ? 'border-primary bg-primary-soft/30 shadow-sm' : 'border-border bg-muted/30'}`}>
                    <div className={`w-full h-20 rounded-2xl ${opt.preview} flex items-center justify-center mb-3 text-xs font-medium`}>{opt.label}</div>
                    <div className="flex items-center gap-2"><Icon className="w-4 h-4"/><span className="text-sm font-semibold">{opt.label}</span>{selected && <span className="ml-auto w-2 h-2 rounded-full bg-primary"/>}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal open={showUserModal} onClose={()=>setShowUserModal(false)} title="Tambah Pengguna">
        <form onSubmit={e=>{
          e.preventDefault();
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const nama = String(fd.get('nama')||''); const email = String(fd.get('email')||''); const role = String(fd.get('role')||'PENGURUS') as UserRole;
          if (!nama || !email) return;
          setUsers(prev=>[...prev, { id: `u${Date.now()}`, nama, email, password: '123456', role, aktif: true, masjidId: 'msj-1' }]);
          toast('success','Pengguna ditambahkan! 🎉'); setShowUserModal(false);
        }} className="space-y-3">
          <Input name="nama" placeholder="Nama lengkap" required className="rounded-2xl bg-muted border-0" />
          <Input name="email" type="email" placeholder="Email" required className="rounded-2xl bg-muted border-0" />
          <Input name="password" type="password" placeholder="Password awal" className="rounded-2xl bg-muted border-0" />
          <select name="role" className="w-full px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm"><option value="SUPER_ADMIN">Super Admin</option><option value="BENDAHARA">Bendahara</option><option value="SEKRETARIS">Sekretaris</option><option value="PENGURUS">Pengurus</option><option value="MARBOT">Marbot</option></select>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}
