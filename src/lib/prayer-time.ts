export interface PrayerTime {
  name: string;
  time: string; // HH:mm
  timestamp: number;
}

const JAKARTA_TZ_OFFSET = 7;

function toRad(deg: number) { return deg * (Math.PI / 180); }
function toDeg(rad: number) { return rad * (180 / Math.PI); }

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  timezone: number = JAKARTA_TZ_OFFSET,
  method: string = 'KEMENAG',
  correctionMinutes: number = 2
): Record<string, string> {
  // Simplified calculation - in production use adhan-js or api.aladhan.com
  // For now return approximate times for Indonesia with correction
  const base: Record<string, string> = {
    Subuh: '04:30',
    Dzuhur: '12:10',
    Ashar: '15:30',
    Maghrib: '17:55',
    Isya: '19:10',
  };

  // Apply correction
  const corrected: Record<string, string> = {};
  Object.entries(base).forEach(([k, v]) => {
    const [h, m] = v.split(':').map(Number);
    const total = h * 60 + m + correctionMinutes;
    const nh = Math.floor(total / 60) % 24;
    const nm = total % 60;
    corrected[k] = `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
  });
  return corrected;
}

export function getNextPrayerTime(
  prayerTimes: Record<string, string> | { name: string; waktu: string }[]
): { name: string; waktu: string; minutesUntil: number } {
  const now = new Date();
  const curMinutes = now.getHours() * 60 + now.getMinutes();

  const list = Array.isArray(prayerTimes)
    ? prayerTimes
    : Object.entries(prayerTimes).map(([name, waktu]) => ({ name, waktu }));

  for (const p of list) {
    const [h, m] = p.waktu.split(':').map(Number);
    const pm = h * 60 + m;
    if (pm > curMinutes) {
      return { ...p, minutesUntil: pm - curMinutes };
    }
  }
  // Next is Subuh tomorrow
  const first = list[0];
  const [h, m] = first.waktu.split(':').map(Number);
  const minsUntilMidnight = 24 * 60 - curMinutes;
  const minsFromMidnight = h * 60 + m;
  return { ...first, minutesUntil: minsUntilMidnight + minsFromMidnight };
}

export function formatCountdown(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
}

export function getQiblaDirection(lat: number, lng: number): number {
  // Kaaba coords
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const dLng = toRad(kaabaLng - lng);
  const lat1 = toRad(lat);
  const lat2 = toRad(kaabaLat);
  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
  const qibla = toDeg(Math.atan2(y, x));
  return (qibla + 360) % 360;
}