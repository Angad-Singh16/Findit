import api from './axios.js';
export const getMatchesForItemApi = async (itemId) => (await api.get(`/matches/item/${itemId}`)).data;
export const getMyMatchesApi      = async ()       => (await api.get('/matches/my')).data;
export const updateMatchStatusApi = async (id, status) => (await api.patch(`/matches/${id}`, { status })).data;