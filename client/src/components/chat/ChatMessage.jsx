import { Link } from 'react-router-dom';
import { timeAgo } from '../../utils/formatDate.js';

export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}>
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1">
          🤖
        </div>
      )}

      <div className="max-w-xs lg:max-w-md space-y-1.5">
        {/* Bubble */}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-slate-800 text-slate-200 rounded-bl-sm'
        }`}>
          {message.content}
        </div>

        {/* Suggested items from bot */}
        {message.suggested_items?.length > 0 && (
          <div className="space-y-1 pl-1">
            <p className="text-xs text-slate-500">Suggested:</p>
            {message.suggested_items.map((id) => (
              <Link key={id} to={`/items/${id}`}
                className="block text-xs bg-slate-700 hover:bg-slate-600 border border-slate-600 text-blue-300 px-3 py-2 rounded-lg transition-colors">
                🔗 View Item →
              </Link>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={`text-xs text-slate-600 ${isUser ? 'text-right' : 'text-left'}`}>
          {timeAgo(message.sent_at)}
        </p>
      </div>
    </div>
  );
}