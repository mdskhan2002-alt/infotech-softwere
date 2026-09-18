import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('infotech_admin_token', token);
      localStorage.setItem('infotech_admin_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('infotech_admin_token');
      localStorage.removeItem('infotech_admin_user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('infotech_admin_token');
      const userStr = localStorage.getItem('infotech_admin_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch (e) {
          localStorage.removeItem('infotech_admin_token');
          localStorage.removeItem('infotech_admin_user');
        }
      }
    }
  }
}));
