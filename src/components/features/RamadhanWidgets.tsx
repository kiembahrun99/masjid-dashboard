'use client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Moon, Sunrise, Sun } from 'lucide-react';

interface RamadhanWidgetsProps {
  variant?: 'compact' | 'full';
}

export function ImsakiyahCard({ variant='full' }: RamadhanWidgetsProps) {
  // Mock imsakiyah for Bandung Ramadhan 1447 ~ Feb 2026
  const imsakiyah = [
    { day: 1, date: '18 Feb 2026', imsak: '04:28', subuh: '04:38', maghrib: '18:15', isya: '19:26' },
    { day: 2, date: '19 Feb 2026', imsak: '04:28', subuh: '04:38', maghrib: '18:15', isya: '19:26' },
    { day: 15, date: '4 Mar 2026', imsak: '04:26', subuh: '04:36', maghrib: '18:14', isya: '19:25' },
    { day: 30, date: '19 Mar 2026', imsak: '04:23', subuh: '04:33', maghrib: '18:10', isya: '19:20' },
  ];
  return (
    <Card className="rounded-3xl p-5 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border-violet-200/50">
      <div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center"><Moon className="w-4 h-4 text-violet-600"/></div><h3 className="font-bold text-sm">Imsakiyah Ramadhan 1447 H</h3><Badge variant="outline" className="ml-auto rounded-full text-[9px]">Bandung</Badge></div>
      <div className="overflow-x-auto"><table className="w-full text-[11px]"><thead><tr className="text-muted-foreground"><th className="text-left py-1">Hari</th><th>Imsak</th><th>Subuh</th><th>Maghrib</th><th>Isya</th></tr></thead><tbody>{imsakiyah.map(r=><tr key={r.day} className="border-t border-border/50"><td className="py-1.5 font-medium">{r.day} · {r.date}</td><td className="text-center font-bold">{r.imsak}</td><td className="text-center">{r.subuh}</td><td className="text-center text-amber-600 font-semibold">{r.maghrib}</td><td className="text-center">{r.isya}</td></tr>)}</tbody></table></div>
      <p className="text-[10px] text-muted-foreground mt-2">Waktu disesuaikan dengan metode Kemenag RI + koreksi {2} menit. Sahur tepat waktu, buka penuh berkah 🌙</p>
    </Card>
  );
}

export function JadwalTarawihCard() {
  const jad = [
    { malam: 1, imam: 'Ustadz Ahmad Fauzi', penceramah: 'Ustadz Abdul Somad', tema: 'Keutamaan Ramadhan' },
    { malam: 2, imam: 'Ustadz Bilal', penceramah: 'Ustadz Hanan Attaki', tema: 'Lailatul Qadar' },
    { malam: 15, imam: 'Ustadz Yusuf', penceramah: 'Ustadz Adi Hidayat', tema: 'Nuzulul Quran' },
  ];
  return (
    <Card className="rounded-3xl p-5">
      <h3 className="font-bold text-sm mb-3">Jadwal Imam Tarawih & Kultum</h3>
      <div className="space-y-2">{jad.map(j=><div key={j.malam} className="p-3 rounded-2xl bg-bg-subtle flex justify-between"><div><div className="text-xs font-bold">Malam ke-{j.malam}</div><div className="text-[11px] text-muted-foreground">Imam: {j.imam} · Kultum: {j.tema}</div></div><Badge variant="outline" className="rounded-full text-[9px] h-fit">{j.penceramah}</Badge></div>)}</div>
    </Card>
  );
}