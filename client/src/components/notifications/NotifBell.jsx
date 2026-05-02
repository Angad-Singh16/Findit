import { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import useNotifStore from '../../store/notifStore.js';
import NotifList from './NotifList.jsx';

export default function NotifBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { unreadCount, fetchNotifications, fetchUnreadCount } = useNotifStore();

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen((p) => !p);
    if (!open) fetchNotifications();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <NotifList onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}