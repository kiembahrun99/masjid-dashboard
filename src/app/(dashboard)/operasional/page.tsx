'use client';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { getDb } from '@/lib/data-provider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/shared/Toast';
import { ClipboardList, CheckCircle2, Circle, LogIn, LogOut, AlertTriangle, Clock } from 'lucide-react';

export default function OperasionalPage(){
  const db=getDb();const {toast}=useToast();
  const [tasks,setTasks]=useState(db.checklistHarian);
  const [damageDesc,setDamageDesc]=useState('');
  const [checkedIn,setCheckedIn]=useState(false);
  const done=tasks.filter(t=>t.selesai).length;const total=tasks.length;const persen=total?Math.round(done/total*100):0;
  const toggle=(id:string)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,selesai:!t.selesai,waktuSelesai: !t.selesai? new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}): undefined}:t));
  return (
    <div className="space-y-6">
      <PageHeader title="Operasional Harian" subtitle="Checklist tugas marbot harian"/>
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-3xl p-4">
          <p className="text-xs text-muted-foreground">Progress Hari Ini</p>
          <p className="text-2xl font-extrabold mt-1">{persen}%</p>
          <Progress value={persen} className="h-2 mt-2 rounded-full"/>
          <p className="text-[11px] text-muted-foreground mt-1">{done}/{total} tugas selesai</p>
        </Card>
        <Card className="rounded-3xl p-4">
          <p className="text-xs text-muted-foreground">Absensi Petugas</p>
          <div className="flex gap-2 mt-3">
            <button onClick={()=>{setCheckedIn(true);toast('success','Check-in berhasil 🧹');}} disabled={checkedIn} className={`flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1 ${checkedIn?'bg-muted text-muted-foreground':'bg-success text-white'}`}><LogIn className="w-3 h-3"/>Check-In</button>
            <button onClick={()=>{setCheckedIn(false);toast('success','Check-out berhasil');}} disabled={!checkedIn} className={`flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1 ${!checkedIn?'bg-muted text-muted-foreground':'bg-destructive text-white'}`}><LogOut className="w-3 h-3"/>Check-Out</button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1"><Clock className="w-3 h-3"/>{checkedIn?'Sedang bertugas':'Belum check-in'}</p>
        </Card>
      </div>
      <Card className="rounded-3xl p-5">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><ClipboardList className="w-4 h-4"/>Checklist Hari Ini</h3>
        <div className="space-y-2">
          {tasks.map(t=>(
            <button key={t.id} onClick={()=>toggle(t.id)} className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${t.selesai?'bg-success/10':'bg-bg-subtle hover:bg-border'}`}>
              {t.selesai? <CheckCircle2 className="w-5 h-5 text-success shrink-0"/> : <Circle className="w-5 h-5 text-muted-foreground shrink-0"/>}
              <span className={`text-sm flex-1 ${t.selesai?'line-through text-muted-foreground':''}`}>{t.tugas}</span>
              {t.waktuSelesai && <span className="text-[10px] text-muted-foreground">{t.waktuSelesai}</span>}
            </button>
          ))}
        </div>
      </Card>
      <Card className="rounded-3xl p-5">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/>Laporan Kerusakan Cepat</h3>
        <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center mb-3"><p className="text-xs text-muted-foreground">📸 Upload foto kerusakan (tap)</p></div>
        <textarea value={damageDesc} onChange={e=>setDamageDesc(e.target.value)} placeholder="Deskripsi kerusakan..." className="w-full px-4 py-3 rounded-2xl bg-bg-subtle border-0 text-sm min-h-20 mb-3"/>
        <button onClick={()=>{if(!damageDesc) return;toast('success','Laporan dikirim ke pengurus! 🔔');setDamageDesc('');}} className="w-full py-2.5 rounded-full bg-destructive text-white text-sm font-semibold">Kirim Laporan</button>
      </Card>
      <Card className="rounded-3xl p-5">
        <h3 className="font-semibold text-sm mb-2">Log Aktivitas Hari Ini</h3>
        {db.logAktivitas.slice(0,4).map(l=>{const u=db.users.find(x=>x.id===l.userId);return <div key={l.id} className="flex gap-2 py-2 text-xs border-b border-border/50 last:border-0"><span className="font-medium">{u?.nama}</span><span className="text-muted-foreground">{l.aksi} · {l.detail}</span></div>;})}
      </Card>
    </div>
  );
}