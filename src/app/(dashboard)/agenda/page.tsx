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
import type { Agenda, JenisAgenda } from '@/types';
import { Calendar as CalendarIcon, Users, MapPin, Clock, DollarSign, Plus, QrCode, Search } from 'lucide-react';

export default function AgendaPage() {
  const db = getDb();
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filterJenis, setFilterJenis] = useState<JenisAgenda | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    let data = [...db.agenda];
    if (filterJenis !== 'ALL') data = data.filter(a => a.jenis === filterJenis);
    if (search) data = data.filter(a => a.judul.toLowerCase().includes(search.toLowerCase()));
    return data.sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime());
  }, [filterJenis, search]);

  const jenisColors: Record<string, string> = {
    KAJIAN_RUTIN: 'bg-primary-soft text-primary',
    KAJIAN_AKBAR: 'bg-gold-soft text-gold',
    PENGAJIAN_IBU: 'bg-accent-soft text-accent',
    TPQ: 'bg-info/10 text-info',
    RAPAT_DKM: 'bg-muted text-muted-foreground',
    KERJA_BAKTI: 'bg-success/10 text-success',
    SANTUNAN: 'bg-destructive/10 text-destructive',
    EVENT_REMAJA: 'bg-primary-soft text-primary',
    PHBI: 'bg-gold-soft text-gold',
  };

  const statusDot: Record<string, string> = {
    RENCANA: 'bg-info',
    BERLANGSUNG: 'bg-success animate-pulse',
    SELESAI: 'bg-muted-foreground',
    BATAL: 'bg-destructive',
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Agenda & Kegiatan" subtitle="Kelola kegiatan masjid" action={{ label: 'Tambah Agenda', onClick: () => setShowModal(true) }} />

      {/* View toggle + filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex bg-bg-subtle rounded-2xl p-1">
          <button onClick={() => setView('list')} className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${view === 'list' ? 'bg-bg-surface shadow-sm' : ''}`}>List</button>
          <button onClick={() => setView('calendar')} className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${view === 'calendar' ? 'bg-bg-surface shadow-sm' : ''}`}>Kalendar</button>
        </div>
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kegiatan..." className="pl-10 rounded-2xl bg-bg-subtle border-0 text-sm" />
        </div>
        <select value={filterJenis} onChange={e => setFilterJenis(e.target.value as JenisAgenda | 'ALL')} className="px-3 py-2 rounded-2xl bg-bg-subtle border-0 text-xs font-medium">
          <option value="ALL">Semua Jenis</option>
          <option value="KAJIAN_RUTIN">Kajian Rutin</option>
          <option value="KAJIAN_AKBAR">Kajian Akbar</option>
          <option value="PENGAJIAN_IBU">Ibu-ibu</option>
          <option value="TPQ">TPQ</option>
          <option value="RAPAT_DKM">Rapat DKM</option>
          <option value="KERJA_BAKTI">Kerja Bakti</option>
          <option value="SANTUNAN">Santunan</option>
          <option value="EVENT_REMAJA">Remaja</option>
          <option value="PHBI">PHBI</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarIcon} title="Belum ada kegiatan nih. Yuk buat yang pertama! ✨" description="Tambah kajian, rapat, atau event remaja masjid" action={{ label: 'Buat Agenda', onClick: () => setShowModal(true) }} />
      ) : view === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(a => (
            <Card key={a.id} className="rounded-3xl p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusDot[a.status]}`} />
                  <Badge className={`rounded-full text-[10px] border-0 ${jenisColors[a.jenis] || 'bg-muted'}`}>{a.jenis.replace(/_/g, ' ')}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{formatTanggalPendek(a.tanggalMulai)}</span>
              </div>
              <h3 className="font-bold text-sm">{a.judul}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.deskripsi}</p>
              <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.lokasi}</span>
                {a.pemateri && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a.pemateri}</span>}
                {a.anggaran && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatRupiah(a.anggaran, true)}</span>}
              </div>
              <div className="flex gap-1.5 mt-3">
                <button className="flex-1 py-2 rounded-full bg-bg-subtle text-xs font-medium hover:bg-border transition-colors flex items-center justify-center gap-1"><QrCode className="w-3 h-3" /> Absensi</button>
                <button className="flex-1 py-2 rounded-full bg-primary-soft text-primary text-xs font-medium hover:bg-primary-soft/80 transition-colors">Generate Poster</button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <CalendarView agenda={filtered} />
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Tambah Agenda">
        <AgendaForm onSave={() => { toast('success', 'Tersimpan! Barakallahu fiik 🤲'); setShowModal(false); }} />
      </Modal>
    </div>
  );
}

function AgendaForm({ onSave }: { onSave: () => void }) {
  const [form, setForm] = useState({ judul: '', deskripsi: '', jenis: 'KAJIAN_RUTIN' as JenisAgenda, tanggalMulai: new Date().toISOString().split('T')[0], lokasi: '', pemateri: '', anggaran: '' });
  return (
    <form onSubmit={e => { e.preventDefault(); if (!form.judul) return; onSave(); }} className="space-y-4">
      <Input value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} placeholder="Judul kegiatan" className="rounded-2xl bg-bg-subtle border-0" required />
      <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi..." className="w-full px-4 py-3 rounded-2xl bg-bg-subtle border-0 text-sm min-h-20" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Jenis</label>
          <select value={form.jenis} onChange={e => setForm({ ...form, jenis: e.target.value as JenisAgenda })} className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-bg-subtle border-0 text-sm">
            <option value="KAJIAN_RUTIN">Kajian Rutin</option>
            <option value="KAJIAN_AKBAR">Kajian Akbar</option>
            <option value="PENGAJIAN_IBU">Pengajian Ibu-ibu</option>
            <option value="TPQ">TPQ</option>
            <option value="RAPAT_DKM">Rapat DKM</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Tanggal</label>
          <Input type="date" value={form.tanggalMulai} onChange={e => setForm({ ...form, tanggalMulai: e.target.value })} className="mt-1 rounded-2xl bg-bg-subtle border-0" />
        </div>
      </div>
      <Input value={form.lokasi} onChange={e => setForm({ ...form, lokasi: e.target.value })} placeholder="Lokasi" className="rounded-2xl bg-bg-subtle border-0" />
      <Input value={form.pemateri} onChange={e => setForm({ ...form, pemateri: e.target.value })} placeholder="Pemateri (opsional)" className="rounded-2xl bg-bg-subtle border-0" />
      <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all">Simpan</button>
    </form>
  );
}

function CalendarView({ agenda }: { agenda: Agenda[] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <Card className="rounded-3xl p-5">
      <h3 className="font-bold mb-4">{monthNames[month]} {year}</h3>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d} className="text-[11px] text-muted-foreground font-semibold py-2">{d}</div>)}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayAgenda = agenda.filter(a => a.tanggalMulai === dateStr);
          const isToday = day === today.getDate();
          return (
            <div key={day} className={`min-h-[72px] p-1 rounded-xl text-xs ${isToday ? 'bg-primary text-primary-foreground' : 'bg-bg-subtle'}`}>
              <div className="font-bold">{day}</div>
              {dayAgenda.map(a => (
                <div key={a.id} className="mt-0.5 text-[9px] px-1 py-0.5 rounded-full bg-primary-soft text-primary truncate">{a.judul.slice(0, 12)}</div>
              ))}
            </div>
          );
        })}
      </div>
    </Card>
  );
}