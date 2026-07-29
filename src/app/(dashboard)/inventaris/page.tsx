'use client';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Modal from '@/components/shared/Modal';
import { getDb } from '@/lib/data-provider';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek } from '@/lib/date';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/shared/Toast';
import { Package, Wrench, AlertTriangle, Plus } from 'lucide-react';

export default function InventarisPage(){
  const db=getDb();const {toast}=useToast();const [show,setShow]=useState(false);
  const totalNilai=db.inventaris.reduce((s,i)=>s+(i.hargaBeli||0)*i.jumlah,0);
  const perluService=db.inventaris.filter(i=>i.jadwalMaintenance).length;
  const dipinjam=db.peminjaman.filter(p=>p.status==='DIPINJAM').length;
  const kondisiColor:Record<string,string>={BAIK:'bg-success/10 text-success',RUSAK_RINGAN:'bg-gold-soft text-gold',RUSAK_BERAT:'bg-destructive/10 text-destructive'};
  return (
    <div className="space-y-6">
      <PageHeader title="Inventaris & Aset" subtitle="Kelola aset masjid" action={{label:'Tambah Aset',onClick:()=>setShow(true)}}/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Total Nilai Aset</p><p className="text-xl font-extrabold tabular-nums mt-1">{formatRupiah(totalNilai,true)}</p></Card>
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Total Item</p><p className="text-xl font-extrabold mt-1">{db.inventaris.length}</p></Card>
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground flex items-center gap-1"><Wrench className="w-3 h-3"/>Perlu Maintenance</p><p className="text-xl font-extrabold mt-1">{perluService}</p></Card>
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Dipinjam</p><p className="text-xl font-extrabold mt-1">{dipinjam}</p></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {db.inventaris.map(inv=>(
          <Card key={inv.id} className="rounded-3xl p-4">
            <div className="flex justify-between"><p className="font-semibold text-sm">{inv.nama}</p><Badge className={`rounded-full text-[10px] border-0 ${kondisiColor[inv.kondisi]}`}>{inv.kondisi.replace(/_/g,' ')}</Badge></div>
            <p className="text-xs text-muted-foreground mt-1">{inv.kategori} · {inv.lokasi}</p>
            <p className="text-xs text-muted-foreground">Jumlah: {inv.jumlah} · {inv.hargaBeli? formatRupiah(inv.hargaBeli): '-'}</p>
            {inv.jadwalMaintenance && <div className="mt-2 flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-gold-soft text-gold w-fit"><AlertTriangle className="w-3 h-3"/>Maintenance: {formatTanggalPendek(inv.jadwalMaintenance)}</div>}
          </Card>
        ))}
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Peminjaman Aset</h3>
        {db.peminjaman.length===0? <EmptyState icon={Package} title="Belum ada peminjaman"/> : db.peminjaman.map(p=>{
          const inv=db.inventaris.find(i=>i.id===p.inventarisId);
          return <Card key={p.id} className="rounded-2xl p-3 flex justify-between text-sm"><div><p className="font-medium">{inv?.nama} — {p.peminjam}</p><p className="text-xs text-muted-foreground">Pinjam: {formatTanggalPendek(p.tanggalPinjam)}{p.tanggalKembali? ` · Kembali: ${formatTanggalPendek(p.tanggalKembali)}`: ''}</p></div><Badge className={`rounded-full text-[10px] ${p.status==='DIPINJAM'?'bg-gold-soft text-gold':'bg-success/10 text-success'}`}>{p.status}</Badge></Card>;
        })}
      </div>
      <Modal open={show} onClose={()=>setShow(false)} title="Tambah Aset">
        <form onSubmit={e=>{e.preventDefault();toast('success','Tersimpan! 🤲');setShow(false);}} className="space-y-3">
          <Input placeholder="Nama aset" className="rounded-2xl bg-bg-subtle border-0" required/>
          <div className="grid grid-cols-2 gap-2"><select className="px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm"><option>Perlengkapan</option><option>Elektronik</option><option>Furnitur</option></select><Input type="number" placeholder="Jumlah" className="rounded-2xl bg-bg-subtle border-0"/></div>
          <div className="grid grid-cols-2 gap-2"><select className="px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm"><option>BAIK</option><option>RUSAK_RINGAN</option><option>RUSAK_BERAT</option></select><Input type="number" placeholder="Harga beli" className="rounded-2xl bg-bg-subtle border-0"/></div>
          <Input placeholder="Lokasi" className="rounded-2xl bg-bg-subtle border-0"/><Input type="date" className="rounded-2xl bg-bg-subtle border-0" aria-label="Tanggal beli"/>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}