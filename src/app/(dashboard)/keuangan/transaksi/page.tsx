'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import DataTable from '@/components/shared/DataTable';
import Modal from '@/components/shared/Modal';
import EmptyState from '@/components/shared/EmptyState';
import { getDb } from '@/lib/data-provider';
import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek } from '@/lib/date';
import { useToast } from '@/components/shared/Toast';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Transaksi, JenisTransaksi } from '@/types';
import { Wallet, TrendingUp, TrendingDown, Download, Plus, FileText, Search, SlidersHorizontal, X, Calendar } from 'lucide-react';

export default function TransaksiPage() {
  const db = getDb();
  const { toast } = useToast();
  const [jenisFilter, setJenisFilter] = useState<JenisTransaksi | 'ALL'>('ALL');
  const [kategoriFilter, setKategoriFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(() => {
    let data = [...db.transaksi];
    if (jenisFilter !== 'ALL') data = data.filter(t => t.jenis === jenisFilter);
    if (kategoriFilter !== 'ALL') data = data.filter(t => t.kategoriId === kategoriFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(t => t.uraian.toLowerCase().includes(q));
    }
    return data.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }, [jenisFilter, kategoriFilter, searchQuery, db.transaksi]);

  const totalMasuk = filtered.filter(t => t.jenis === 'MASUK').reduce((s, t) => s + t.nominal, 0);
  const totalKeluar = filtered.filter(t => t.jenis === 'KELUAR').reduce((s, t) => s + t.nominal, 0);

  const getKategori = (id: string) => db.kategoriTransaksi.find(k => k.id === id);

  return (
    <div className="space-y-6">
      <PageHeader title="Transaksi" subtitle="Catat pemasukan & pengeluaran masjid" action={{ label: 'Tambah Transaksi', onClick: () => setShowModal(true) }} />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-3xl p-4 border-0 bg-gradient-to-br from-primary/10 to-primary-soft">
          <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-1">
            <TrendingUp className="w-4 h-4" /> Pemasukan
          </div>
          <p className="text-2xl font-extrabold tabular-nums text-primary">{formatRupiah(totalMasuk)}</p>
        </Card>
        <Card className="rounded-3xl p-4 border-0 bg-gradient-to-br from-destructive/10 to-destructive/5">
          <div className="flex items-center gap-2 text-sm text-destructive font-semibold mb-1">
            <TrendingDown className="w-4 h-4" /> Pengeluaran
          </div>
          <p className="text-2xl font-extrabold tabular-nums text-destructive">{formatRupiah(totalKeluar)}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi..."
            className="pl-10 rounded-2xl bg-bg-subtle border-0"
          />
        </div>
        <select
          value={jenisFilter}
          onChange={e => setJenisFilter(e.target.value as JenisTransaksi | 'ALL')}
          className="px-3 py-2 rounded-2xl bg-bg-subtle border-0 text-sm font-medium cursor-pointer"
        >
          <option value="ALL">Semua</option>
          <option value="MASUK">Pemasukan</option>
          <option value="KELUAR">Pengeluaran</option>
        </select>
        <select
          value={kategoriFilter}
          onChange={e => setKategoriFilter(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-bg-subtle border-0 text-sm font-medium cursor-pointer hidden md:block"
        >
          <option value="ALL">Semua Kategori</option>
          {db.kategoriTransaksi.map(k => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>
        <button className="p-2 rounded-2xl hover:bg-bg-subtle" aria-label="Filter lanjutan">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={Wallet} title="Belum ada transaksi nih" description="Yuk catat yang pertama! ✨" action={{ label: 'Tambah Transaksi', onClick: () => setShowModal(true) }} />
      ) : (
        <DataTable
          data={filtered}
          searchable={false}
          pageSize={15}
          columns={[
            { key: 'tanggal', label: 'Tanggal', render: (t: Transaksi) => <span className="text-xs text-muted-foreground">{formatTanggalPendek(t.tanggal)}</span> },
            { key: 'uraian', label: 'Uraian', render: (t: Transaksi) => (
              <div>
                <p className="font-medium">{t.uraian}</p>
                <p className="text-xs text-muted-foreground">{getKategori(t.kategoriId)?.nama}</p>
              </div>
            )},
            { key: 'nominal', label: 'Nominal', render: (t: Transaksi) => (
              <span className={`font-semibold tabular-nums ${t.jenis === 'MASUK' ? 'text-success' : 'text-destructive'}`}>
                {t.jenis === 'MASUK' ? '' : '-'}{formatRupiah(t.nominal)}
              </span>
            ), className: 'text-right' },
            { key: 'metodeBayar', label: 'Metode', render: (t: Transaksi) => (
              <Badge variant="outline" className="rounded-full text-[10px]">{t.metodeBayar}</Badge>
            ), hideOnMobile: true },
          ]}
        />
      )}

      {/* Add transaction modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Tambah Transaksi">
        <TransaksiForm onSave={() => { toast('success', 'Tersimpan! Barakallahu fiik 🤲'); setShowModal(false); }} />
      </Modal>
    </div>
  );
}

function TransaksiForm({ onSave }: { onSave: () => void }) {
  const db = getDb();
  const [jenis, setJenis] = useState<JenisTransaksi>('MASUK');
  const [kategoriId, setKategoriId] = useState('');
  const [nominal, setNominal] = useState('');
  const [uraian, setUraian] = useState('');
  const [metodeBayar, setMetodeBayar] = useState<'TUNAI' | 'TRANSFER' | 'QRIS'>('TUNAI');

  const kategori = db.kategoriTransaksi.filter(k => k.jenis === jenis);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kategoriId || !nominal || !uraian) return;
    // Mock save
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="MASUK" onValueChange={(v) => setJenis(v as JenisTransaksi)}>
        <TabsList className="rounded-2xl w-full">
          <TabsTrigger value="MASUK" className="flex-1 rounded-xl">Pemasukan</TabsTrigger>
          <TabsTrigger value="KELUAR" className="flex-1 rounded-xl">Pengeluaran</TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
        <select
          value={kategoriId}
          onChange={e => setKategoriId(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-bg-subtle border-0 text-sm"
          required
        >
          <option value="">Pilih kategori</option>
          {kategori.map(k => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Nominal (Rp)</label>
        <Input
          type="number"
          value={nominal}
          onChange={e => setNominal(e.target.value)}
          placeholder="0"
          className="rounded-2xl bg-bg-subtle border-0 text-lg font-bold"
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Uraian</label>
        <Input
          value={uraian}
          onChange={e => setUraian(e.target.value)}
          placeholder="Contoh: Infaq Jumat 25 Juli 2026"
          className="rounded-2xl bg-bg-subtle border-0"
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Metode Pembayaran</label>
        <div className="flex gap-2">
          {(['TUNAI', 'TRANSFER', 'QRIS'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMetodeBayar(m)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${metodeBayar === m ? 'bg-primary text-primary-foreground' : 'bg-bg-subtle'}`}
            >
              {m === 'TUNAI' ? '💰 Tunai' : m === 'TRANSFER' ? '🏦 Transfer' : '📱 QRIS'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Bukti Transaksi (foto)</label>
        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:bg-bg-subtle transition-colors">
          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Klik untuk upload foto nota/struk</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover active:scale-[0.98] transition-all"
      >
        Simpan Transaksi
      </button>
    </form>
  );
}

function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}