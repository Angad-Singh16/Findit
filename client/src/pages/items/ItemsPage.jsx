import { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import useItemStore from '../../store/itemStore.js';
import ItemCard from '../../components/items/ItemCard.jsx';
import { CATEGORIES, LOCATIONS } from '../../utils/constants.js';

export default function ItemsPage() {
  const { items, loading, total, page, pages, fetchItems, searchItems, filters, setFilters, resetFilters } = useItemStore();
  const [searchQ, setSearchQ] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchItems(1);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      searchItems(searchQ, filters.type);
    } else {
      fetchItems(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQ('');
    fetchItems(1);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Items</h1>
        <p className="text-slate-400 text-sm mt-1">
          {total} item{total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQ && (
            <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <FiX size={14} />
            </button>
          )}
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-lg border font-medium transition-colors flex items-center gap-2 ${showFilters ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
        >
          <FiFilter size={16} />
          Filters
        </button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ location: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => { resetFilters(); setSearchQ(''); }}
            className="mt-3 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-slate-400">No items found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => fetchItems(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors text-sm"
          >
            ← Prev
          </button>
          <span className="text-slate-400 text-sm">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => fetchItems(page + 1)}
            disabled={page === pages}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors text-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}