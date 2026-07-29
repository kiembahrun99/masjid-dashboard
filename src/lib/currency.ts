export function formatRupiah(nominal: number, short = false): string {
  if (short && nominal >= 1_000_000) {
    const juta = nominal / 1_000_000;
    return `Rp ${juta.toFixed(juta % 1 === 0 ? 0 : 1)} jt`;
  }
  return `Rp ${nominal.toLocaleString('id-ID')}`;
}

export function parseRupiah(value: string): number {
  return Number(value.replace(/[^0-9]/g, '')) || 0;
}