import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrash2, FiExternalLink } from 'react-icons/fi';
import useItemStore from '../../store/itemStore.js';
import { ITEM_STATUS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';

export default function AdminItems() {
  const {
    items, loading, total, page, pages,
    fetchItems, filters, setFilters,
    updateStatus, deleteItem,
  } = useItemStore();

  useEffect(() => { fetchItems(1); }, [filters]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item permanently?')) return;
    try {
      await deleteItem(id);
      toast.success('Item deleted.');
    } catch {
      toast.error('Failed to delete item.');
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateStatus(id, status);
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Items</h1>
          <p className="text-slate-400 text-sm mt-1">{total} total items</p>
        </div>
        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value })}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value })}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="claimed">Claimed</option>
            <option value="resolved">Resolved</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="pb-3 text-xs text-slate-500 font-medium">Title</th>
                <th className="pb-3 text-xs text-slate-500 font-medium">Type</th>
                <th className="pb-3 text-xs text-slate-500 font-medium">Category</th>
                <th className="pb-3 text-xs text-slate-500 font-medium">Reporter</th>
                <th className="pb-3 text-xs text-slate-500 font-medium">Status</th>
                <th className="pb-3 text-xs text-slate-500 font-medium">Date</th>
                <th className="pb-3 text-xs text-slate-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {items.map((item) => {
                const s = ITEM_STATUS[item.status] || ITEM_STATUS.open;
                return (
                  <tr key={item._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-200 font-medium truncate max-w-[160px]">
                          {item.title}
                        </span>
                        <Link to={`/items/${item._id}`} className="text-blue-400 hover:text-blue-300 flex-shrink-0">
                          <FiExternalLink size={12} />
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.type === 'lost'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">
                      {item.category?.icon} {item.category?.name}
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">
                      {item.user_id?.name || '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatus(item._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-lg border bg-transparent cursor-pointer ${s.color}`}
                      >
                        {Object.entries(ITEM_STATUS).map(([k, v]) => (
                          <option key={k} value={k} className="bg-slate-800 text-white">{v.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <button onClick={() => fetchItems(page - 1)} disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-700 text-sm transition-colors">
                ← Prev
              </button>
              <span className="text-slate-400 text-sm">Page {page} of {pages}</span>
              <button onClick={() => fetchItems(page + 1)} disabled={page === pages}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-700 text-sm transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}