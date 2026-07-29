'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useToast } from '@/components/shared/Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAs } = useAuthStore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        toast('success', 'Selamat datang kembali! Barakallahu fiik 🤲');
        router.push('/');
      } else {
        toast('error', 'Email atau password salah. Coba lagi ya.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft via-bg-base to-accent-soft p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕌</div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">MasjidKU</h1>
          <p className="text-sm text-muted-foreground mt-1">Sistem Manajemen Masjid Modern</p>
        </div>

        {/* Card */}
        <div className="bg-bg-surface rounded-3xl shadow-[0_8px_32px_rgba(15,23,42,0.08)] p-8 border border-border/50">
          <h2 className="text-xl font-bold mb-1">Masuk</h2>
          <p className="text-sm text-muted-foreground mb-6">Silakan masuk dengan akun Anda</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@masjid.app"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 rounded-2xl bg-bg-subtle border-0 focus:bg-bg-surface"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded-2xl bg-bg-subtle border-0 focus:bg-bg-surface pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full h-12 text-base font-semibold" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Sebentar ya...' : 'Masuk'}
            </Button>
          </form>

          {/* Quick login */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">⏩ Akses Cepat (Demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { loginAs('u1'); router.push('/'); }}
                className="px-3 py-2 rounded-2xl bg-primary-soft text-primary text-xs font-medium hover:bg-primary-soft/80 transition-colors"
              >
                🛡️ Super Admin
              </button>
              <button
                onClick={() => { loginAs('u2'); router.push('/'); }}
                className="px-3 py-2 rounded-2xl bg-accent-soft text-accent text-xs font-medium hover:bg-accent-soft/80 transition-colors"
              >
                💰 Bendahara
              </button>
              <button
                onClick={() => { loginAs('u3'); router.push('/'); }}
                className="px-3 py-2 rounded-2xl bg-gold-soft text-gold text-xs font-medium hover:bg-gold-soft/80 transition-colors"
              >
                📋 Sekretaris
              </button>
              <button
                onClick={() => { loginAs('u5'); router.push('/'); }}
                className="px-3 py-2 rounded-2xl bg-info/10 text-info text-xs font-medium hover:bg-info/20 transition-colors"
              >
                🧹 Marbot
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Masjid Al-Ikhlas · Bandung
        </p>
      </div>
    </div>
  );
}