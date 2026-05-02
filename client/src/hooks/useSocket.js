import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore.js';
import useNotifStore from '../store/notifStore.js';

let socket = null;

export const useSocket = () => {
  const { user, token }       = useAuthStore();
  const { addNotification,
          fetchUnreadCount }  = useNotifStore();

  useEffect(() => {
    // Connect when user is logged in
    if (user && token) {
      socket = io(
        import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
        { auth: { token } }
      );

      // Join user's private room
      socket.emit('join', user._id);

      // Listen for real-time notifications
      socket.on('notification', (data) => {
        fetchUnreadCount(); // refresh badge count
        // Optionally show a toast:
        // toast(data.message || 'New notification');
      });

      socket.on('connect_error', (err) => {
        console.warn('Socket connection error:', err.message);
      });
    }

    // Disconnect on logout or unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [user, token]);

  return socket;
};

export default useSocket;