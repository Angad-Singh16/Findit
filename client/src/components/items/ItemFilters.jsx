import { CATEGORIES, LOCATIONS } from '../../utils/constants.js';

export default function ItemFilters({ filters, onChange, onReset }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Type */}
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Type</label>
          <select
            value={filters.type || ''}
            onChange={(e) => onChange({ type: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            value={filters.category || ''}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            value={filters.location || ''}
            onChange={(e) => onChange({ location: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="mt-3 text-xs text-slate-400 hover:text-white transition-colors"
        >
          ✕ Clear all filters
        </button>
      )}
    </div>
  );
}