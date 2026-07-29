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
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/shared/Toast';
import type { JadwalPetugas, PeranPetugas } from '@/types';
import { Users, CheckCircle, Clock, Plus, GripVertical, Phone, FileText } from 'lucide-react';

export default function JadwalPetugasPage() {
  const db = getDb();
  const { toast } = useToast();
  const [filter, setFilter] = useState<PeranPetugas | 'ALL'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [jadwal, setJadwal] = useState(db.jadwalPetugas);

  const filtered = filter === 'ALL' ? jadwal : jadwal.filter(j => j.peran === filter);

  const toggleConfirm = (id: string) => {
    setJadwal(prev => prev.map(j => j.id === id ? { ...j, statusKonfirmasi: !j.statusKonfirmasi } : j));
    toast('success', 'Status konfirmasi diperbarui ✅');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Jadwal Imam & Khatib" subtitle="Atur rotasi petugas sholat & Jumat" action={{ label: 'Tambah Jadwal', onClick: () => setShowModal(true) }} />

      {/* Role filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(['ALL', 'IMAM', 'MUADZIN', 'KHATIB', 'PENCERAMAH'] as const).map(r => (
          <button
            key={r}
            onClick={() => setFilter(r as PeranPetugas | 'ALL')}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === r ? 'bg-primary text-primary-foreground' : 'bg-bg-subtle hover:bg-border'}`}
          >
            {r === 'ALL' ? 'Semua' : r}
          </button>
        ))}
      </div>

      {/* Jadwal List */}
      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Belum ada jadwal petugas" description="Tambahkan jadwal imam, muadzin, dan khatib" action={{ label: 'Tambah Jadwal', onClick: () => setShowModal(true) }} />
      ) : (
        <div className="space-y-3">
          {filtered.map(j => (
            <Card key={j.id} className={`rounded-3xl p-4 ${j.statusKonfirmasi ? 'border-success/30' : 'border-gold/30'}`}>
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{j.petugasNama}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`rounded-full text-[10px] ${j.peran === 'IMAM' ? 'bg-primary-soft text-primary' : j.peran === 'KHATIB' ? 'bg-gold-soft text-gold' : 'bg-accent-soft text-accent'}`}>{j.peran}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{j.waktuSholat} · {formatTanggalPendek(j.tanggal)}</span>
                      </div>
                      {j.tema && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><FileText className="w-3 h-3" />{j.tema}</p>}
                      {j.kontak && <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" />{j.kontak}</p>}
                    </div>
                    <button
                      onClick={() => toggleConfirm(j.id)}
                      className={`p-2 rounded-xl transition-colors ${j.statusKonfirmasi ? 'bg-success/10 text-success' : 'bg-gold-soft text-gold'}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Drag & Drop info */}
      <Card className="rounded-3xl p-4 border-dashed">
        <p className="text-xs text-muted-foreground">💡 Tip: Drag baris untuk mengatur ulang rotasi jadwal. Status konfirmasi otomatis kirim reminder WA H-1 ke petugas (Fonnte).</p>
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Tambah Jadwal Petugas">
        <JadwalForm onSave={() => { toast('success', 'Tersimpan! Barakallahu fiik 🤲'); setShowModal(false); }} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}

function JadwalForm({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [form, setForm] = useState({ tanggal: new Date().toISOString().split('T')[0], peran: 'IMAM' as PeranPetugas, waktuSholat: '12:10', petugasNama: '', tema: '', kontak: '' });
  return (
    <form onSubmit={e => { e.preventDefault(); if (!form.petugasNama) return; onSave(); }} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground">Tanggal</label>
        <Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} className="mt-1 rounded-2xl bg-bg-subtle border-0" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Peran</label>
          <select value={form.peran} onChange={e => setForm({ ...form, peran: e.target.value as PeranPetugas })} className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm">
            <option value="IMAM">Imam</option>
            <option value="MUADZIN">Muadzin</option>
            <option value="KHATIB">Khatib</option>
            <option value="PENCERAMAH">Penceramah</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Waktu Sholat</label>
          <Input value={form.waktuSholat} onChange={e => setForm({ ...form, waktuSholat: e.target.value })} placeholder="04:30" className="mt-1 rounded-2xl bg-bg-subtle border-0" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Nama Petugas</label>
        <Input value={form.petugasNama} onChange={e => setForm({ ...form, petugasNama: e.target.value })} placeholder="Ustadz Ahmad" className="mt-1 rounded-2xl bg-bg-subtle border-0" required />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Kontak (opsional)</label>
        <Input value={form.kontak} onChange={e => setForm({ ...form, kontak: e.target.value })} placeholder="081234567890" className="mt-1 rounded-2xl bg-bg-subtle border-0" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Tema Khutbah (untuk Khatib)</label>
        <Input value={form.tema} onChange={e => setForm({ ...form, tema: e.target.value })} placeholder="Keutamaan Sedekah" className="mt-1 rounded-2xl bg-bg-subtle border-0" />
      </div>
      <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all">Simpan Jadwal</button>
    </form>
  );
}