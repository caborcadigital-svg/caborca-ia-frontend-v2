import { create } from 'zustand';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  nombre: string;
  username: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identificador: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('caborca_token');
    const userStr = localStorage.getItem('caborca_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('caborca_token');
        localStorage.removeItem('caborca_user');
      }
    }
  },

  login: async (identificador, password) => {
    set({ isLoading: true });
    try {
      const data = await authAPI.login({ identificador, password });
      localStorage.setItem('caborca_token', data.token);
      localStorage.setItem('caborca_user', JSON.stringify(data.usuario));
      set({ user: data.usuario, token: data.token, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.error || 'Error al iniciar sesión');
    }
  },

  logout: () => {
    localStorage.removeItem('caborca_token');
    localStorage.removeItem('caborca_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
