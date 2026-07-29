'use client';
import PageHeader from '@/components/shared/PageHeader';
import { ImsakiyahCard, JadwalTarawihCard } from '@/components/features/RamadhanWidgets';
import { Card } from '@/components/ui/card';
import { getDb } from '@/lib/data-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Heart, Gift } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatRupiah } from '@/lib/currency';

export default function RamadhanPage() {
  const db = getDb();
  const zakatTotal = db.zakat.reduce((s,z)=>s+(z.nominal??0),0);
  const dstTotal = db.penyaluranZakat.reduce((s,p)=>s+p.nominal,0);
  const targetBuka = { target: 300, danaTerkumpul: 180 };
  const hariKe = 12; // mock 12 Ramadhan 1447
  return (
    <div className="space-y-6">
      <PageHeader title="Ramadhan 1447 H" subtitle={`Hari ke-${hariKe} Ramadhan · Imsakiyah Surabaya`} />
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-3xl p-4 bg-gradient-to-br from-brand-50 to-amber-50 dark:from-amber-950/30 border-amber-200/40 text-center"><p className="text-2xl">🌙</p><p className="text-xl font-extrabold mt-1">{hariKe}</p><p className="text-[11px] text-muted-foreground">Hari Ramadhan</p></Card>
        <Card className="rounded-3xl p-4 text-center"><p className="text-[11px] text-muted-foreground">Zakat Terkumpul</p><p className="text-sm font-extrabold mt-1 tabular-nums">{formatRupiah(zakatTotal,true)}</p><Progress value={65} className="h-1.5 mt-2"/><p className="text-[10px] text-muted-foreground mt-1">65% dari target</p></Card>
        <Card className="rounded-3xl p-4 text-center"><p className="text-[11px] text-muted-foreground">Tersalurkan</p><p className="text-sm font-extrabold mt-1 tabular-nums text-success">{formatRupiah(dstTotal,true)}</p><p className="text-[10px] text-muted-foreground mt-1">{db.penyaluranZakat.length} mustahik</p></Card>
      </div>
      <Tabs defaultValue="imsak">
        <TabsList className="rounded-2xl w-full grid grid-cols-4"><TabsTrigger value="imsak" className="rounded-xl text-[11px]">Imsakiyah</TabsTrigger><TabsTrigger value="tarawih" className="rounded-xl text-[11px]">Tarawih</TabsTrigger><TabsTrigger value="buka" className="rounded-xl text-[11px]">Ifthar</TabsTrigger><TabsTrigger value="zakat" className="rounded-xl text-[11px]">Zakat</TabsTrigger></TabsList>
        <TabsContent value="imsak" className="mt-4"><ImsakiyahCard /></TabsContent>
        <TabsContent value="tarawih" className="mt-4"><JadwalTarawihCard /></TabsContent>
        <TabsContent value="buka" className="mt-4 space-y-3">
          <Card className="rounded-3xl p-5">
            <h3 className="font-bold text-sm mb-2">Donasi Ifthar (Buka Bersama)</h3>
            <div className="flex gap-4 text-center mb-3">{['1 Ramadhan: 50 porsi','5 Ramadhan: 60 porsi','10 Ramadhan: 75 porsi'].map(s=><div key={s} className="text-[11px] p-2 rounded-2xl bg-bg-subtle flex-1">{s}</div>)}</div>
            <div><div className="flex justify-between text-xs mb-1"><span>{targetBuka.danaTerkumpul} paket dari {targetBuka.target}</span><span className="font-bold">{Math.round(targetBuka.danaTerkumpul/targetBuka.target*100)}%</span></div><Progress value={targetBuka.danaTerkumpul/targetBuka.target*100} className="h-2"/></div>
          </Card>
        </TabsContent>
        <TabsContent value="zakat" className="mt-4 space-y-3">
          <Card className="rounded-3xl p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Gift className="w-4 h-4"/> Distribusi Zakat Fitrah Ramadhan</h3>
            <div className="space-y-2">{db.penyaluranZakat.map(p=><div key={p.id} className="flex justify-between text-xs p-2 rounded-xl bg-bg-subtle"><span>{p.penerimaNama} ({p.asnaf})</span><span className="font-bold tabular-nums">{formatRupiah(p.nominal,true)}</span></div>)}</div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}