import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import useAuthStore from '../../store/authStore.js';
import useNotifStore from '../../store/notifStore.js';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount }  = useNotifStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/',          label: 'Home' },
    { to: '/items',     label: 'Browse' },
    { to: '/report',    label: 'Report' },
    { to: '/my-claims', label: 'My Claims' },
    { to: '/chat',      label: 'Chatbot' },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-white text-lg">FindIt</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-purple-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Link to="/profile" className="relative p-2 text-slate-400 hover:text-white">
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <FiUser size={16} className="text-slate-400" />
                <span className="text-sm text-slate-300 hidden md:block">{user?.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <FiLogOut size={18} />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-slate-400"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}