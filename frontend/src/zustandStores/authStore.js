import { create } from 'zustand';
import axiosInstance from '../api/axios.js';

const useAuthStore = create((set, get) => ({
    /**
     * Checks for auth token, fetches user if present, and logs user to console.
     */
    checkAuth: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        set({ user: null, authToken: null });
        return;
      }
      try {
        // Try to fetch the current user profile
        const res = await axiosInstance.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: res.data.user || res.data, authToken: token });
        console.log('Authenticated user:', res.data.user || res.data);
      } catch (err) {
        set({ user: null, authToken: null });
        localStorage.removeItem('authToken');
        console.log('No authenticated user.');
      }
    },
  user: null,
  loading: false,
  error: null,
  authToken: localStorage.getItem('authToken') || null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = res.data;
      localStorage.setItem('authToken', token);
      set({ user, authToken: token, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/register', data);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false });
      return null;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('authToken');
      set({ user: null, authToken: null, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Logout failed', loading: false });
    }
  },

  refreshToken: async () => {
    try {
      const res = await axiosInstance.post('/auth/refresh-token');
      const { token } = res.data;
      localStorage.setItem('authToken', token);
      set({ authToken: token });
      return true;
    } catch (err) {
      set({ error: 'Session expired' });
      localStorage.removeItem('authToken');
      set({ user: null, authToken: null });
      return false;
    }
  },
}));

export default useAuthStore;
