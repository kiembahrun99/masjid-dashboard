import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns';
import { id } from 'date-fns/locale';

const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban',
  'Ramadhan', 'Syawal', 'Dzulqadah', 'Dzulhijjah',
];

export function formatTanggal(date: Date | string, formatStr = 'PPP'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, { locale: id });
}

export function formatTanggalPendek(date: Date | string): string {
  return formatTanggal(date, 'd MMM yyyy');
}

export function formatTanggalLengkap(date: Date | string): string {
  return formatTanggal(date, 'EEEE, d MMMM yyyy');
}

export function formatWaktu(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'HH:mm', { locale: id });
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isToday(d)) return `Hari ini, ${formatWaktu(d)}`;
  if (isTomorrow(d)) return `Besok, ${formatWaktu(d)}`;
  if (isYesterday(d)) return `Kemarin, ${formatWaktu(d)}`;
  return formatDistanceToNow(d, { addSuffix: true, locale: id });
}

export function getHijriDate(): string {
  // Gregorian to Hijri conversion (simplified approximation)
  // For production, use api.aladhan.com or adhan-js library
  const now = new Date();
  const gregYear = now.getFullYear();
  const gregMonth = now.getMonth() + 1;
  const gregDay = now.getDate();

  // Simplified Umm al-Qura approximation
  const hijriDay = gregDay;
  const hijriMonth = (gregMonth + 3) % 12 || 12;
  const hijriYear = gregYear - 579;

  // Adjust for known offsets (very approximate)
  const hijriMonthNames = HIJRI_MONTHS;
  return `${hijriDay} ${hijriMonthNames[hijriMonth - 1]} ${hijriYear} H`;
}

export function getHijriMonth(): number {
  const now = new Date();
  return ((now.getMonth() + 1) + 3) % 12 || 12;
}

export function getRemainingSeconds(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const HIJRI_MONTHS_ID: Record<string, string> = {
  Muharram: 'Muharram',
  Safar: 'Safar',
  'Rabiul Awal': 'Rabiul Awal',
  'Rabiul Akhir': 'Rabiul Akhir',
  'Jumadil Awal': 'Jumadil Awal',
  'Jumadil Akhir': 'Jumadil Akhir',
  Rajab: 'Rajab',
  Syaban: 'Syaban',
  Ramadhan: 'Ramadhan',
  Syawal: 'Syawal',
  Dzulqadah: 'Dzulqadah',
  Dzulhijjah: 'Dzulhijjah',
};