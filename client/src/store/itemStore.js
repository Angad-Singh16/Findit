import { create } from 'zustand';
import {
  getAllItemsApi, getItemByIdApi,
  searchItemsApi, deleteItemApi,
  updateStatusApi,
} from '../api/item.api.js';

const useItemStore = create((set, get) => ({
  items:       [],
  currentItem: null,
  loading:     false,
  error:       null,
  total:       0,
  page:        1,
  pages:       1,
  filters: {
    type:     '',
    category: '',
    location: '',
    status:   'open',
  },

  // Fetch all items with current filters
  fetchItems: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const params = { ...get().filters, page, limit: 10 };
      const data = await getAllItemsApi(params);
      set({
        items: data.items,
        total: data.total,
        page:  data.page,
        pages: data.pages,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Search items
  searchItems: async (q, type = '') => {
    set({ loading: true, error: null });
    try {
      const data = await searchItemsApi({ q, type });
      set({ items: data.items, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Fetch single item
  fetchItemById: async (id) => {
    set({ loading: true, currentItem: null });
    try {
      const data = await getItemByIdApi(id);
      set({ currentItem: data.item, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Update status locally after patch
  updateStatus: async (id, status) => {
    await updateStatusApi(id, status);
    set((state) => ({
      items: state.items.map((i) =>
        i._id === id ? { ...i, status } : i
      ),
    }));
  },

  // Delete item
  deleteItem: async (id) => {
    await deleteItemApi(id);
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    }));
  },

  // Set filters
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  // Reset filters
  resetFilters: () => set({
    filters: { type: '', category: '', location: '', status: 'open' }
  }),
}));

export default useItemStore;