import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';

export default function ChatWindow({ messages = [], sending = false }) {
  const bottomRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}

      {/* Typing indicator */}
      {sending && (
        <div className="flex justify-start gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">
            🤖
          </div>
          <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm">
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}