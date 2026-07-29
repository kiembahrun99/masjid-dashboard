import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Masjid Al Qohar Lidah Kulon, Lakarsantri, Surabaya',
    short_name: 'Al Qohar',
    description: 'Sistem Manajemen Masjid Al Qohar — keuangan, jadwal, jamaah, ZIS, qurban, TPQ.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F8FA',
    theme_color: '#16A34A',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}