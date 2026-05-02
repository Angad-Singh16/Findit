import api from './axios.js';
export const submitClaimApi      = async (data)       => (await api.post('/claims', data)).data;
export const getMyClaimsApi      = async ()           => (await api.get('/claims/my')).data;
export const getItemClaimsApi    = async (itemId)     => (await api.get(`/claims/item/${itemId}`)).data;
export const getAllClaimsApi     = async (params)     => (await api.get('/claims', { params })).data;
export const updateClaimStatusApi= async (id, data)   => (await api.patch(`/claims/${id}/status`, data)).data;
export const withdrawClaimApi    = async (id)         => (await api.delete(`/claims/${id}`)).data;