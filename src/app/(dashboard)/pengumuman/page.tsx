'use client';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Modal from '@/components/shared/Modal';
import { getDb } from '@/lib/data-provider';
import { formatTanggalPendek } from '@/lib/date';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/shared/Toast';
import { Megaphone, Plus, Image as ImageIcon, Monitor } from 'lucide-react';

export default function PengumumanPage(){
  const db=getDb();const {toast}=useToast();const [priF,setPriF]=useState('ALL');const [show,setShow]=useState(false);
  const list=priF==='ALL'? db.pengumuman : db.pengumuman.filter(p=>p.prioritas===priF);
  const priColor:Record<string,string>={TINGGI:'bg-destructive/10 text-destructive border-destructive/20',SEDANG:'bg-gold-soft text-gold border-gold/20',RENDAH:'bg-muted text-muted-foreground border-border'};
  return (
    <div className="space-y-6">
      <PageHeader title="Pengumuman" subtitle="Kelola pengumuman masjid" action={{label:'Buat Pengumuman',onClick:()=>setShow(true)}}/>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {['ALL','TINGGI','SEDANG','RENDAH'].map(p=><button key={p} onClick={()=>setPriF(p)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ${priF===p?'bg-primary text-primary-foreground':'bg-bg-subtle'}`}>{p==='ALL'?'Semua':p}</button>)}
      </div>
      {list.length===0? <EmptyState icon={Megaphone} title="Belum ada pengumuman" description="Buat pengumuman pertama untuk jamaah" action={{label:'Buat Pengumuman',onClick:()=>setShow(true)}}/> : (
        <div className="space-y-3">
          {list.map(p=>(
            <Card key={p.id} className="rounded-3xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2"><Badge className={`rounded-full text-[10px] border ${priColor[p.prioritas]}`}>{p.prioritas}</Badge><Badge variant="outline" className="rounded-full text-[10px]">{p.kategori}</Badge>{p.tampilPublik && <Badge className="rounded-full text-[9px] bg-success/10 text-success border-0">Publik</Badge>}</div>
                <span className="text-[11px] text-muted-foreground">{formatTanggalPendek(p.tanggalTayang)}</span>
              </div>
              <h3 className="font-bold text-sm">{p.judul}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.isi}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-soft text-primary text-[11px] font-medium"><ImageIcon className="w-3 h-3"/>Generate Poster</button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-bg-subtle text-[11px] font-medium">Edit</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Card className="rounded-3xl p-4 bg-gold-soft/30 border-dashed">
        <p className="text-xs font-semibold flex items-center gap-2"><Monitor className="w-4 h-4"/>Mode Layar Masjid (TV)</p>
        <p className="text-[11px] text-muted-foreground mt-1">Tampilkan pengumuman sebagai running text di layar TV masjid. Buka /publik/layar untuk fullscreen.</p>
      </Card>
      <Modal open={show} onClose={()=>setShow(false)} title="Buat Pengumuman">
        <form onSubmit={e=>{e.preventDefault();toast('success','Tersimpan! 🤲');setShow(false);}} className="space-y-3">
          <Input placeholder="Judul pengumuman" className="rounded-2xl bg-bg-subtle border-0" required/>
          <Input placeholder="Kategori (mis: Kegiatan)" className="rounded-2xl bg-bg-subtle border-0"/>
          <textarea placeholder="Isi pengumuman..." className="w-full px-4 py-3 rounded-2xl bg-bg-subtle border-0 text-sm min-h-24"/>
          <div className="grid grid-cols-2 gap-2">
            <select className="px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm"><option>RENDAH</option><option>SEDANG</option><option>TINGGI</option></select>
            <Input type="date" className="rounded-2xl bg-bg-subtle border-0"/>
          </div>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked/> Tampilkan di halaman publik</label>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}