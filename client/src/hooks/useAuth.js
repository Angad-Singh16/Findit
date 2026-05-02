import useAuthStore from '../store/authStore.js';

export const useAuth = () => {
  const user    = useAuthStore((s) => s.user);
  const token   = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const login   = useAuthStore((s) => s.login);
  const logout  = useAuthStore((s) => s.logout);
  const register = useAuthStore((s) => s.register);

  const isAdmin   = user?.role === 'admin';
  const isStaff   = user?.role === 'staff';
  const isStudent = user?.role === 'student';

  return {
    user, token, loading,
    login, logout, register,
    isAdmin, isStaff, isStudent,
    isLoggedIn: !!user,
  };
};

export default useAuth;