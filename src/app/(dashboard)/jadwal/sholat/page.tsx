'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { getDb } from '@/lib/data-provider';
import { getRemainingSeconds } from '@/lib/date';
import { Clock, Moon, Sun, Sunset, MapPin, Compass, Settings2 } from 'lucide-react';

const prayerInfo = [
  { name: 'Subuh', ikon: Moon, waktu: '04:30', desc: 'Fajar menyingsing' },
  { name: 'Dzuhur', ikon: Sun, waktu: '12:10', desc: 'Tengah hari' },
  { name: 'Ashar', ikon: Sun, waktu: '15:30', desc: 'Sore hari' },
  { name: 'Maghrib', ikon: Sunset, waktu: '17:55', desc: 'Matahari terbenam' },
  { name: 'Isya', ikon: Moon, waktu: '19:10', desc: 'Malam hari' },
];

export default function JadwalSholatPage() {
  const db = getDb();
  const [countdown, setCountdown] = useState('--:--:--');
  const [nextIdx, setNextIdx] = useState(0);
  const [showSetting, setShowSetting] = useState(false);
  const [koreksi, setKoreksi] = useState(db.masjid.koreksiMenit);
  const [metode, setMetode] = useState(db.masjid.metodeHisab);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const curMin = now.getHours() * 60 + now.getMinutes();
      let idx = 0;
      for (let i = 0; i < prayerInfo.length; i++) {
        const [h, m] = prayerInfo[i].waktu.split(':').map(Number);
        if (h * 60 + m > curMin) { idx = i; break; }
        if (i === prayerInfo.length - 1) idx = 0;
      }
      setNextIdx(idx);
      const [h, m] = prayerInfo[idx].waktu.split(':').map(Number);
      const target = new Date(now);
      target.setHours(h, m, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      setCountdown(getRemainingSeconds(target));
    };
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, []);

  const kiblat = 292; // approximate for Surabaya - Lidah Kulon

  return (
    <div className="space-y-6">
      <PageHeader title="Jadwal Sholat" subtitle={`${db.masjid.nama} · ${db.masjid.kota}`} action={{ label: 'Pengaturan', onClick: () => setShowSetting(!showSetting) }} />

      {/* Setting panel */}
      {showSetting && (
        <Card className="rounded-3xl p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Settings2 className="w-4 h-4" /> Pengaturan Jadwal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Metode Perhitungan</label>
              <select value={metode} onChange={e => setMetode(e.target.value)} className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm">
                <option value="KEMENAG">Kemenag RI</option>
                <option value="MWL">Muslim World League</option>
                <option value="EGYPT">Egyptian</option>
                <option value="KARACHI">Karachi</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Koreksi Menit</label>
              <input type="number" value={koreksi} onChange={e => setKoreksi(Number(e.target.value))} className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm" />
            </div>
          </div>
        </Card>
      )}

      {/* Hero countdown */}
      <Card className="rounded-3xl bg-gradient-to-br from-emerald-600 to-cyan-500 text-white p-8 text-center">
        <p className="text-sm text-white/70 mb-1">Menuju {prayerInfo[nextIdx]?.name}</p>
        <p className="text-5xl font-extrabold tabular-nums font-mono">{countdown}</p>
        <p className="text-lg mt-2 font-semibold">{prayerInfo[nextIdx]?.waktu} WIB</p>
        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-white/70">
          <MapPin className="w-3 h-3" /> {db.masjid.latitude}, {db.masjid.longitude}
        </div>
      </Card>

      {/* All times */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {prayerInfo.map((p, i) => {
          const Icon = p.ikon;
          const active = i === nextIdx;
          return (
            <Card key={p.name} className={`rounded-3xl p-5 text-center transition-all ${active ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' : ''}`}>
              <Icon className={`w-7 h-7 mx-auto mb-2 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              <p className="font-bold">{p.name}</p>
              <p className={`text-2xl font-extrabold tabular-nums mt-1 ${active ? '' : 'text-foreground'}`}>{p.waktu}</p>
              <p className={`text-xs mt-1 ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{p.desc}</p>
            </Card>
          );
        })}
      </div>

      {/* Kiblat */}
      <Card className="rounded-3xl p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Compass className="w-4 h-4" /> Arah Kiblat</h3>
          <p className="text-sm text-muted-foreground mt-1">{kiblat}° dari Utara</p>
          <p className="text-xs text-muted-foreground">Untuk wilayah Surabaya, Jawa Timur — Lidah Kulon, Lakarsantri</p>
        </div>
        <div className="w-20 h-20 rounded-full border-2 border-primary-soft flex items-center justify-center relative">
          <div className="w-1 h-8 bg-primary absolute" style={{ transform: `rotate(${kiblat}deg)`, transformOrigin: 'bottom center', bottom: '50%' }} />
          <Compass className="w-6 h-6 text-primary" />
        </div>
      </Card>

      {/* Ramadhan */}
      <Card className="rounded-3xl p-5 bg-gradient-to-br from-gold-soft/50 to-primary-soft/30">
        <h3 className="font-semibold text-sm mb-1">🌙 Mode Ramadhan</h3>
        <p className="text-xs text-muted-foreground mb-3">Fitur khusus Ramadhan akan aktif saat bulan Ramadhan</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-bg-surface rounded-2xl p-3">
            <p className="text-xs text-muted-foreground">Imsak</p>
            <p className="font-bold">04:20</p>
          </div>
          <div className="bg-bg-surface rounded-2xl p-3">
            <p className="text-xs text-muted-foreground">Tarawih</p>
            <p className="font-bold">19:30</p>
          </div>
          <div className="bg-bg-surface rounded-2xl p-3">
            <p className="text-xs text-muted-foreground">Sahur</p>
            <p className="font-bold">03:30</p>
          </div>
        </div>
      </Card>
    </div>
  );
}