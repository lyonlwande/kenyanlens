import { create } from 'zustand';
import axiosInstance from '../api/axios.js';

const useUserStore = create((set, get) => ({
  users: [],
  user: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get('/users');
      set({ users: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch users', loading: false });
    }
  },

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      set({ user: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch user', loading: false });
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/users/${id}`, data);
      set({ user: res.data, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update user', loading: false });
      return false;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/users/${id}`);
      set({ user: null, loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete user', loading: false });
      return false;
    }
  },
}));

export default useUserStore;
