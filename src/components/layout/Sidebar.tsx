'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import type { UserRole } from '@/types';
import {
  LayoutDashboard, Wallet, Clock, Calendar, Users,
  Heart, HandHelping, Megaphone, Package, ClipboardList,
  BookOpen, Settings, LogOut, ChevronLeft, Moon,
} from 'lucide-react';

const menuItems: { label: string; href: string; icon: React.ElementType; roles?: UserRole[] }[] = [
  { label: 'Beranda', href: '/', icon: LayoutDashboard },
  { label: 'Keuangan', href: '/keuangan/transaksi', icon: Wallet, roles: ['SUPER_ADMIN', 'BENDAHARA'] },
  { label: 'Jadwal', href: '/jadwal/sholat', icon: Clock, roles: undefined },
  { label: 'Agenda', href: '/agenda', icon: Calendar, roles: undefined },
  { label: 'Jamaah', href: '/jamaah', icon: Users, roles: ['SUPER_ADMIN', 'SEKRETARIS'] as UserRole[] },
  { label: 'ZIS', href: '/zis', icon: Heart, roles: undefined },
  { label: 'Qurban', href: '/qurban', icon: HandHelping, roles: undefined },
  { label: 'Pengumuman', href: '/pengumuman', icon: Megaphone, roles: undefined },
  { label: 'Inventaris', href: '/inventaris', icon: Package, roles: ['SUPER_ADMIN', 'SEKRETARIS', 'MARBOT'] as UserRole[] },
  { label: 'Operasional', href: '/operasional', icon: ClipboardList, roles: ['SUPER_ADMIN', 'MARBOT'] as UserRole[] },
  { label: 'Ramadhan', href: '/ramadhan', icon: Moon, roles: undefined },
  { label: 'TPQ', href: '/tpq', icon: BookOpen, roles: undefined },
  { label: 'Pengaturan', href: '/pengaturan', icon: Settings, roles: ['SUPER_ADMIN'] as UserRole[] },
];

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
      collapsed ? 'w-[72px]' : 'w-[260px]'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-sidebar-border', collapsed && 'justify-center')}>
        {collapsed ? (
          <span className="text-2xl">🕌</span>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕌</span>
            <div>
              <h1 className="font-heading font-bold text-base">MasjidKU</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Al-Ikhlas</p>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-2 space-y-1">
        {menuItems
          .filter(item => !item.roles || (user && item.roles.includes(user.role)))
          .map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 group',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <Icon className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4.5 h-4.5')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="hidden lg:flex items-center justify-center h-10 mx-2 mb-1 rounded-2xl hover:bg-sidebar-accent text-sidebar-foreground/50"
      >
        <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
      </button>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-sm text-destructive/80 hover:bg-destructive/10 transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}