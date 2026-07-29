'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalLengkap } from '@/lib/date';
import { getDb } from '@/lib/data-provider';
import { useToast } from '@/components/shared/Toast';
import html2canvas from 'html2canvas';
import { Download, Share2 } from 'lucide-react';

interface PosterLaporanProps {
  weekly?: boolean;
}

export default function PosterLaporan({ weekly = true }: PosterLaporanProps) {
  const db = getDb();
  const { toast } = useToast();
  const pemasukan = db.transaksi.filter(t=>t.jenis==='MASUK').reduce((s,t)=>s+t.nominal,0);
  const pengeluaran = db.transaksi.filter(t=>t.jenis==='KELUAR').reduce((s,t)=>s+t.nominal,0);
  const saldo = pemasukan-pengeluaran;

  const downloadPng = async () => {
    const el = document.getElementById('poster-capture');
    if (!el) return;
    try {
      const canvas = await html2canvas(el as HTMLElement, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `laporan-${weekly?'minggu':'bulan'}-${formatTanggalLengkap(new Date()).replace(/ /g,'-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast('success','Poster berhasil didownload 📸');
    } catch {
      toast('error','Gagal generate poster. Coba lagi.');
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div id="poster-capture" className="w-full max-w-[360px] mx-auto bg-[#F8FFFE] rounded-[28px] border border-[#E2E8F0] p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-400" />
        <p className="text-xs text-muted-foreground mt-2">LAPORAN KAS {weekly?'MINGGUAN':'BULANAN'} 🕌</p>
        <p className="text-lg font-extrabold text-primary mt-1">{db.masjid.nama}</p>
        <p className="text-[11px] text-muted-foreground">{formatTanggalLengkap(new Date())} · {weekly?'Minggu Ke-3 Juli':'Juli 2026'}</p>
        <div className="my-4 rounded-2xl bg-white border p-4 space-y-2.5 text-left">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pemasukan</span><span className="font-bold text-emerald-600 tabular-nums">{formatRupiah(pemasukan)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pengeluaran</span><span className="font-bold text-red-500 tabular-nums">{formatRupiah(pengeluaran)}</span></div>
          <div className="h-px bg-border" />
          <div className="flex justify-between font-extrabold text-sm"><span>Saldo Kas</span><span className="tabular-nums">{formatRupiah(saldo)}</span></div>
          <div className="flex justify-between text-[11px] text-muted-foreground"><span>Transaksi</span><span>{db.transaksi.length} catatan</span></div>
        </div>
        <div className="flex justify-center gap-2 mb-1"><Badge variant="outline" className="rounded-full text-[9px]">Transparan</Badge><Badge variant="outline" className="rounded-full text-[9px]">Amanah</Badge><Badge variant="outline" className="rounded-full text-[9px]">Tertib</Badge></div>
        <p className="text-[10px] text-muted-foreground">Diselenggarakan oleh DKM {db.masjid.nama} • Barakallahu fiikum 🤲</p>
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={downloadPng} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-2 hover:bg-primary-hover active:scale-95 transition-all"><Download className="w-4 h-4"/> Download Poster 1080×1080</button>
        <button onClick={()=>{toast('info','Fitur share WhatsApp — segera hadir ✨');}} className="px-5 py-2.5 rounded-full bg-bg-subtle text-xs font-semibold flex items-center gap-2"><Share2 className="w-4 h-4"/> Share WA</button>
      </div>
    </div>
  );
}