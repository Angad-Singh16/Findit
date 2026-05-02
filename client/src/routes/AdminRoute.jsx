import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function AdminRoute() {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}