import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser } from '@/types/models';

interface AuthState {
  admin: AdminUser | null;
  isLoggedIn: boolean;
  login: (email: string, role?: AdminUser['role']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isLoggedIn: false,

      login: (email, role = 'admin') => {
        const user: AdminUser = {
          id: `admin-${Date.now()}`,
          email,
          name: email.split('@')[0].toUpperCase(),
          role,
          lastLogin: new Date().toISOString(),
        };
        set({ admin: user, isLoggedIn: true });
      },

      logout: () => {
        set({ admin: null, isLoggedIn: false });
      },
    }),
    {
      name: 'sizzle_auth_store',
    }
  )
);
