import api from './axios.js';
export const startSessionApi   = async ()          => (await api.post('/chat/session')).data;
export const getMySessionsApi  = async ()          => (await api.get('/chat/sessions')).data;
export const getSessionByIdApi = async (id)        => (await api.get(`/chat/session/${id}`)).data;
export const sendMessageApi    = async (id, content) => (await api.post(`/chat/session/${id}/message`, { content })).data;
export const closeSessionApi   = async (id)        => (await api.patch(`/chat/session/${id}/close`)).data;