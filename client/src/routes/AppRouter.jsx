import { Routes, Route, Navigate } from 'react-router-dom';

// Pages - Auth
import LoginPage    from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

// Pages - Main
import HomePage       from '../pages/home/HomePage.jsx';
import ItemsPage      from '../pages/items/ItemsPage.jsx';
import ItemDetailPage from '../pages/items/ItemDetailPage.jsx';
import ReportItemPage from '../pages/items/ReportItemPage.jsx';
import MyClaimsPage   from '../pages/claims/MyClaimsPage.jsx';
import ChatPage       from '../pages/chat/ChatPage.jsx';
import ProfilePage    from '../pages/profile/ProfilePage.jsx';

// Pages - Admin
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminItems     from '../pages/admin/AdminItems.jsx';
import AdminClaims    from '../pages/admin/AdminClaims.jsx';
import AdminUsers     from '../pages/admin/AdminUsers.jsx';

// Pages - Misc
import NotFoundPage from '../pages/NotFoundPage.jsx';

// Route Guards
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute     from './AdminRoute.jsx';

// Layout
import MainLayout from '../components/layout/MainLayout.jsx';

export default function AppRouter() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Protected Routes (login required) ──────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/"             element={<HomePage />} />
          <Route path="/items"        element={<ItemsPage />} />
          <Route path="/items/:id"    element={<ItemDetailPage />} />
          <Route path="/report"       element={<ReportItemPage />} />
          <Route path="/my-claims"    element={<MyClaimsPage />} />
          <Route path="/chat"         element={<ChatPage />} />
          <Route path="/profile"      element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Admin Routes ────────────────────────────── */}
      <Route element={<AdminRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/admin"              element={<AdminDashboard />} />
          <Route path="/admin/items"        element={<AdminItems />} />
          <Route path="/admin/claims"       element={<AdminClaims />} />
          <Route path="/admin/users"        element={<AdminUsers />} />
        </Route>
      </Route>

      {/* ── Fallback ────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}