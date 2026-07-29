import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/shared/Toast';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Masjid Al Qohar Lidah Kulon, Lakarsantri, Surabaya — Sistem Manajemen Masjid',
  description: 'Sistem manajemen masjid modern: keuangan transparan, jadwal cerdas, jamaah terdata.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg-base text-foreground">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}