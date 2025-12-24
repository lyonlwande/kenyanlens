import { create } from 'zustand';
import axios from '../api/axios';


const useBlogStore = create((set, get) => ({
  blogs: [],
  loading: false,
  error: null,
  selectedBlog: null,
  // Draft state
  drafts: [],
  currentDraft: null,
  draftLoading: false,
  draftError: null,
  // Fetch all drafts for the user
  fetchDrafts: async () => {
    set({ draftLoading: true, draftError: null });
    try {
      const res = await axios.get('/blogs/drafts', { withCredentials: true });
      set({ drafts: res.data, draftLoading: false });
    } catch (err) {
      set({ draftError: err.response?.data?.error || 'Failed to fetch drafts', draftLoading: false });
    }
  },

  // Fetch a single draft by ID
  fetchDraftById: async (id) => {
    set({ draftLoading: true, draftError: null });
    try {
      const res = await axios.get(`/blogs/drafts/${id}`, { withCredentials: true });
      set({ currentDraft: res.data, draftLoading: false });
      return res.data;
    } catch (err) {
      set({ draftError: err.response?.data?.error || 'Failed to fetch draft', draftLoading: false });
      return null;
    }
  },

  // Save (create or update) a draft
    saveDraft: async (draftData, draftId = null) => {
      // Ensure 'thumbnail' is used instead of 'image'
    set({ draftLoading: true, draftError: null });
    try {
      let res;
      if (draftId) {
        res = await axios.put(`/blogs/drafts/${draftId}`, draftData, { withCredentials: true });
      } else {
        res = await axios.post('/blogs/drafts', draftData, { withCredentials: true });
      }
      set((state) => ({
        currentDraft: res.data,
        drafts: draftId
          ? state.drafts.map((d) => (d._id === draftId ? res.data : d))
          : [res.data, ...state.drafts],
        draftLoading: false
      }));
      return res.data;
    } catch (err) {
      set({ draftError: err.response?.data?.error || 'Failed to save draft', draftLoading: false });
      return null;
    }
  },

  // Delete a draft
  deleteDraft: async (id) => {
    set({ draftLoading: true, draftError: null });
    try {
      await axios.delete(`/blogs/drafts/${id}`, { withCredentials: true });
      set((state) => ({
        drafts: state.drafts.filter((d) => d._id !== id),
        currentDraft: state.currentDraft && state.currentDraft._id === id ? null : state.currentDraft,
        draftLoading: false
      }));
      return true;
    } catch (err) {
      set({ draftError: err.response?.data?.error || 'Failed to delete draft', draftLoading: false });
      return false;
    }
  },

  // Publish a draft
  publishDraft: async (id) => {
    set({ draftLoading: true, draftError: null });
    try {
      const res = await axios.post(`/blogs/drafts/${id}/publish`, {}, { withCredentials: true });
      set((state) => ({
        drafts: state.drafts.filter((d) => d._id !== id),
        currentDraft: null,
        draftLoading: false
      }));
      return res.data;
    } catch (err) {
      set({ draftError: err.response?.data?.error || 'Failed to publish draft', draftLoading: false });
      return null;
    }
  },

  // Set the current draft in state
  setCurrentDraft: (draft) => set({ currentDraft: draft }),

  // Clear draft error
  clearDraftError: () => set({ draftError: null }),

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/blogs');
      set({ blogs: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch blogs', loading: false });
    }
  },

  // Fetch a single blog by ID
  fetchBlogById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/blogs/${id}`);
      set({ selectedBlog: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch blog', loading: false });
    }
  },

  // Create a new blog
    createBlog: async (blogData) => {
      // Ensure 'thumbnail' is used instead of 'image'
    set({ loading: true, error: null });
    try {
      const res = await axios.post('/blogs', blogData, { withCredentials: true });
      set((state) => ({ blogs: [res.data, ...state.blogs], loading: false }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create blog', loading: false });
      return null;
    }
  },

  // Update an existing blog
    updateBlog: async (id, blogData) => {
      // Ensure 'thumbnail' is used instead of 'image'
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/blogs/${id}`, blogData, { withCredentials: true });
      set((state) => ({
        blogs: state.blogs.map((b) => (b._id === id ? res.data : b)),
        loading: false,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update blog', loading: false });
      return null;
    }
  },

  // Delete a blog
  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/blogs/${id}`, { withCredentials: true });
      set((state) => ({
        blogs: state.blogs.filter((b) => b._id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete blog', loading: false });
      return false;
    }
  },

  // Set the selected blog
  setSelectedBlog: (blog) => set({ selectedBlog: blog }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useBlogStore;
