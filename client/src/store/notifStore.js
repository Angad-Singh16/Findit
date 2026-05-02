import { create } from 'zustand';
import {
  getNotificationsApi, getUnreadCountApi,
  markAsReadApi, markAllAsReadApi,
  deleteNotificationApi,
} from '../api/notification.api.js';

const useNotifStore = create((set, get) => ({
  notifications: [],
  unreadCount:   0,
  loading:       false,

  // Fetch notifications
  fetchNotifications: async (params = {}) => {
    set({ loading: true });
    try {
      const data = await getNotificationsApi(params);
      set({ notifications: data.notifications, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  // Fetch unread count (for bell badge)
  fetchUnreadCount: async () => {
    try {
      const data = await getUnreadCountApi();
      set({ unreadCount: data.count });
    } catch {}
  },

  // Mark one as read
  markAsRead: async (id) => {
    await markAsReadApi(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  // Mark all as read
  markAllAsRead: async () => {
    await markAllAsReadApi();
    set((state) => ({
      notifications: state.notifications.map((n) =>
        ({ ...n, is_read: true })
      ),
      unreadCount: 0,
    }));
  },

  // Delete notification
  deleteNotification: async (id) => {
    await deleteNotificationApi(id);
    set((state) => ({
      notifications: state.notifications.filter((n) => n._id !== id),
    }));
  },

  // Add new notification from socket
  addNotification: (notif) => set((state) => ({
    notifications: [notif, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),
}));

export default useNotifStore;