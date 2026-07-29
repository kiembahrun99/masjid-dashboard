'use client';

import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { useEffect, useState } from 'react';
import StatCard from '@/components/shared/StatCard';
import EmptyState from '@/components/shared/EmptyState';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek, getRemainingSeconds, getHijriDate, formatWaktu } from '@/lib/date';
import { cn } from '@/lib/utils';
import { getDb } from '@/lib/data-provider';
import {
  Wallet, TrendingUp, Users, Calendar,
  Plus, MapPin, ChevronRight, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const db = getDb();
  const stats = db.getDashboardStats();
  const cashFlow = db.getMonthlyCashFlow();
  const donasiKomposisi = db.getDonasiKomposisi();
  const upcoming = db.agenda.filter(a => a.status === 'RENCANA').slice(0, 5);
  const feed = db.logAktivitas.slice(0, 5);

  // Prayer time countdown
  const prayerTimes = [
    { name: 'Subuh', waktu: '04:30' },
    { name: 'Dzuhur', waktu: '12:10' },
    { name: 'Ashar', waktu: '15:30' },
    { name: 'Maghrib', waktu: '17:55' },
    { name: 'Isya', waktu: '19:10' },
  ];

  const getNextPrayer = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const p of prayerTimes) {
      const [h, m] = p.waktu.split(':').map(Number);
      if (h * 60 + m > currentMinutes) return p;
    }
    return prayerTimes[0];
  };

  const [countdown, setCountdown] = useState('--:--:--');
  const [nextPrayer, setNextPrayer] = useState(getNextPrayer());

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getNextPrayer();
      setNextPrayer(next);
      const now = new Date();
      const [h, m] = next.waktu.split(':').map(Number);
      const target = new Date(now);
      target.setHours(h, m, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      setCountdown(getRemainingSeconds(target));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hijri = getHijriDate();

  // Compute next prayer index
  const nextIdx = prayerTimes.findIndex(p => p.name === nextPrayer.name);

  return (
    <div className="space-y-6">
      {/* Hero Card - Prayer Time */}
      <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500 text-white p-6 md:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEMzMCAwIDI4LjUgMTAgMjAgMTBDMTEuNSAxMCAxMCAwIDEwIDBDMTAgMCAxMS41IDEwIDIwIDEwQzI4LjUgMTAgMzAgMCAzMCAweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgdHJhbnNmb3JtPSJyb3RhdGUoMTUgMzAgMzApIi8+PC9zdmc+')] opacity-30 bg-repeat" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-white/80 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                {db.masjid.nama} · Bandung
              </div>
              <div className="text-2xl font-bold">{hijri}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{nextPrayer.name}</div>
              <div className="text-4xl font-bold tabular-nums font-mono">{countdown}</div>
              <div className="text-sm text-white/80">menuju {nextPrayer.name}</div>
            </div>
          </div>

          {/* All prayer times */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {prayerTimes.map((p, i) => (
              <div key={p.name} className={cn(
                'text-center p-2 rounded-2xl transition-colors',
                i === nextIdx ? 'bg-white/20' : 'bg-white/5'
              )}>
                <div className="text-[10px] text-white/70">{p.name}</div>
                <div className="text-sm font-bold">{p.waktu}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Saldo Kas Masjid"
          value={stats.saldoKas}
          icon={Wallet}
          iconColor="text-primary"
          iconBg="bg-primary-soft"
          trend={stats.perubahanDonasi}
          format="rupiah"
        />
        <StatCard
          title="Donasi Bulan Ini"
          value={stats.donasiBulanIni}
          icon={TrendingUp}
          iconColor="text-accent"
          iconBg="bg-accent-soft"
          format="rupiah"
        />
        <StatCard
          title="Total Jamaah"
          value={stats.totalJamaah}
          icon={Users}
          iconColor="text-info"
          iconBg="bg-info/10"
          trend={5}
          format="number"
        />
        <StatCard
          title="Agenda Minggu Ini"
          value={stats.agendaMingguIni}
          icon={Calendar}
          iconColor="text-gold"
          iconBg="bg-gold-soft"
          format="number"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cash Flow Chart */}
        <Card className="rounded-3xl p-5 lg:col-span-2 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
          <h3 className="text-sm font-semibold mb-4">Arus Kas 6 Bulan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlow}>
                <defs>
                  <linearGradient id="pemasukan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pengeluaran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [formatRupiah(Number(value)), '']}
                />
                <Area type="monotone" dataKey="pemasukan" stroke="#16A34A" fill="url(#pemasukan)" strokeWidth={2} />
                <Area type="monotone" dataKey="pengeluaran" stroke="#EF4444" fill="url(#pengeluaran)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
          <h3 className="text-sm font-semibold mb-4">Sumber Dana</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donasiKomposisi}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donasiKomposisi.map((entry, i) => (
                    <Cell key={i} fill={entry.warna} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatRupiah(Number(value)), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {donasiKomposisi.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.warna }} />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="ml-auto font-semibold tabular-nums">{formatRupiah(item.value, true)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row: Timeline + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Timeline Agenda */}
        <Card className="rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Agenda Terdekat</h3>
            <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
              Lihat semua <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState icon={Calendar} title="Belum ada agenda" description="Yuk buat agenda baru!" />
          ) : (
            <div className="space-y-3">
              {upcoming.map(a => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-bg-subtle transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.judul}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTanggalPendek(a.tanggalMulai)} · {a.lokasi}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px] shrink-0">
                    {a.jenis.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Feed Aktivitas */}
        <Card className="rounded-3xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)]">
          <h3 className="text-sm font-semibold mb-4">Aktivitas Terbaru</h3>
          {feed.length === 0 ? (
            <EmptyState icon={Clock} title="Belum ada aktivitas" />
          ) : (
            <div className="space-y-2">
              {feed.map(log => {
                const user = db.users.find(u => u.id === log.userId);
                return (
                  <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-subtle transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-bg-subtle flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground">
                      {user?.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{user?.nama}</span>{' '}
                        <span className="text-muted-foreground">{log.aksi}</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{log.detail}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatWaktu(new Date(log.createdAt))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Action FAB */}
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex flex-col gap-2">
        <button className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

