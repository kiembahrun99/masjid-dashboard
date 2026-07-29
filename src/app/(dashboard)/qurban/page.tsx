'use client';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Modal from '@/components/shared/Modal';
import { getDb } from '@/lib/data-provider';
import { formatRupiah } from '@/lib/currency';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/shared/Toast';
import { Award, Check, Circle, CheckCircle } from 'lucide-react';
import type { Qurban, HewanQurban, JenisHewan, TipeQurban } from '@/types';

const J_LABEL: Record<JenisHewan,string> = { SAPI:'Sapi',KAMBING:'Kambing',DOMBA:'Domba' };
const J_EMO: Record<JenisHewan,string> = { SAPI:'🐄',KAMBING:'🐐',DOMBA:'🐑' };

export default function QurbanPage(){
  const db=getDb(); const {toast}=useToast();
  const [tahun,setTahun]=useState(1448);
  const [show,setShow]=useState(false);
  const [showH,setShowH]=useState(false);
  const [paket,setPaket]=useState(120);
  const [checks,setChecks]=useState<string[]>([]);
  const [hewanLs,setHewanLs]=useState<HewanQurban[]>([...db.hewanQurban]);
  const [qbLs,setQbLs]=useState<Qurban[]>([...db.qurban]);

  const hewan=hewanLs.filter(h=>h.tahun===tahun);
  const qb=qbLs.filter(q=>q.tahun===tahun);
  const totalSapi=hewan.filter(h=>h.jenis==='SAPI').length;
  const totalKambing=hewan.filter(h=>h.jenis!=='SAPI').length;
  const totalShohibul=qb.length;
  const totalNom=qb.reduce((s,q)=>s+q.nominal,0);
  const totalSlot=hewan.reduce((s,h)=>s+h.jumlahSlot,0);
  const terisiSlot=qb.length;
  const slotPct=totalSlot?Math.round(terisiSlot/totalSlot*100):0;

  const mustahik=db.jamaah.filter(j=>j.kategori.includes('MUSTAHIK')||j.kategori.includes('DHUAFA')||j.kategori.includes('YATIM')).slice(0,20);
  const pool=mustahik.length?mustahik:db.jamaah.slice(0,12);

  return (
    <div className="space-y-5">
      <PageHeader title="Qurban" subtitle={`Tahun ${tahun} H / 2026`} action={{label:'Tambah Shohibul',onClick:()=>setShow(true)}}/>
      <div className="flex gap-2">{[1447,1448].map(t=><button key={t} onClick={()=>setTahun(t)} className={`px-4 py-2 rounded-full text-xs font-bold ${tahun===t?'bg-primary text-primary-foreground':'bg-muted'}`}>{t} H</button>)}</div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Sapi</p><p className="text-2xl font-extrabold">{totalSapi} ekor</p></Card>
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Kambing/Domba</p><p className="text-2xl font-extrabold">{totalKambing} ekor</p></Card>
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Shohibul</p><p className="text-2xl font-extrabold">{totalShohibul} org</p><p className="text-[11px] text-muted-foreground">{totalSapi} sapi • {totalKambing} kambing</p></Card>
        <Card className="rounded-3xl p-4 bg-primary/5 border-primary/10"><p className="text-xs text-muted-foreground">Terkumpul</p><p className="text-lg font-extrabold tabular-nums text-primary">{formatRupiah(totalNom,true)}</p></Card>
        <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Slot Patungan</p><p className="text-xl font-extrabold">{terisiSlot}/{totalSlot||0}</p><Progress value={slotPct} className="h-2 mt-2"/><p className="text-[11px] text-muted-foreground mt-1">{slotPct}% terisi</p></Card>
      </div>

      <Tabs defaultValue="hewan">
        <TabsList className="rounded-2xl w-full grid grid-cols-3 h-auto p-1"><TabsTrigger value="hewan" className="rounded-xl text-xs py-2.5">Hewan</TabsTrigger><TabsTrigger value="shohibul" className="rounded-xl text-xs py-2.5">Shohibul</TabsTrigger><TabsTrigger value="bagi" className="rounded-xl text-xs py-2.5">Pembagian</TabsTrigger></TabsList>

        <TabsContent value="hewan" className="mt-4 space-y-3">
          <div className="flex justify-between items-center"><p className="text-xs text-muted-foreground">{hewan.length} hewan • {tahun} H</p><button onClick={()=>setShowH(true)} className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">+ Hewan</button></div>
          {hewan.length===0 ? <EmptyState title="Belum ada hewan"/> :
            <div className="grid md:grid-cols-2 gap-3">
              {hewan.map(h=>{
                const isi=qb.filter(q=>q.hewanId===h.id).length;
                return (
                  <Card key={h.id} className="rounded-3xl p-4 space-y-3">
                    <div className="flex justify-between items-start"><Badge className="rounded-full text-[10px] bg-muted text-foreground border-0">{J_EMO[h.jenis]} {J_LABEL[h.jenis]} • {h.berat}kg</Badge><span className="text-xs font-bold">{formatRupiah(h.hargaBeli,true)}</span></div>
                    <p className="text-xs text-muted-foreground">{h.penjual} • {h.jumlahSlot} slot {h.jumlahSlot>1?'(patungan)':'(individu)'}</p>
                    <div><div className="flex justify-between text-[11px] mb-1"><span>Slot {isi}/{h.jumlahSlot}</span><span>{h.jumlahSlot?Math.round(isi/h.jumlahSlot*100):0}%</span></div><Progress value={h.jumlahSlot?isi/h.jumlahSlot*100:0} className="h-2"/><div className="flex gap-1 mt-2">{Array.from({length:h.jumlahSlot}).map((_,i)=><div key={i} className={`h-5 flex-1 rounded-full flex items-center justify-center text-[10px] font-bold ${i<isi?'bg-emerald-500 text-white':'bg-muted text-muted-foreground'}`}>{i<isi?'✓':i+1}</div>)}</div></div>
                  </Card>
                );
              })}
            </div>
          }
        </TabsContent>

        <TabsContent value="shohibul" className="mt-4 space-y-2">
          {qb.length===0 ? <EmptyState title="Belum ada shohibul"/> : qb.map(q=>(
            <Card key={q.id} className="rounded-3xl p-4 flex justify-between items-center gap-3">
              <div className="min-w-0"><p className="font-semibold text-sm truncate">{q.shohibulNama}</p><div className="flex gap-1 mt-1 flex-wrap"><Badge variant="outline" className="rounded-full text-[10px]">{J_LABEL[q.jenisHewan]}</Badge><Badge variant="outline" className="rounded-full text-[10px]">{q.tipeQurban}{q.slotKe?` #${q.slotKe}`:''}</Badge><Badge className={`rounded-full text-[10px] border-0 ${q.lunas?'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30':'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>{q.lunas?'Lunas':'Belum'}</Badge></div><p className="text-xs text-muted-foreground mt-1">{formatRupiah(q.nominal)} • {q.hewanId.toUpperCase()}</p></div>
              <div className="flex gap-1 shrink-0"><button onClick={()=>toast('success',`Sertifikat ${q.shohibulNama} PDF mock`)} className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100"><Award className="w-4 h-4 text-amber-600"/></button></div>
            </Card>
          ))}
          {qb.length>0 && <Card className="rounded-3xl p-4"><h4 className="text-sm font-bold mb-2">Sertifikat Digital</h4><div className="grid sm:grid-cols-2 gap-2">{qb.map(q=><div key={q.id} className="flex justify-between items-center p-2.5 rounded-2xl bg-muted"><span className="text-xs font-medium truncate">{J_EMO[q.jenisHewan]} {q.shohibulNama}</span><button onClick={()=>toast('success',`Sertifikat ${q.shohibulNama} diunduh`)} className="text-[11px] px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold">PDF</button></div>)}</div></Card>}
        </TabsContent>

        <TabsContent value="bagi" className="mt-4 space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Card className="rounded-3xl p-4 space-y-3">
              <p className="font-semibold text-sm">Paket Daging</p>
              <div><label className="text-[11px] text-muted-foreground">Jumlah paket</label><Input type="number" value={paket} onChange={e=>setPaket(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0 font-bold"/></div>
              <div className="rounded-2xl bg-muted p-3 text-xs space-y-1"><div className="flex justify-between"><span>Est. daging</span><span className="font-bold">{hewan.reduce((s,h)=>s+h.berat*0.35,0).toFixed(0)}kg</span></div><div className="flex justify-between"><span>Dipilih</span><span className="font-bold text-emerald-600">{checks.length}</span></div><Progress value={paket?Math.round(checks.length/paket*100):0} className="h-2 mt-2"/><p className="text-[11px] text-muted-foreground">{paket?Math.round(checks.length/paket*100):0}%</p></div>
              <div className="flex gap-2"><button onClick={()=>{toast('success',`${checks.length} paket didistribusi`);}} disabled={checks.length===0} className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40">Distribusikan</button><button onClick={()=>setChecks([])} className="px-4 py-2.5 rounded-full bg-muted text-xs">Reset</button></div>
            </Card>
            <Card className="rounded-3xl p-4 md:col-span-2">
              <div className="flex justify-between items-center mb-3"><p className="font-semibold text-sm">Penerima • {checks.length}/{pool.length}</p><button onClick={()=>setChecks(checks.length===pool.length?[]:pool.map(p=>p.id))} className="text-xs text-primary font-semibold">{checks.length===pool.length?'Batal':'Pilih semua'}</button></div>
              <div className="grid sm:grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
                {pool.map(p=>{
                  const on=checks.includes(p.id);
                  return <button key={p.id} onClick={()=>setChecks(s=>on?s.filter(i=>i!==p.id):[...s,p.id])} className={`text-left p-3 rounded-2xl border-2 flex gap-2.5 items-center ${on?'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700':'bg-card border-border/50'}`}><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${on?'bg-emerald-500 border-emerald-500 text-white':'border-muted-foreground/30'}`}>{on?<Check className="w-3.5 h-3.5"/>:<Circle className="w-3 h-3 opacity-0"/>}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold truncate">{p.nama}</p><p className="text-[11px] text-muted-foreground truncate">{p.alamat}</p></div></button>;
                })}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Modal open={show} onClose={()=>setShow(false)} title="Tambah Shohibul Qurban">
        <form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget as HTMLFormElement);const nm=String(f.get('nama')||'');if(!nm) return;const jenis=String(f.get('jenis')||'SAPI') as JenisHewan;const tipe=String(f.get('tipe')||'PATUNGAN') as TipeQurban;const hid=String(f.get('hewanId')||hewan[0]?.id||'');const slot=Number(f.get('slot')||1);const nom=Number(f.get('nominal')||0);const lunas=String(f.get('lunas')||'on')==='on';const q:Qurban={id:`qb-${Date.now()}`,tahun,shohibulNama:nm,jenisHewan:jenis,tipeQurban:tipe,hewanId:hid,slotKe:tipe==='PATUNGAN'?slot:undefined,nominal:nom,lunas};setQbLs(s=>[q,...s]);setShow(false);}} className="space-y-3">
          <Input name="nama" placeholder="Nama shohibul" required className="rounded-2xl bg-muted border-0"/>
          <div className="grid grid-cols-2 gap-2"><select name="jenis" defaultValue="SAPI" className="px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm"><option>SAPI</option><option>KAMBING</option><option>DOMBA</option></select><select name="tipe" defaultValue="PATUNGAN" className="px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm"><option>INDIVIDU</option><option>PATUNGAN</option></select></div>
          <div className="grid grid-cols-2 gap-2"><select name="hewanId" defaultValue={hewan[0]?.id} className="px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm">{hewan.map(h=><option key={h.id} value={h.id}>{h.jenis} {h.berat}kg • {h.penjual}</option>)}</select><Input name="slot" type="number" placeholder="Slot 1-7" className="rounded-2xl bg-muted border-0"/></div>
          <Input name="nominal" type="number" placeholder="Nominal Rp" className="rounded-2xl bg-muted border-0 font-bold"/><label className="flex items-center gap-2 text-xs"><input name="lunas" type="checkbox" defaultChecked/> Lunas</label>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold">Simpan</button>
        </form>
      </Modal>

      <Modal open={showH} onClose={()=>setShowH(false)} title="Tambah Hewan">
        <form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget as HTMLFormElement);const jenis=String(f.get('jenis')||'SAPI') as JenisHewan;const berat=Number(f.get('berat')||0);const harga=Number(f.get('harga')||0);const penjual=String(f.get('penjual')||'Peternakan');const slot=Number(f.get('slot')||7);const h:HewanQurban={id:`hq-${Date.now()}`,tahun,jenis,berat,hargaBeli:harga,penjual,jumlahSlot:slot};setHewanLs(s=>[h,...s]);setShowH(false);}} className="space-y-3">
          <div className="flex gap-1.5">{(['SAPI','KAMBING','DOMBA'] as JenisHewan[]).map(j=><label key={j} className="has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary px-3 py-2 rounded-2xl bg-muted border border-transparent text-xs font-bold cursor-pointer"><input type="radio" name="jenis" value={j} defaultChecked={j==='SAPI'} className="sr-only"/>{J_EMO[j]} {j}</label>)}</div>
          <div className="grid grid-cols-2 gap-2"><Input name="berat" type="number" placeholder="Berat kg" required className="rounded-2xl bg-muted border-0"/><Input name="slot" type="number" placeholder="Slot" defaultValue={7} className="rounded-2xl bg-muted border-0"/></div>
          <Input name="harga" type="number" placeholder="Harga beli Rp" required className="rounded-2xl bg-muted border-0 font-bold"/><Input name="penjual" placeholder="Penjual" className="rounded-2xl bg-muted border-0"/>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold">Simpan Hewan</button>
        </form>
      </Modal>
    </div>
  );
}
