import api from './axios.js';

export const registerApi = async (data) =>
  (await api.post('/auth/register', data)).data;

export const loginApi = async (data) =>
  (await api.post('/auth/login', data)).data;

export const getMeApi = async () =>
  (await api.get('/auth/me')).data;

export const logoutApi = async () =>
  (await api.post('/auth/logout')).data;

export const refreshTokenApi = async (refreshToken) =>
  (await api.post('/auth/refresh', { refreshToken })).data;