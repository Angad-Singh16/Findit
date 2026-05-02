import api from './axios.js';
export const getNotificationsApi  = async (params) => (await api.get('/notifications', { params })).data;
export const getUnreadCountApi    = async ()       => (await api.get('/notifications/unread-count')).data;
export const markAsReadApi        = async (id)     => (await api.patch(`/notifications/${id}/read`)).data;
export const markAllAsReadApi     = async ()       => (await api.patch('/notifications/read-all')).data;
export const deleteNotificationApi= async (id)     => (await api.delete(`/notifications/${id}`)).data;