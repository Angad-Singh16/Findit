import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';
import Spinner from '../components/ui/Spinner.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  // Still restoring auth from localStorage
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not logged in → redirect to login, save intended path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}