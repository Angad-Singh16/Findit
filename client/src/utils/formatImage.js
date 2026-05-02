const BASE_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const getImageUrl = (path) => {
  if (!path) return '/placeholder.png';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};