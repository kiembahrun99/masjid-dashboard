'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import BottomNav from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils';

function hasStoredAuth(): boolean {
  try {
    const raw = localStorage.getItem('masjid-auth');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return !!parsed?.state?.isAuthenticated;
  } catch { return false; }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const doCheck = () => {
      if (isAuthenticated || hasStoredAuth()) {
        setAllowed(true); setChecked(true);
      } else {
        setTimeout(() => {
          if (isAuthenticated || hasStoredAuth()) {
            setAllowed(true); setChecked(true);
          } else {
            router.push('/login');
          }
        }, 700);
      }
    };
    doCheck();
    const t = setTimeout(doCheck, 400);
    return () => clearTimeout(t);
  }, [isAuthenticated, router]);

  useEffect(() => { if (isAuthenticated) { setAllowed(true); setChecked(true); } }, [isAuthenticated]);

  if (!checked) {
    return <div className="min-h-screen bg-bg-base flex items-center justify-center"><div className="animate-pulse text-sm text-muted-foreground">Memuat Masjid Al Qohar...</div></div>;
  }
  if (!allowed && !isAuthenticated) {
    try { if (hasStoredAuth()) return <div className="min-h-screen bg-bg-base animate-pulse p-8">Memuat...</div>; } catch {}
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className={cn('hidden lg:block', sidebarOpen ? 'w-[260px]' : 'w-[72px]')}>
        <Sidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-[260px] h-full">
            <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      <div className={cn('transition-all duration-300', sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[72px]')}>
        <Topbar onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
