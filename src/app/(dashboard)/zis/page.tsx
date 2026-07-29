'use client';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import Modal from '@/components/shared/Modal';
import { getDb } from '@/lib/data-provider';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek } from '@/lib/date';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/shared/Toast';
import { Heart, Calculator, Receipt } from 'lucide-react';
import type { Zakat, JenisZakat } from '@/types';

const ASNAF = ['FAKIR','MISKIN','AMIL','MUALLAF','RIQAB','GHARIM','FISABILILLAH','IBNU_SABIL'] as const;
const ASNAF_L: Record<string,string> = { FAKIR:'Fakir',MISKIN:'Miskin',AMIL:'Amil',MUALLAF:'Muallaf',RIQAB:'Riqab',GHARIM:'Gharim',FISABILILLAH:'Fi Sabilillah',IBNU_SABIL:'Ibnu Sabil' };
const JENIS: JenisZakat[] = ['FITRAH','MAAL','PENGHASILAN','PERDAGANGAN'];

export default function ZisPage(){
  const db=getDb(); const {toast}=useToast();
  const [show,setShow]=useState(false);
  const [list,setList]=useState<Zakat[]>([...db.zakat]);
  const [filter,setFilter]=useState<'ALL'|JenisZakat>('ALL');
  const [calc,setCalc]=useState<'FITRAH'|'MAAL'|'PENGHASILAN'|'DAGANG'>('FITRAH');

  const [jiwa,setJiwa]=useState(4); const [hrgBeras,setHrgBeras]=useState(15000);
  const [harta,setHarta]=useState(200000000); const [hutang,setHutang]=useState(0);
  const [gaji,setGaji]=useState(10000000); const [kKeluar,setKKeluar]=useState(6000000);
  const [modal,setModal]=useState(100000000); const [untung,setUntung]=useState(20000000);
  const [piutang,setPiutang]=useState(10000000); const [htDagang,setHtDagang]=useState(5000000);

  // calc derived
  const fitrahKg=jiwa*3.5; const fitrahRp=fitrahKg*hrgBeras;
  const maalBersih=Math.max(0,harta-hutang); const maalWjb=maalBersih>=100000000; const maalZ=maalWjb?Math.round(maalBersih*0.025):0;
  const sisaGaji=Math.max(0,gaji-kKeluar); const gajiZ=Math.round(sisaGaji*0.025);
  const dagangBersih=Math.max(0,modal+untung+piutang-htDagang); const dagangZ=Math.round(dagangBersih*0.025);

  const totalTerima=list.reduce((s,z)=>s+(z.nominal||0),0);
  const totalSalur=db.penyaluranZakat.reduce((s,p)=>s+p.nominal,0);
  const byAsnaf=ASNAF.map(a=>({a,label:ASNAF_L[a],tot:db.penyaluranZakat.filter(p=>p.asnaf===a).reduce((s,p)=>s+p.nominal,0),cnt:db.penyaluranZakat.filter(p=>p.asnaf===a).length}));
  const filtered=filter==='ALL'?list:list.filter(z=>z.jenis===filter);

  return (
    <div className="space-y-5">
      <PageHeader title="Zakat, Infaq, Sedekah" subtitle="Kelola ZIS & kalkulator zakat" action={{label:'Catat Zakat',onClick:()=>setShow(true)}}/>
      <Card className="rounded-3xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/30">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-sm font-bold">🌙 Mode Ramadhan — Input Massal</p><p className="text-[11px] text-muted-foreground mt-0.5">Hitung & input zakat fitrah per keluarga lebih cepat.</p></div>
          <button onClick={()=>{setCalc('FITRAH');setShow(true)}} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Input Massal</button>
        </div>
      </Card>

      <Tabs defaultValue="kalkulator">
        <TabsList className="rounded-2xl w-full grid grid-cols-4 h-auto p-1">
          <TabsTrigger value="kalkulator" className="rounded-xl text-[11px] py-2.5"><Calculator className="w-3.5 h-3.5 mr-1"/>Kalkulator</TabsTrigger>
          <TabsTrigger value="penerimaan" className="rounded-xl text-[11px] py-2.5">Terima</TabsTrigger>
          <TabsTrigger value="penyaluran" className="rounded-xl text-[11px] py-2.5">Salur</TabsTrigger>
          <TabsTrigger value="laporan" className="rounded-xl text-[11px] py-2.5"><Receipt className="w-3.5 h-3.5 mr-1"/>Laporan</TabsTrigger>
        </TabsList>

        <TabsContent value="kalkulator" className="space-y-4 mt-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(['FITRAH','MAAL','PENGHASILAN','DAGANG'] as const).map(t=>(
              <button key={t} onClick={()=>setCalc(t)} className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${calc===t?'bg-primary text-primary-foreground':'bg-muted hover:bg-muted/80'}`}>{t}</button>
            ))}
          </div>

          {calc==='FITRAH' && (
            <Card className="rounded-3xl p-5 space-y-3">
              <h3 className="font-bold text-sm">Zakat Fitrah • 3.5kg × jiwa × harga beras</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] text-muted-foreground">Jiwa</label><Input type="number" value={jiwa} onChange={e=>setJiwa(Math.max(1,Number(e.target.value)||1))} className="mt-1 rounded-2xl bg-muted border-0"/></div>
                <div><label className="text-[11px] text-muted-foreground">Harga beras/kg</label><Input type="number" value={hrgBeras} onChange={e=>setHrgBeras(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0"/></div>
              </div>
              <Result nominal={fitrahRp} detail={`${jiwa} jiwa × 3.5kg = ${fitrahKg}kg • ${formatRupiah(fitrahRp)}`} onUse={()=>{setFilter('FITRAH');toast('info',`Fitrah ${formatRupiah(fitrahRp)} siap diinput`);}}/>
            </Card>
          )}
          {calc==='MAAL' && (
            <Card className="rounded-3xl p-5 space-y-3">
              <h3 className="font-bold text-sm">Zakat Maal • nishab 85gr emas ~ Rp 100jt • 2.5%</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] text-muted-foreground">Harta</label><Input type="number" value={harta} onChange={e=>setHarta(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0"/></div>
                <div><label className="text-[11px] text-muted-foreground">Hutang</label><Input type="number" value={hutang} onChange={e=>setHutang(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0"/></div>
              </div>
              <Result nominal={maalZ} detail={`Bersih ${formatRupiah(maalBersih)} • ${maalWjb?'Wajib zakat 2.5%':'Belum nishab'}`} onUse={()=>toast('info',`Maal ${formatRupiah(maalZ)} siap diinput`)}/>
            </Card>
          )}
          {calc==='PENGHASILAN' && (
            <Card className="rounded-3xl p-5 space-y-3">
              <h3 className="font-bold text-sm">Zakat Penghasilan • (gaji - pengeluaran) × 2.5%</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[11px] text-muted-foreground">Gaji/bulan</label><Input type="number" value={gaji} onChange={e=>setGaji(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0"/></div>
                <div><label className="text-[11px] text-muted-foreground">Pengeluaran</label><Input type="number" value={kKeluar} onChange={e=>setKKeluar(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0"/></div>
              </div>
              <Result nominal={gajiZ} detail={`Sisa ${formatRupiah(sisaGaji)} × 2.5%`} onUse={()=>toast('info',`Penghasilan ${formatRupiah(gajiZ)}/bln`)}/>
            </Card>
          )}
          {calc==='DAGANG' && (
            <Card className="rounded-3xl p-5 space-y-3">
              <h3 className="font-bold text-sm">Zakat Perdagangan • (modal+untung+piutang-hutang) × 2.5%</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[11px] text-muted-foreground">Modal</label><Input type="number" value={modal} onChange={e=>setModal(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0 text-sm"/></div>
                <div><label className="text-[11px] text-muted-foreground">Untung</label><Input type="number" value={untung} onChange={e=>setUntung(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0 text-sm"/></div>
                <div><label className="text-[11px] text-muted-foreground">Piutang</label><Input type="number" value={piutang} onChange={e=>setPiutang(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0 text-sm"/></div>
                <div><label className="text-[11px] text-muted-foreground">Hutang dagang</label><Input type="number" value={htDagang} onChange={e=>setHtDagang(Number(e.target.value)||0)} className="mt-1 rounded-2xl bg-muted border-0 text-sm"/></div>
              </div>
              <Result nominal={dagangZ} detail={`Total dagang ${formatRupiah(dagangBersih)} × 2.5%`} onUse={()=>toast('info',`Dagang ${formatRupiah(dagangZ)}`)}/>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="penerimaan" className="space-y-3 mt-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button onClick={()=>setFilter('ALL')} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filter==='ALL'?'bg-primary text-primary-foreground':'bg-muted'}`}>Semua</button>
            {JENIS.map(j=><button key={j} onClick={()=>setFilter(j)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filter===j?'bg-primary text-primary-foreground':'bg-muted'}`}>{j}</button>)}
          </div>
          {filtered.length===0 ? <EmptyState icon={Heart} title="Belum ada penerimaan"/> : filtered.map(z=>(
            <Card key={z.id} className="rounded-3xl p-4 flex justify-between items-center gap-3">
              <div className="min-w-0"><p className="font-semibold text-sm truncate">{z.muzakkiNama}</p><p className="text-[11px] text-muted-foreground"><Badge variant="outline" className="rounded-full text-[10px] mr-1">{z.jenis}</Badge>{formatTanggalPendek(z.tanggal)} {z.jumlahJiwa?`• ${z.jumlahJiwa} jiwa`:''}</p></div>
              <div className="text-right shrink-0"><p className="font-bold text-sm tabular-nums">{z.nominal?formatRupiah(z.nominal):`${z.beratBeras}kg`}</p><button onClick={()=>toast('success',`Kwitansi ${z.muzakkiNama} PDF mock`)} className="text-[11px] text-primary font-medium mt-0.5">Kwitansi</button></div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="penyaluran" className="space-y-3 mt-4">
          <Card className="rounded-3xl p-4"><p className="text-xs text-muted-foreground">Total Tersalur</p><p className="text-xl font-extrabold">{formatRupiah(totalSalur)}</p></Card>
          {byAsnaf.map(x=>(
            <Card key={x.a} className="rounded-3xl p-4">
              <div className="flex justify-between mb-2"><p className="font-semibold text-sm">{x.label} <span className="text-[11px] text-muted-foreground">({x.cnt})</span></p><p className="text-sm font-bold">{formatRupiah(x.tot)}</p></div>
              <Progress value={totalSalur?Math.min(100,Math.round(x.tot/totalSalur*100)):0} className="h-2"/>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="laporan" className="space-y-3 mt-4">
          <Card className="rounded-3xl p-5 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Terima</span><span className="font-bold">{formatRupiah(totalTerima)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Salur</span><span className="font-bold">{formatRupiah(totalSalur)}</span></div>
            <div className="h-px bg-border"/><div className="flex justify-between font-bold"><span>Sisa</span><span>{formatRupiah(totalTerima-totalSalur)}</span></div>
            <button onClick={()=>toast('success','Kwitansi & laporan ZIS PDF (mock)')} className="mt-3 w-full py-2.5 rounded-full bg-muted text-sm font-medium flex justify-center gap-2"><Receipt className="w-4 h-4"/>Kwitansi Digital</button>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal open={show} onClose={()=>setShow(false)} title="Catat Zakat">
        <form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget as HTMLFormElement);const j=f.get('jenis') as JenisZakat;const nm=String(f.get('nama')||'Hamba Allah');const nom=Number(f.get('nominal')||0);const jiwaF=Number(f.get('jiwa')||0);const beras=Number(f.get('beras')||0);const t=String(f.get('tgl')||new Date().toISOString().split('T')[0]);const n: Zakat={id:`zk-${Date.now()}`,jenis:j,muzakkiNama:nm,nominal:nom||undefined,jumlahJiwa:jiwaF||undefined,beratBeras:beras||undefined,tanggal:t,tahunHijriah:1447};setList(s=>[n,...s]);toast('success','Zakat tersimpan 🤲');setShow(false);}} className="space-y-3">
          <select name="jenis" defaultValue="FITRAH" className="w-full px-4 py-2.5 rounded-2xl bg-muted border-0 text-sm"><option>FITRAH</option><option>MAAL</option><option>PENGHASILAN</option><option>PERDAGANGAN</option></select>
          <Input name="nama" placeholder="Nama Muzakki" required className="rounded-2xl bg-muted border-0"/>
          <div className="grid grid-cols-2 gap-2"><Input name="nominal" type="number" placeholder="Nominal Rp" className="rounded-2xl bg-muted border-0"/><Input name="jiwa" type="number" placeholder="Jiwa (fitrah)" className="rounded-2xl bg-muted border-0"/></div>
          <div className="grid grid-cols-2 gap-2"><Input name="beras" type="number" placeholder="Beras kg" className="rounded-2xl bg-muted border-0"/><Input name="tgl" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="rounded-2xl bg-muted border-0"/></div>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold">Simpan</button>
        </form>
      </Modal>
    </div>
  );
}

function Result({nominal,detail,onUse}:{nominal:number;detail:string;onUse:()=>void}){
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-amber-50 dark:from-primary/5 dark:to-amber-950/10 p-4 text-center border border-primary/10">
      <p className="text-xs text-muted-foreground">Hasil • تَقَبَّلَ اللهُ</p>
      <p className="text-2xl font-extrabold text-primary tabular-nums mt-1">{nominal?formatRupiah(nominal):'—'}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{detail}</p>
      <p className="text-[10px] mt-2 leading-relaxed">آجَرَكَ اللهُ فِيْمَا أَعْطَيْتَ وَبَارَكَ فِيْمَا أَبْقَيْتَ</p>
      <button onClick={onUse} className="mt-3 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Gunakan ke Penerimaan</button>
    </div>
  );
}
