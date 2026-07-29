'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import PageHeader from '@/components/shared/PageHeader';
import { getDb } from '@/lib/data-provider';
import EmptyState from '@/components/shared/EmptyState';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek } from '@/lib/date';

interface DonasiViewProps { publicOnly?: boolean }

export default function DonasiCampaignPage({ publicOnly }: DonasiViewProps) {
  const db = getDb();
  const [filter, setFilter] = useState<'ALL'|'AKTIF'|'SELESAI'>('ALL');
  const list = filter==='ALL'? db.campaigns : db.campaigns.filter(c=>c.status===filter);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">{(['ALL','AKTIF','SELESAI'] as const).map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-full text-xs font-semibold ${filter===f?'bg-primary text-primary-foreground':'bg-bg-subtle'}`}>{f==='ALL'?'Semua':f}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map(c=>{
          const pct = Math.min(100, Math.round(c.danaTerkumpul/c.targetDana*100));
          return (
            <Card key={c.id} className="rounded-3xl p-5 space-y-3">
              <h3 className="font-bold text-sm">{c.judul}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{c.deskripsi}</p>
              <div className="space-y-1"><div className="flex justify-between text-[11px]"><span>Terkumpul</span><span className="font-bold">{pct}%</span></div><div className="h-2 rounded-full bg-border overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-red-400 rounded-full" style={{width:`${pct}%`}}/></div><div className="flex justify-between text-[11px] tabular-nums"><span className="font-semibold">{formatRupiah(c.danaTerkumpul,true)}</span><span className="text-muted-foreground">{formatRupiah(c.targetDana,true)}</span></div></div>
              <div className="text-[11px] text-muted-foreground">{c.tanggalMulai} → {c.tanggalSelesai} · {db.donatur.filter(d=>d.campaignId===c.id).length} donatur</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}