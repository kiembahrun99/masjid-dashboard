'use client';

import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { cn } from '@/lib/utils';
import { Moon, Sun, Bell, Menu, User as UserIcon, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  BENDAHARA: 'Bendahara',
  SEKRETARIS: 'Sekretaris',
  PENGURUS: 'Pengurus',
  MARBOT: 'Marbot',
};

export default function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 h-16 bg-bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-2xl hover:bg-bg-subtle"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-semibold">Selamat datang, {user.nama.split(' ')[0]} 👋</h2>
          <p className="text-[11px] text-muted-foreground">{roleLabels[user.role] || user.role}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="p-2 rounded-2xl hover:bg-bg-subtle transition-colors"
          aria-label={theme === 'light' ? 'Mode gelap' : 'Mode terang'}
        >
          {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
        </button>

        <button className="relative p-2 rounded-2xl hover:bg-bg-subtle transition-colors" aria-label="Notifikasi">
          <Bell className="w-4.5 h-4.5" />
          <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[9px] bg-primary text-primary-foreground rounded-full">
            3
          </Badge>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-bg-subtle transition-colors cursor-pointer" aria-label="Profil">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary-soft text-primary text-xs font-bold">
                  {user.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
            <div className="px-2 py-2">
              <p className="font-semibold text-sm">{user.nama}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl cursor-pointer">
              <UserIcon className="w-4 h-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}