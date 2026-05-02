import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import { ITEM_STATUS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import { getImageUrl } from '../../utils/formatImage.js';

export default function ItemCard({ item }) {
  const status = ITEM_STATUS[item.status] || ITEM_STATUS.open;

  return (
    <Link
      to={`/items/${item._id}`}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-slate-900/50 group"
    >
      {/* Image */}
      <div className="relative h-40 bg-slate-800 overflow-hidden">
        <img
          src={item.image_urls?.[0] ? getImageUrl(item.image_urls[0]) : '/placeholder.png'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = '/placeholder.png'; }}
        />
        {/* Type badge */}
        <div className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${
          item.type === 'lost'
            ? 'bg-red-500/90 text-white'
            : 'bg-green-500/90 text-white'
        }`}>
          {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
        </div>
        {/* Status badge */}
        <div className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-slate-500 mb-1">
          {item.category?.icon} {item.category?.name}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2">
          {item.title}
        </h3>

        {/* Meta */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <FiMapPin size={11} />
            <span className="truncate">{item.location?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <FiCalendar size={11} />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}