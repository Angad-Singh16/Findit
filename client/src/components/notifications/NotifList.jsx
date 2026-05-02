import useNotifStore from '../../store/notifStore.js';
import { timeAgo } from '../../utils/formatDate.js';
import { Link } from 'react-router-dom';

export default function NotifList({ onClose }) {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifStore();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <span className="font-semibold text-white text-sm">Notifications</span>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🔔</div>
            <p className="text-slate-500 text-xs">No notifications</p>
          </div>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <div
              key={n._id}
              onClick={() => { if (!n.is_read) markAsRead(n._id); onClose?.(); }}
              className={`px-4 py-3 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                !n.is_read ? 'bg-blue-500/5' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!n.is_read ? 'bg-blue-400' : 'bg-transparent'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${n.is_read ? 'text-slate-500' : 'text-slate-200'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <Link
        to="/profile"
        onClick={onClose}
        className="block text-center py-3 text-xs text-blue-400 hover:text-blue-300 border-t border-slate-800 transition-colors"
      >
        View all notifications →
      </Link>
    </div>
  );
}