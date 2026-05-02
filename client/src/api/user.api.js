import api from './axios.js';

export const getProfileApi = async () =>
  (await api.get('/users/profile')).data;

export const updateProfileApi = async (formData) =>
  (await api.put('/users/profile', formData)).data;

export const changePasswordApi = async (data) =>
  (await api.put('/users/password', data)).data;

export const getAllUsersApi = async (params) =>
  (await api.get('/users', { params })).data;

export const deleteUserApi = async (id) =>
  (await api.delete(`/users/${id}`)).data;