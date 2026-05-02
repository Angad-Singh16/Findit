import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiUsers, FiCheckSquare, FiGitMerge } from 'react-icons/fi';
import { getAllItemsApi } from '../../api/item.api.js';
import { getAllClaimsApi } from '../../api/claim.api.js';
import { getAllUsersApi } from '../../api/user.api.js';
import { formatDate } from '../../utils/formatDate.js';
import { CLAIM_STATUS } from '../../utils/constants.js';

export default function AdminDashboard() {
  const [stats, setStats]           = useState({ items: 0, claims: 0, users: 0 });
  const [pendingClaims, setPending] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [items, claims, users, pending] = await Promise.all([
          getAllItemsApi({ limit: 1 }),
          getAllClaimsApi({ limit: 1 }),
          getAllUsersApi({ limit: 1 }),
          getAllClaimsApi({ status: 'pending', limit: 5 }),
        ]);
        setStats({
          items:  items.total  || 0,
          claims: claims.total || 0,
          users:  users.total  || 0,
        });
        setPending(pending.claims || []);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const statCards = [
    { label: 'Total Items',  value: stats.items,  icon: <FiPackage size={22} />,     color: 'text-blue-400',   bg: 'bg-blue-500/10',   to: '/admin/items' },
    { label: 'Total Claims', value: stats.claims, icon: <FiCheckSquare size={22} />, color: 'text-purple-400', bg: 'bg-purple-500/10', to: '/admin/claims' },
    { label: 'Total Users',  value: stats.users,  icon: <FiUsers size={22} />,       color: 'text-green-400',  bg: 'bg-green-500/10',  to: '/admin/users' },
    { label: 'Pending Claims', value: pendingClaims.length, icon: <FiGitMerge size={22} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10', to: '/admin/claims' },
  ];

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Overview of all campus lost & found activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Link key={s.label} to={s.to}
            className={`${s.bg} border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors`}>
            <div className={`${s.color} mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Pending Claims */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Pending Claims</h2>
          <Link to="/admin/claims" className="text-blue-400 hover:text-blue-300 text-sm">View all →</Link>
        </div>

        {pendingClaims.length === 0 ? (
          <div className="text-center py-10 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-slate-400 text-sm">No pending claims. All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingClaims.map((claim) => (
              <div key={claim._id}
                className="bg-slate-900 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {claim.item_id?.title || 'Item'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    By {claim.user_id?.name} · {formatDate(claim.createdAt)}
                  </p>
                </div>
                <Link to="/admin/claims"
                  className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-lg hover:bg-yellow-500/30 transition-colors flex-shrink-0">
                  Review →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Nav */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Manage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { to: '/admin/items',  label: 'Manage Items',  icon: '📦', desc: 'View, update or delete items' },
            { to: '/admin/claims', label: 'Review Claims', icon: '📋', desc: 'Approve or reject claims' },
            { to: '/admin/users',  label: 'Manage Users',  icon: '👥', desc: 'View and manage users' },
          ].map((l) => (
            <Link key={l.to} to={l.to}
              className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-5 transition-colors">
              <div className="text-2xl mb-2">{l.icon}</div>
              <div className="font-semibold text-white text-sm">{l.label}</div>
              <div className="text-xs text-slate-500 mt-1">{l.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}