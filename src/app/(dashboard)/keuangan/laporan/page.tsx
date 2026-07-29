'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { getDb } from '@/lib/data-provider';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalLengkap } from '@/lib/date';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Printer, TrendingUp, TrendingDown, BarChart3, Image as ImageIcon, FileSpreadsheet, FileText, Share2 } from 'lucide-react';
import {
  CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { useToast } from '@/components/shared/Toast';
import PosterLaporan from '@/components/features/PosterLaporan';

export default function LaporanPage() {
  const db = getDb();
  const { toast } = useToast();
  const pemasukan = db.transaksi.filter(t => t.jenis === 'MASUK');
  const pengeluaran = db.transaksi.filter(t => t.jenis === 'KELUAR');
  const totalMasuk = pemasukan.reduce((s, t) => s + t.nominal, 0);
  const totalKeluar = pengeluaran.reduce((s, t) => s + t.nominal, 0);

  const byKategoriMasuk = db.kategoriTransaksi.filter(k => k.jenis === 'MASUK')
    .map(k => ({ name: k.nama, value: pemasukan.filter(t => t.kategoriId === k.id).reduce((s, t) => s + t.nominal, 0), warna: k.warna }))
    .filter(k => k.value > 0);
  const byKategoriKeluar = db.kategoriTransaksi.filter(k => k.jenis === 'KELUAR')
    .map(k => ({ name: k.nama, value: pengeluaran.filter(t => t.kategoriId === k.id).reduce((s, t) => s + t.nominal, 0), warna: k.warna }))
    .filter(k => k.value > 0);

  const monthly = db.getMonthlyCashFlow();

  const handleExportExcel = async () => {
    try {
      const { exportTransaksiToExcel } = await import('@/lib/export');
      await exportTransaksiToExcel(db.transaksi, `laporan-keuangan-${new Date().toISOString().slice(0,7)}.xlsx`);
      toast('success','Excel berhasil didownload 📊');
    } catch { toast('error','Gagal export Excel'); }
  };
  const handleExportPdf = async () => {
    try {
      const { exportPdfLaporanSummary } = await import('@/lib/export');
      await exportPdfLaporanSummary({ totalMasuk, totalKeluar, transaksi: db.transaksi, masjidNama: db.masjid.nama, periode: formatTanggalLengkap(new Date()) });
      toast('success','PDF berhasil didownload 📄');
    } catch { toast('error','Gagal export PDF'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Laporan Keuangan" subtitle="Transparansi untuk jamaah — detail kategori, tren bulanan, & poster Jumat" />

      <div className="flex flex-wrap gap-2">
        <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-subtle hover:bg-border text-xs font-semibold"><FileSpreadsheet className="w-4 h-4"/> Export Excel</button>
        <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-subtle hover:bg-border text-xs font-semibold"><FileText className="w-4 h-4"/> PDF Ringkas</button>
        <button onClick={()=>toast('info','Poster share WhatsApp segera ✨')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold"><Share2 className="w-4 h-4"/> Share Laporan</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-3xl p-6 border-0 bg-gradient-to-br from-primary/10 via-primary-soft to-primary/5">
          <p className="text-sm text-muted-foreground mb-1">Total Pemasukan</p>
          <p className="text-3xl font-extrabold tabular-nums text-primary">{formatRupiah(totalMasuk)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-success"><TrendingUp className="w-3 h-3" /> {pemasukan.length} transaksi masuk</div>
        </Card>
        <Card className="rounded-3xl p-6 border-0 bg-gradient-to-br from-destructive/10 via-destructive/5 to-destructive/5">
          <p className="text-sm text-muted-foreground mb-1">Total Pengeluaran</p>
          <p className="text-3xl font-extrabold tabular-nums text-destructive">{formatRupiah(totalKeluar)}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><TrendingDown className="w-3 h-3" /> {pengeluaran.length} transaksi keluar</div>
        </Card>
        <Card className="rounded-3xl p-6 border-0 bg-gradient-to-br from-accent/10 via-accent-soft to-accent/5">
          <p className="text-sm text-muted-foreground mb-1">Rasio</p>
          <p className="text-3xl font-extrabold tabular-nums text-accent">{totalMasuk>0? Math.round(totalKeluar/totalMasuk*100):0}%</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><BarChart3 className="w-3 h-3" /> Pengeluaran vs Pemasukan · Saldo {formatRupiah(totalMasuk-totalKeluar,true)}</div>
        </Card>
      </div>

      <Card className="rounded-3xl p-5">
        <h3 className="text-sm font-semibold mb-3">Tren Bulanan</h3>
        <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0"/><XAxis dataKey="name" tick={{fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/><RTooltip contentStyle={{borderRadius:16,border:'none',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} formatter={(v: unknown)=>[formatRupiah(Number(v as number)),''] as never} /><Bar dataKey="pemasukan" fill="#10B981" radius={[8,8,0,0]} maxBarSize={24} /><Bar dataKey="pengeluaran" fill="#FB7185" radius={[8,8,0,0]} maxBarSize={24} /></BarChart></ResponsiveContainer></div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-3xl p-5">
          <h3 className="text-sm font-semibold mb-4">Komposisi Pemasukan</h3>
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={byKategoriMasuk} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">{byKategoriMasuk.map((e,i)=><Cell key={i} fill={e.warna} />)}</Pie><RTooltip formatter={(v: unknown)=>[formatRupiah(Number(v as number)),''] as never} /></PieChart></ResponsiveContainer></div>
          <div className="space-y-1.5 mt-2">{byKategoriMasuk.map((item,i)=><div key={i} className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:item.warna}}/><span className="text-muted-foreground">{item.name}</span><span className="ml-auto font-semibold tabular-nums">{formatRupiah(item.value,true)}</span></div>)}</div>
        </Card>
        <Card className="rounded-3xl p-5">
          <h3 className="text-sm font-semibold mb-4">Komposisi Pengeluaran</h3>
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={byKategoriKeluar} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">{byKategoriKeluar.map((e,i)=><Cell key={i} fill={e.warna} />)}</Pie><RTooltip formatter={(v: unknown)=>[formatRupiah(Number(v as number)),''] as never} /></PieChart></ResponsiveContainer></div>
          <div className="space-y-1.5 mt-2">{byKategoriKeluar.map((item,i)=><div key={i} className="flex items-center gap-2 text-xs"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:item.warna}}/><span className="text-muted-foreground">{item.name}</span><span className="ml-auto font-semibold tabular-nums">{formatRupiah(item.value,true)}</span></div>)}</div>
        </Card>
      </div>

      <Tabs defaultValue="poster" className="w-full">
        <TabsList className="rounded-2xl"><TabsTrigger value="poster" className="rounded-xl text-xs">Poster Jumat 1080×1080</TabsTrigger><TabsTrigger value="pdf" className="rounded-xl text-xs">Preview PDF A4</TabsTrigger></TabsList>
        <TabsContent value="poster" className="mt-4">
          <Card className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200/30">
            <PosterLaporan weekly />
          </Card>
        </TabsContent>
        <TabsContent value="pdf" className="mt-4">
          <Card className="rounded-3xl p-6">
            <h4 className="text-sm font-bold mb-3">Preview Laporan A4</h4>
            <div className="rounded-2xl border bg-white text-black p-6 text-[11px] leading-relaxed max-w-[600px]">
              <div className="flex justify-between"><span className="font-bold text-base">{db.masjid.nama}</span><span>{formatTanggalLengkap(new Date())}</span></div>
              <div className="text-muted-foreground">{db.masjid.alamat} · {db.masjid.kelurahan}, {db.masjid.kota}</div>
              <hr className="my-3"/>
              <div className="space-y-1"><div className="flex justify-between"><span>Total Pemasukan</span><b>{formatRupiah(totalMasuk)}</b></div><div className="flex justify-between"><span>Total Pengeluaran</span><b>{formatRupiah(totalKeluar)}</b></div><div className="flex justify-between font-bold text-sm pt-2 border-t"><span>Saldo Kas</span><span>{formatRupiah(totalMasuk-totalKeluar)}</span></div></div>
              <div className="mt-4"><div className="font-semibold mb-1">Rincian 5 transaksi terakhir</div>{db.transaksi.slice(0,5).map(t=><div key={t.id} className="flex justify-between text-[10px]"><span>{t.tanggal} · {t.uraian.slice(0,36)}</span><span className="tabular-nums">{formatRupiah(t.nominal,true)}</span></div>)}</div>
              <div className="text-right mt-6 text-[10px] text-muted-foreground">Mengetahui, Bendahara · Laporan otomatis dari MasjidKU</div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}