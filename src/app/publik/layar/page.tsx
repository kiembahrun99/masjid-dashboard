'use client';

import { useState, useEffect } from 'react';
import { getDb } from '@/lib/data-provider';
import { getRemainingSeconds, getHijriDate } from '@/lib/date';
import { MapPin, Clock, Compass } from 'lucide-react';

export default function LayarMasjidPage() {
  const db = getDb();
  const [time, setTime] = useState(new Date());
  const [countdown, setCountdown] = useState('--:--:--');
  const [nextPrayerName, setNextPrayerName] = useState('Subuh');
  const prayerTimes = [
    { name: 'Subuh', waktu: '04:30' },
    { name: 'Dzuhur', waktu: '12:10' },
    { name: 'Ashar', waktu: '15:30' },
    { name: 'Maghrib', waktu: '17:55' },
    { name: 'Isya', waktu: '19:10' },
  ];
  const umum = db.pengumuman.filter(p=>p.tampilPublik).map(p=>p.judul).join('  •  ');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now);
      const cur = now.getHours()*60+now.getMinutes();
      let next = prayerTimes[0];
      for (const p of prayerTimes) {
        const [h,m]=p.waktu.split(':').map(Number);
        if (h*60+m > cur) { next = p; break; }
      }
      setNextPrayerName(next.name);
      const [h,m]=next.waktu.split(':').map(Number);
      const target = new Date(now); target.setHours(h,m,0,0);
      if (target <= now) target.setDate(target.getDate()+1);
      setCountdown(getRemainingSeconds(target));
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 sm:p-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🕌</div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold leading-none">{db.masjid.nama}</div>
            <div className="text-xs text-white/60 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/>{db.masjid.kelurahan}, {db.masjid.kota}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl sm:text-5xl font-extrabold tabular-nums tracking-tight">{time.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div>
          <div className="text-xs text-white/60">{time.toLocaleDateString('id-ID',{weekday:'long', day:'numeric', month:'long', year:'numeric'})} • {getHijriDate()}</div>
        </div>
      </header>

      {/* Main — Prayer times */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 p-6 sm:p-8">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white/[0.08] backdrop-blur-xl border border-white/10 p-8 text-center">
            <div className="text-sm text-white/60">Menuju</div>
            <div className="text-3xl sm:text-4xl font-extrabold mt-1">{nextPrayerName}</div>
            <div className="text-6xl sm:text-7xl font-extrabold tabular-nums font-mono mt-4 tracking-tight">{countdown}</div>
            <div className="text-white/50 text-sm mt-2">WIB</div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {prayerTimes.map(p => {
              const active = p.name === nextPrayerName;
              return (
                <div key={p.name} className={`rounded-2xl p-4 text-center ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/10 backdrop-blur'}`}>
                  <div className="text-[11px] text-white/60">{p.name}</div>
                  <div className="text-xl font-extrabold mt-1 tabular-nums">{p.waktu}</div>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl bg-white/5 backdrop-blur p-5">
            <h3 className="text-sm font-bold mb-2">Agenda Hari Ini</h3>
            <div className="space-y-2">
              {db.agenda.slice(0,3).map(a=>(
                <div key={a.id} className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs">📅</div><div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{a.judul}</div><div className="text-[11px] text-white/50">{a.lokasi} • {a.pemateri||'DKM'}</div></div></div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] bg-white/[0.08] backdrop-blur-xl border border-white/10 p-6">
            <h3 className="text-sm font-bold mb-4">Kas Masjid</h3>
            {(() => {
              const masuk = db.transaksi.filter(t=>t.jenis==='MASUK').reduce((s,t)=>s+t.nominal,0);
              const keluar = db.transaksi.filter(t=>t.jenis==='KELUAR').reduce((s,t)=>s+t.nominal,0);
              return (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-white/60">Masuk</span><span className="font-bold text-emerald-300">Rp {(masuk/1e6).toFixed(1)} jt</span></div>
                  <div className="flex justify-between text-sm"><span className="text-white/60">Keluar</span><span className="font-bold text-red-300">Rp {(keluar/1e6).toFixed(1)} jt</span></div>
                  <div className="h-px bg-white/10 my-2"/>
                  <div className="flex justify-between text-base font-bold"><span>Saldo</span><span>Rp {((masuk-keluar)/1e6).toFixed(1)} jt</span></div>
                </div>
              );
            })()}
          </div>

          <div className="rounded-[32px] bg-white/[0.08] backdrop-blur-xl border border-white/10 p-6">
            <h3 className="text-sm font-bold mb-2">Pengumuman</h3>
            {db.pengumuman.filter(p=>p.tampilPublik).slice(0,3).map(p=>(
              <div key={p.id} className="mt-3"><div className="text-xs font-semibold">{p.judul}</div><div className="text-[11px] text-white/50 line-clamp-2 mt-0.5">{p.isi}</div></div>
            ))}
          </div>

          <div className="rounded-3xl bg-emerald-500/20 border border-emerald-400/30 p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-300" />
            <p className="text-xs text-white/80">TV Mode • Fullscreen untuk masjid · Tekan Esc untuk keluar · Refresh otomatis tiap menit</p>
          </div>
        </div>
      </main>

      {/* Running text */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur overflow-hidden whitespace-nowrap">
        <div className="py-3 text-sm animate-marquee flex" style={{ animation: 'marquee 40s linear infinite' }}>
          <span className="flex gap-8">
            <span>🕌 {db.masjid.nama} · {db.masjid.alamat}</span>
            <span>{umum}</span>
            <span>Informasi: {db.masjid.telepon} · {db.masjid.email}</span>
            <span>Barakallahu fiikum 🤲</span>
          </span>
        </div>
      </div>

      <style>{`@keyframes marquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}`}</style>
    </div>
  );
}