// src/utils/formatImage.js
export const getImageUrl = (path) => {
    if (!path) return '/placeholder.png';
    // Cloudinary URLs already start with https://
    if (path.startsWith('http')) return path;
    // Fallback for any old local paths
    const BASE_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    return `${BASE_URL}${path}`;
};