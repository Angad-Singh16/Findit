import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiSearch, FiMessageSquare, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import useAuthStore from '../../store/authStore.js';
import useItemStore from '../../store/itemStore.js';
import ItemCard from '../../components/items/ItemCard.jsx';

export default function HomePage() {
  const { user } = useAuthStore();
  const { items, fetchItems, loading } = useItemStore();
  const [lostCount,  setLostCount]  = useState(0);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    fetchItems(1);
    // Fetch counts
    (async () => {
      const { getAllItemsApi } = await import('../../api/item.api.js');
      try {
        const [lost, found] = await Promise.all([
          getAllItemsApi({ type: 'lost',  status: 'open', limit: 1 }),
          getAllItemsApi({ type: 'found', status: 'open', limit: 1 }),
        ]);
        setLostCount(lost.total);
        setFoundCount(found.total);
      } catch {}
    })();
  }, []);

  const actions = [
    { to: '/report',  icon: <FiAlertCircle size={22} />,    label: 'Report Lost',  desc: 'Lost something?',    color: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' },
    { to: '/report',  icon: <FiCheckCircle size={22} />,    label: 'Report Found', desc: 'Found something?',   color: 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' },
    { to: '/items',   icon: <FiSearch size={22} />,         label: 'Browse Items', desc: 'Search all items',   color: 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' },
    { to: '/chat',    icon: <FiMessageSquare size={22} />,  label: 'Ask Chatbot',  desc: 'Get help instantly', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20' },
  ];

  return (
    <div className="space-y-8">

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white">
          Hey {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Welcome to <span className="text-blue-400 font-semibold">FindIt</span> — your campus lost & found portal.
        </p>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{lostCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Lost Items</div>
          </div>
          <div className="w-px bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{foundCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Found Items</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${a.color}`}
            >
              {a.icon}
              <span className="font-semibold text-sm">{a.label}</span>
              <span className="text-xs opacity-70">{a.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Recent Items</h2>
          <Link to="/items" className="text-blue-400 hover:text-blue-300 text-sm">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <div className="text-4xl mb-2">📭</div>
            No items reported yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.slice(0, 6).map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}