'use client';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { getDb } from '@/lib/data-provider';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek } from '@/lib/date';
import { Card } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

export default function BukuKasPage() {
  const db = getDb();
  const { toast } = useToast();
  const [range, setRange] = useState<'ALL'|'7H'|'30H'>('ALL');

  const { sorted, withSaldo, totalMasuk, totalKeluar } = useMemo(() => {
    const now = new Date();
    let data = [...db.transaksi].sort((a,b)=>new Date(a.tanggal).getTime()-new Date(b.tanggal).getTime());
    if (range==='7H') { const d=new Date(now); d.setDate(d.getDate()-7); data=data.filter(t=>new Date(t.tanggal)>=d); }
    if (range==='30H') { const d=new Date(now); d.setDate(d.getDate()-30); data=data.filter(t=>new Date(t.tanggal)>=d); }
    const masuk = data.filter(t=>t.jenis==='MASUK').reduce((s,t)=>s+t.nominal,0);
    const keluar = data.filter(t=>t.jenis==='KELUAR').reduce((s,t)=>s+t.nominal,0);
    type Row = typeof data[number] & { saldo:number };
    const rows: Row[] = [];
    let bal=0;
    for (const t of data) {
      bal = t.jenis==='MASUK' ? bal+t.nominal : bal-t.nominal;
      rows.push({ ...(t as typeof data[number]), saldo: bal });
    }
    return { sorted: data, withSaldo: rows, totalMasuk: masuk, totalKeluar: keluar };
  }, [db.transaksi, range]);

  const getKategori = (id:string)=>db.kategoriTransaksi.find(k=>k.id===id);

  const handleExportExcel = async () => {
    try {
      const { exportTransaksiToExcel } = await import('@/lib/export');
      await exportTransaksiToExcel(sorted, `buku-kas-${range}-${new Date().toISOString().slice(0,10)}.xlsx`);
      toast('success','Excel buku kas terdownload 📊');
    } catch(e){ toast('error','Gagal export'); console.error(e); }
  };
  const handleExportPdf = async () => {
    try {
      const { exportPdfLaporanSummary } = await import('@/lib/export');
      await exportPdfLaporanSummary({ totalMasuk, totalKeluar, transaksi: sorted, masjidNama: db.masjid.nama, periode: `Buku Kas ${range}` });
      toast('success','PDF terdownload 📄');
    } catch { toast('error','Gagal export PDF'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Buku Kas" subtitle="Digital & saldo berjalan real-time" />
      <div className="flex gap-2">
        {(['ALL','7H','30H'] as const).map(r=><button key={r} onClick={()=>setRange(r)} className={`px-4 py-2 rounded-full text-xs font-semibold ${range===r?'bg-primary text-primary-foreground':'bg-bg-subtle'}`}>{r==='ALL'?'Semua':r==='7H'?'7 Hari':'30 Hari'}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="rounded-3xl p-4 border-0 bg-gradient-to-br from-primary/10 to-primary/5"><p className="text-xs text-muted-foreground">Total Masuk</p><p className="text-xl font-extrabold tabular-nums text-primary">{formatRupiah(totalMasuk,true)}</p></Card>
        <Card className="rounded-3xl p-4 border-0 bg-gradient-to-br from-destructive/10 to-destructive/5"><p className="text-xs text-muted-foreground">Total Keluar</p><p className="text-xl font-extrabold tabular-nums text-destructive">{formatRupiah(totalKeluar,true)}</p></Card>
        <Card className="rounded-3xl p-4 border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5"><p className="text-xs text-muted-foreground">Saldo Akhir</p><p className="text-xl font-extrabold tabular-nums">{formatRupiah(totalMasuk-totalKeluar,true)}</p></Card>
      </div>
      <div className="flex gap-2">
        <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-border text-sm font-medium"><Download className="w-4 h-4"/> Excel</button>
        <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-border text-sm font-medium"><Printer className="w-4 h-4"/> PDF</button>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-border">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted border-b border-border"><th className="text-left px-4 py-3 text-xs text-muted-foreground">Tanggal</th><th className="text-left px-4 py-3 text-xs text-muted-foreground">Uraian</th><th className="text-right px-4 py-3 text-xs text-muted-foreground">Debit</th><th className="text-right px-4 py-3 text-xs text-muted-foreground">Kredit</th><th className="text-right px-4 py-3 text-xs text-muted-foreground">Saldo</th></tr></thead>
          <tbody>{withSaldo.length===0? <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Kosong</td></tr> : withSaldo.map((t,i)=><tr key={t.id} className={`border-b border-border/50 ${i%2===0?'bg-card':'bg-muted/20'}`}><td className="px-4 py-3 text-xs text-muted-foreground">{formatTanggalPendek(t.tanggal)}</td><td className="px-4 py-3"><p className="font-medium">{t.uraian}</p><p className="text-xs text-muted-foreground">{getKategori(t.kategoriId)?.nama} · {t.metodeBayar}</p></td><td className="px-4 py-3 text-right tabular-nums font-semibold text-emerald-600">{t.jenis==='MASUK'?formatRupiah(t.nominal,true):'-'}</td><td className="px-4 py-3 text-right tabular-nums font-semibold text-red-600">{t.jenis==='KELUAR'?formatRupiah(t.nominal,true):'-'}</td><td className="px-4 py-3 text-right tabular-nums font-semibold">{formatRupiah(t.saldo,true)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
