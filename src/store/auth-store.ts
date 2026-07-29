import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { mockUsers } from '@/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginAs: (userId: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  loginAs: (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  hasRole: (roles: UserRole[]) => {
    const { user } = get();
    return user ? roles.includes(user.role) : false;
  },
}));