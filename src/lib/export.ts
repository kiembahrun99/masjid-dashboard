'use client';

import { formatRupiah } from '@/lib/currency';
import { formatTanggalPendek } from '@/lib/date';
import type { Transaksi } from '@/types';

// Excel export via SheetJS already installed (xlsx)
// Dynamic import to avoid bundling overhead

export async function exportTransaksiToExcel(transaksi: Transaksi[], fileName = 'transaksi-masjid.xlsx') {
  const XLSX = await import('xlsx');
  const rows = transaksi.map(t => ({
    Tanggal: t.tanggal,
    Uraian: t.uraian,
    Jenis: t.jenis,
    Kategori: t.kategoriId,
    Nominal: t.nominal,
    Metode: t.metodeBayar,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
  XLSX.writeFile(wb, fileName);
}

export function exportCsv(transaksi: Transaksi[], fileName = 'transaksi.csv') {
  const header = 'Tanggal,Uraian,Jenis,Nominal,Metode\n';
  const rows = transaksi.map(t => `${t.tanggal},"${t.uraian.replace(/"/g,'""')}",${t.jenis},${t.nominal},${t.metodeBayar}`).join('\n');
  const blob = new Blob([header+rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = fileName; a.click();
  URL.revokeObjectURL(url);
}

export async function exportPdfLaporanSummary(params: {
  totalMasuk: number; totalKeluar: number; transaksi: Transaksi[]; masjidNama: string; periode: string;
}) {
  const jsPDF = (await import('jspdf')).default;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`${params.masjidNama} — Laporan ${params.periode}`, 14, 20);
  doc.setFontSize(11);
  doc.text(`Total Pemasukan: ${formatRupiah(params.totalMasuk)}`, 14, 32);
  doc.text(`Total Pengeluaran: ${formatRupiah(params.totalKeluar)}`, 14, 38);
  doc.text(`Saldo: ${formatRupiah(params.totalMasuk - params.totalKeluar)}`, 14, 44);
  doc.setFontSize(10);
  doc.text(`Jumlah transaksi: ${params.transaksi.length}`, 14, 50);
  let y = 60;
  params.transaksi.slice(0, 40).forEach(t => {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(`${formatTanggalPendek(t.tanggal)} | ${t.uraian.slice(0,40)} | ${formatRupiah(t.nominal)}`, 14, y);
    y += 6;
  });
  doc.save(`laporan-${params.periode}.pdf`);
}