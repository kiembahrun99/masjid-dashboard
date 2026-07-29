'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import {
  LayoutDashboard, Wallet, Clock, Calendar, Users,
  Heart, Megaphone, Settings,
} from 'lucide-react';

const navItems: { label: string; href: string; icon: React.ElementType }[] = [
  { label: 'Beranda', href: '/', icon: LayoutDashboard },
  { label: 'Keuangan', href: '/keuangan/transaksi', icon: Wallet },
  { label: 'Jadwal', href: '/jadwal/sholat', icon: Clock },
  { label: 'Agenda', href: '/agenda', icon: Calendar },
  { label: 'Lainnya', href: '#more', icon: Heart },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="mx-3 mb-2 rounded-3xl bg-bg-surface/90 backdrop-blur-xl border border-border shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-150 min-w-[56px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-all', isActive && 'scale-110')} />
                <span className={cn('text-[10px] font-medium', isActive ? 'opacity-100' : 'opacity-60')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}