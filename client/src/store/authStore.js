import { create } from 'zustand';
import { loginApi, registerApi, logoutApi, getMeApi } from '../api/auth.api.js';

const useAuthStore = create((set, get) => ({
  user:    null,
  token:   null,
  loading: true,  // true on initial load

  // Restore auth state from localStorage on app start
  restoreAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const { user } = await getMeApi(token);
      set({ user, token, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  // Register
  register: async (formData) => {
    const data = await registerApi(formData);
    localStorage.setItem('token', data.accessToken);
    set({ user: data.user, token: data.accessToken });
    return data;
  },

  // Login
  login: async (formData) => {
    const data = await loginApi(formData);
    localStorage.setItem('token', data.accessToken);
    set({ user: data.user, token: data.accessToken });
    return data;
  },

  // Logout
  logout: async () => {
    try { await logoutApi(); } catch {}
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Update user in store (after profile edit)
  setUser: (user) => set({ user }),
}));

export default useAuthStore;