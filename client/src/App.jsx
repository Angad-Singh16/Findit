import { useEffect } from 'react';
import { useSocket } from './hooks/useSocket.js';
import AppRouter from './routes/AppRouter.jsx';
import useAuthStore from './store/authStore.js';

export default function App() {
  const restoreAuth = useAuthStore((s) => s.restoreAuth);

  // Connect Socket.IO globally when user is logged in
  useSocket();

  useEffect(() => {
    restoreAuth();
  }, []);

  return <AppRouter />;
}
