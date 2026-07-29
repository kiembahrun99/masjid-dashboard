'use client';
import PageHeader from '@/components/shared/PageHeader';
import { getDb } from '@/lib/data-provider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatRupiah } from '@/lib/currency';
import { useState } from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function AnggaranPage() {
  const db = getDb();
  const [year] = useState(2026);
  const monthName = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const budgets = db.anggaran.filter(a=>a.tahun===year);
  const getRealisasi = (kategoriId: string) => db.transaksi.filter(t=>t.kategoriId===kategoriId && t.jenis==='KELUAR').reduce((s,t)=>s+t.nominal,0);
  return (
    <div className="space-y-6">
      <PageHeader title="Anggaran" subtitle={`Rencana vs Realisasi ${year}`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(b=>{
          const kat = db.kategoriTransaksi.find(k=>k.id===b.kategoriId);
          const real = getRealisasi(b.kategoriId);
          const pct = b.targetNominal ? Math.min(120, Math.round(real/b.targetNominal*100)) : 0;
          const over80 = pct>80;
          return (
            <Card key={b.id} className={`rounded-3xl p-5 ${over80?'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20':''}`}>
              <div className="flex justify-between items-start"><div><div className="text-sm font-semibold flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:kat?.warna}}/> {kat?.nama}</div><div className="text-[11px] text-muted-foreground">{monthName[b.bulan-1]} {b.tahun}</div></div>{over80 && <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700"><AlertTriangle className="w-3 h-3"/>{pct}%</span>}</div>
              <div className="mt-3"><Progress value={Math.min(100,pct)} className="h-2" /></div>
              <div className="flex justify-between mt-2 text-xs tabular-nums"><span className="text-muted-foreground">Realisasi: {formatRupiah(real,true)} / {formatRupiah(b.targetNominal,true)}</span><span className={`font-bold ${pct>100?'text-destructive':'text-primary'}`}>{pct}%</span></div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}