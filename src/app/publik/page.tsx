'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek, getHijriDate } from '@/lib/date';
import { getDb } from '@/lib/data-provider';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  MapPin, Phone, Mail, Clock, Heart, Calendar,
  Megaphone, Wallet, Share2, QrCode, Building2, Landmark,
  Sun, Sunset, Moon, ArrowRight,
} from 'lucide-react';

export default function PublikPage() {
  const db = getDb();
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);

  const saldo = db.transaksi.filter(t=>t.jenis==='MASUK').reduce((s,t)=>s+t.nominal,0)
              - db.transaksi.filter(t=>t.jenis==='KELUAR').reduce((s,t)=>s+t.nominal,0);
  const cashFlow = db.getMonthlyCashFlow().slice(-6);
  const komposisi = db.getDonasiKomposisi();
  const agendaMendatang = db.agenda.filter(a=>a.status==='RENCANA').slice(0,3);
  const campaignsAktif = db.campaigns.filter(c=>c.status==='AKTIF');
  const pengumumanPublik = db.pengumuman.filter(p=>p.tampilPublik);
  const prayerTimes = db.prayerTimes;
  const hijri = getHijriDate();

  const prayerIcons: Record<string, React.ElementType> = {
    Subuh: Moon, Dzuhur: Sun, Ashar: Sun, Maghrib: Sunset, Isya: Moon,
  };

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-500 flex items-center justify-center text-white text-lg">🕌</div>
            <div><div className="font-bold text-sm leading-none">{db.masjid.nama}</div><div className="text-[11px] text-muted-foreground">{db.masjid.kelurahan}, {db.masjid.kota}</div></div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {[{ label: 'Beranda', href: '#beranda' },{ label: 'Laporan', href: '#laporan' },{ label: 'Agenda', href: '#agenda' },{ label: 'Kontak', href: '#kontak' }].map(l=>(
              <a key={l.label} href={l.href} className="px-3.5 py-2 rounded-full text-xs font-medium hover:bg-muted transition-colors">{l.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-medium"><Clock className="w-3 h-3" />{now.toLocaleTimeString('id-ID',{ hour:'2-digit', minute:'2-digit' })}</div>
            <a href="/login" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90">Masuk</a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 pb-16 pt-6">
        <section id="beranda" className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 p-6 sm:p-10 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] font-semibold mb-4"><span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Masjid Aktif • {hijri}</div>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">{db.masjid.nama}</h1>
              <p className="mt-2 text-white/80 text-sm flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {db.masjid.alamat}, {db.masjid.kelurahan}, {db.masjid.kecamatan}, {db.masjid.kota}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href="#laporan" className="px-5 py-2.5 rounded-full bg-white text-emerald-700 text-sm font-bold hover:bg-white/90 transition-colors flex items-center gap-1.5">Lihat Transparansi <ArrowRight className="w-4 h-4" /></a>
                <a href="#kontak" className="px-5 py-2.5 rounded-full bg-white/15 backdrop-blur text-white text-sm font-semibold hover:bg-white/20 transition-colors">Hubungi Kami</a>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Jadwal Sholat Hari Ini</h3>
              <div className="space-y-2">
                {prayerTimes.map(p => {
                  const Icon = prayerIcons[p.name] || Clock;
                  return (
                    <div key={p.name} className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/10">
                      <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-white/80" /><span className="text-sm font-medium">{p.name}</span></div>
                      <span className="text-sm font-bold tabular-nums">{p.waktu}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-[11px] text-white/60 text-center">Waktu untuk wilayah {db.masjid.kota} & sekitarnya</div>
            </div>
          </div>
        </section>

        <section id="laporan" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center"><Wallet className="w-4 h-4 text-emerald-600" /></div>
            <div><h2 className="text-base font-bold">Transparansi Keuangan</h2><p className="text-xs text-muted-foreground">Kelola dana jamaah secara terbuka & amanah</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="rounded-3xl p-6 bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0 lg:col-span-1">
              <div className="text-sm text-white/70">Saldo Kas Saat Ini</div><div className="text-3xl font-extrabold mt-2 tabular-nums">{formatRupiah(saldo)}</div>
              <div className="mt-3 flex gap-2">
                <div className="px-2.5 py-1 rounded-full bg-white/15 text-xs">Masuk: {formatRupiah(db.transaksi.filter(t=>t.jenis==='MASUK').reduce((s,t)=>s+t.nominal,0), true)}</div>
                <div className="px-2.5 py-1 rounded-full bg-white/15 text-xs">Keluar: {formatRupiah(db.transaksi.filter(t=>t.jenis==='KELUAR').reduce((s,t)=>s+t.nominal,0), true)}</div>
              </div>
              <div className="mt-4 text-[11px] text-white/60">Update realtime • {db.transaksi.length} transaksi tercatat</div>
            </Card>
            <Card className="rounded-3xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold mb-3">Arus Kas 6 Bulan Terakhir</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlow}>
                    <defs>
                      <linearGradient id="pubMasuk" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                      <linearGradient id="pubKeluar" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} /><stop offset="95%" stopColor="#F43F5E" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v=>`${(Number(v)/1e6).toFixed(0)}jt`} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value: any)=>[formatRupiah(Number(value)),''] as any} />
                    <Area type="monotone" dataKey="pemasukan" stroke="#10B981" fill="url(#pubMasuk)" strokeWidth={2} />
                    <Area type="monotone" dataKey="pengeluaran" stroke="#F43F5E" fill="url(#pubKeluar)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="rounded-3xl p-5 lg:col-span-2">
              <h3 className="text-sm font-semibold mb-3">Donasi Campaign Aktif</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campaignsAktif.map(c => {
                  const pct = Math.min(100, Math.round((c.danaTerkumpul / c.targetDana) * 100));
                  return (
                    <div key={c.id} className="p-4 rounded-3xl bg-muted/40 border border-border/50 space-y-3">
                      <div className="flex items-start justify-between"><h4 className="text-sm font-bold leading-tight">{c.judul}</h4><Badge className="rounded-full bg-emerald-100 text-emerald-700 border-0 text-[10px]">{c.status}</Badge></div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{c.deskripsi}</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]"><span className="text-muted-foreground">Terkumpul</span><span className="font-bold">{pct}%</span></div>
                        <div className="h-2 rounded-full bg-border overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${pct}%` }} /></div>
                        <div className="flex justify-between text-[11px] tabular-nums"><span className="font-semibold">{formatRupiah(c.danaTerkumpul, true)}</span><span className="text-muted-foreground">{formatRupiah(c.targetDana, true)}</span></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 p-2.5 rounded-2xl bg-white border flex flex-col items-center gap-1"><QrCode className="w-10 h-10 text-muted-foreground" /><span className="text-[9px] text-muted-foreground">QRIS {db.masjid.rekeningBank}</span></div>
                        <div className="flex flex-col gap-2 flex-1">
                          <button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(`Saya ingin berdonasi untuk ${c.judul} di ${db.masjid.nama}`)}`,'_blank')} className="px-3 py-2 rounded-full bg-emerald-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5"><Share2 className="w-3 h-3"/> Share WA</button>
                          <button className="px-3 py-2 rounded-full bg-muted text-[11px] font-semibold">Detail Donasi</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card className="rounded-3xl p-5">
              <h3 className="text-sm font-semibold mb-3">Komposisi Donasi</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={komposisi} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {komposisi.map((e: any,i:number)=><Cell key={i} fill={e.warna} />)}
                    </Pie>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Tooltip formatter={(v: any)=>[formatRupiah(Number(v)),''] as any} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-1">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {komposisi.map((item: any,i:number)=>(
                  <div key={i} className="flex items-center gap-2 text-[11px]"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.warna }} /><span className="text-muted-foreground flex-1 truncate">{item.name}</span><span className="font-semibold tabular-nums">{formatRupiah(item.value, true)}</span></div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section id="agenda" className="space-y-3">
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center"><Calendar className="w-4 h-4 text-violet-600" /></div><h2 className="text-base font-bold">Agenda Mendatang</h2></div>
            <div className="space-y-3">
              {agendaMendatang.map(a => (
                <Card key={a.id} className="rounded-3xl p-4 flex gap-3 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex flex-col items-center justify-center shrink-0"><div className="text-[10px] font-bold text-violet-600">{formatTanggalPendek(a.tanggalMulai).split(' ')[1]}</div><div className="text-sm font-extrabold text-violet-700">{formatTanggalPendek(a.tanggalMulai).split(' ')[0]}</div></div>
                  <div className="flex-1 min-w-0"><div className="flex items-center gap-1.5 mb-0.5"><Badge variant="outline" className="rounded-full text-[9px]">{a.jenis.replace(/_/g,' ')}</Badge>{a.pemateri && <span className="text-[10px] text-muted-foreground">• {a.pemateri}</span>}</div><div className="text-sm font-semibold truncate">{a.judul}</div><div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{a.lokasi}</div></div>
                </Card>
              ))}
            </div>
          </section>
          <section className="space-y-3">
            <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"><Megaphone className="w-4 h-4 text-amber-600" /></div><h2 className="text-base font-bold">Pengumuman Publik</h2></div>
            <div className="space-y-3">
              {pengumumanPublik.map(p => (
                <Card key={p.id} className="rounded-3xl p-4"><div className="flex items-start justify-between mb-1"><h4 className="text-sm font-semibold">{p.judul}</h4><Badge className={`rounded-full text-[9px] border-0 ${p.prioritas==='TINGGI'?'bg-red-100 text-red-700':p.prioritas==='SEDANG'?'bg-amber-100 text-amber-700':'bg-muted text-muted-foreground'}`}>{p.prioritas}</Badge></div><p className="text-xs text-muted-foreground line-clamp-2">{p.isi}</p><div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground"><span>{p.kategori}</span><span>•</span><span>{formatTanggalPendek(p.tanggalTayang)}</span></div></Card>
              ))}
            </div>
          </section>
        </div>

        <section id="kontak" className="space-y-4">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-xl bg-cyan-100 flex items-center justify-center"><Building2 className="w-4 h-4 text-cyan-600" /></div><h2 className="text-base font-bold">Kontak & Lokasi</h2></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="rounded-[24px] overflow-hidden lg:col-span-2 p-0 border-0 shadow-sm">
              <div className="h-[280px] w-full bg-muted relative">
                <iframe title="Lokasi Masjid" className="w-full h-full border-0" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${db.masjid.longitude - 0.005}%2C${db.masjid.latitude - 0.005}%2C${db.masjid.longitude + 0.005}%2C${db.masjid.latitude + 0.005}&layer=mapnik&marker=${db.masjid.latitude}%2C${db.masjid.longitude}`} />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-white shadow text-[11px] font-medium flex items-center gap-1.5"><MapPin className="w-3 h-3 text-emerald-600" /> {db.masjid.latitude.toFixed(4)}, {db.masjid.longitude.toFixed(4)}</div>
              </div>
            </Card>
            <Card className="rounded-3xl p-5 space-y-4">
              <div><div className="text-xs text-muted-foreground mb-1">Alamat Lengkap</div><div className="text-sm font-medium">{db.masjid.alamat}, {db.masjid.kelurahan}, {db.masjid.kecamatan}, {db.masjid.kota}, {db.masjid.provinsi}</div></div>
              <div className="h-px bg-border" />
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center"><Phone className="w-4 h-4 text-emerald-600" /></div>{db.masjid.telepon}</div>
                <div className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center"><Mail className="w-4 h-4 text-blue-600" /></div>{db.masjid.email}</div>
                <div className="flex items-center gap-3 text-sm"><div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center"><Landmark className="w-4 h-4 text-amber-600" /></div>{db.masjid.rekeningBank} — {db.masjid.nomorRekening}</div>
              </div>
              <div className="pt-2 flex gap-2">
                <a href={`https://wa.me/${db.masjid.telepon.replace(/[^0-9]/g,'')}`} target="_blank" className="flex-1 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold text-center hover:bg-emerald-700">Chat WhatsApp</a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${db.masjid.latitude},${db.masjid.longitude}`} target="_blank" className="flex-1 py-2.5 rounded-full bg-muted text-xs font-semibold text-center hover:bg-border">Buka Maps</a>
              </div>
            </Card>
          </div>
        </section>
      </div>

      <footer className="border-t border-border/50 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div><div className="flex items-center gap-2 font-bold text-sm"><span className="text-lg">🕌</span> {db.masjid.nama}</div><p className="text-xs text-muted-foreground mt-1 max-w-xs">Sistem Manajemen Masjid Transparan & Amanah. Dikelola oleh DKM {db.masjid.nama} dengan prinsip keterbukaan.</p></div>
            <div className="flex gap-8 text-xs"><div><div className="font-semibold mb-2">Menu</div><div className="space-y-1 text-muted-foreground"><div><a href="#beranda" className="hover:text-foreground">Beranda</a></div><div><a href="#laporan" className="hover:text-foreground">Laporan</a></div><div><a href="#agenda" className="hover:text-foreground">Agenda</a></div><div><a href="/login" className="hover:text-foreground">Login Pengurus</a></div></div></div><div><div className="font-semibold mb-2">Amanah</div><div className="space-y-1 text-muted-foreground"><div>Transparansi 100%</div><div>Audit DKM Bulanan</div><div>Laporan Jumat</div></div></div></div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-muted-foreground"><span>© 2026 {db.masjid.nama}. Barakallahu fiikum 🤲</span><span className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-400" /> Dibuat dengan amanah untuk jamaah.</span></div>
        </div>
      </footer>
    </div>
  );
}
