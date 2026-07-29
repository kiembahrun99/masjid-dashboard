'use client';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Modal from '@/components/shared/Modal';
import { getDb } from '@/lib/data-provider';
import { formatTanggalPendek } from '@/lib/date';
import { formatRupiah } from '@/lib/currency';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/shared/Toast';
import { Users, Search, Plus, Download, Upload } from 'lucide-react';

export default function JamaahPage(){
  const db=getDb();const {toast}=useToast();
  const [q,setQ]=useState('');const [statusF,setStatusF]=useState('ALL');const [katF,setKatF]=useState('ALL');const [show,setShow]=useState(false);
  const filtered=useMemo(()=>{
    let d=[...db.jamaah];
    if(statusF!=='ALL') d=d.filter(j=>j.status===statusF);
    if(katF!=='ALL') d=d.filter(j=>j.kategori.includes(katF as never));
    if(q) d=d.filter(j=>j.nama.toLowerCase().includes(q.toLowerCase())||j.alamat.toLowerCase().includes(q.toLowerCase()));
    return d;
  },[q,statusF,katF]);
  const total=db.jamaah.length;const tetap=db.jamaah.filter(j=>j.status==='JAMAAH_TETAP').length;
  const muallaf=db.jamaah.filter(j=>j.kategori.includes('MUALLAF')).length;
  const mustahik=db.jamaah.filter(j=>j.kategori.includes('MUSTAHIK')).length;
  return (
    <div className="space-y-6">
      <PageHeader title="Data Jamaah" subtitle={`${total} jamaah terdaftar`} action={{label:'Tambah Jamaah',onClick:()=>setShow(true)}}/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[['Total Jamaah',total,'bg-primary-soft text-primary'],['Tetap',tetap,'bg-success/10 text-success'],['Muallaf',muallaf,'bg-accent-soft text-accent'],['Mustahik',mustahik,'bg-gold-soft text-gold']].map(([label,val,cls])=>(
          <Card key={label as string} className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">{label as string}</p><p className="text-2xl font-extrabold mt-1">{val as number}</p><span className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block ${cls as string}`}>{label as string}</span></Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/><Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama/alamat..." className="pl-10 rounded-2xl bg-bg-subtle border-0"/></div>
        <select value={statusF} onChange={e=>setStatusF(e.target.value)} className="px-3 py-2 rounded-2xl bg-bg-subtle border-0 text-xs font-medium"><option value="ALL">Semua Status</option><option value="JAMAAH_TETAP">Tetap</option><option value="MUSAFIR">Musafir</option><option value="SIMPATISAN">Simpatisan</option></select>
        <select value={katF} onChange={e=>setKatF(e.target.value)} className="px-3 py-2 rounded-2xl bg-bg-subtle border-0 text-xs font-medium"><option value="ALL">Semua Kategori</option><option value="MUALLAF">Muallaf</option><option value="LANSIA">Lansia</option><option value="YATIM">Yatim</option><option value="DHUAFA">Dhuafa</option><option value="MUSTAHIK">Mustahik</option><option value="MUZAKKI">Muzakki</option></select>
        <button className="px-3 py-2 rounded-2xl bg-bg-subtle text-xs font-medium flex items-center gap-1"><Upload className="w-3 h-3"/>Import CSV</button>
        <button className="px-3 py-2 rounded-2xl bg-bg-subtle text-xs font-medium flex items-center gap-1"><Download className="w-3 h-3"/>Export</button>
      </div>
      {filtered.length===0? <EmptyState icon={Users} title="Belum ada jamaah" description="Tambahkan data jamaah pertama ✨" action={{label:'Tambah Jamaah',onClick:()=>setShow(true)}}/> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(j=>(
            <Card key={j.id} className="rounded-3xl p-4">
              <div className="flex justify-between"><p className="font-semibold text-sm">{j.nama}</p><Badge variant="outline" className="rounded-full text-[10px]">{j.jenisKelamin}</Badge></div>
              <p className="text-xs text-muted-foreground mt-1">{j.alamat} RT {j.rt}/RW {j.rw}</p>
              <p className="text-xs text-muted-foreground">{j.noHp}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge className="rounded-full text-[9px] bg-primary-soft text-primary border-0">{j.status.replace(/_/g,' ')}</Badge>
                {j.kategori.map(k=><Badge key={k} className="rounded-full text-[9px] bg-gold-soft text-gold border-0">{k}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={show} onClose={()=>setShow(false)} title="Tambah Jamaah">
        <form onSubmit={e=>{e.preventDefault();toast('success','Tersimpan! Barakallahu fiik 🤲');setShow(false);}} className="space-y-3">
          <Input placeholder="Nama lengkap" className="rounded-2xl bg-bg-subtle border-0" required/>
          <Input placeholder="Alamat" className="rounded-2xl bg-bg-subtle border-0"/>
          <div className="grid grid-cols-3 gap-2"><Input placeholder="RT" className="rounded-2xl bg-bg-subtle border-0"/><Input placeholder="RW" className="rounded-2xl bg-bg-subtle border-0"/><Input placeholder="No HP" className="rounded-2xl bg-bg-subtle border-0"/></div>
          <div className="grid grid-cols-2 gap-2">
            <select className="px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm"><option>L</option><option>P</option></select>
            <select className="px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm"><option>JAMAAH_TETAP</option><option>MUSAFIR</option><option>SIMPATISAN</option></select>
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}