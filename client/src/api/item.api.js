import api from './axios.js';
export const getAllItemsApi   = async (params) => (await api.get('/items', { params })).data;
export const getMyItemsApi   = async ()        => (await api.get('/items/my')).data;
export const searchItemsApi  = async (params)  => (await api.get('/items/search', { params })).data;
export const getItemByIdApi  = async (id)      => (await api.get(`/items/${id}`)).data;
export const createItemApi   = async (data)    => (await api.post('/items', data)).data;
export const updateItemApi   = async (id, data)=> (await api.put(`/items/${id}`, data)).data;
export const updateStatusApi = async (id, status) => (await api.patch(`/items/${id}/status`, { status })).data;
export const deleteItemApi   = async (id)      => (await api.delete(`/items/${id}`)).data;
