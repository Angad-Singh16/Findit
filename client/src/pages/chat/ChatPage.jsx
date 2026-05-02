import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSend, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useChatStore from '../../store/chatStore.js';
import { timeAgo } from '../../utils/formatDate.js';

export default function ChatPage() {
  const {
    currentSession, sessions,
    startSession, fetchSessions,
    loadSession, sendMessage,
    closeSession, loading, sending,
  } = useChatStore();

  const [input, setInput]         = useState('');
  const [showSessions, setShowSessions] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  const handleStart = async () => {
    try {
      await startSession();
    } catch {
      toast.error('Could not start session.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const msg = input.trim();
    setInput('');
    try {
      await sendMessage(msg);
    } catch {
      toast.error('Failed to send message.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'I lost my wallet near the library 👜',
    'I found a set of keys in Block A 🔑',
    'Looking for my blue water bottle 🍶',
    'How do I claim a found item? 📦',
  ];

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">

      {/* Sessions Sidebar */}
      <div className={`${showSessions ? 'flex' : 'hidden'} md:flex flex-col w-64 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-shrink-0`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <span className="font-semibold text-white text-sm">Sessions</span>
          <button
            onClick={handleStart}
            className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <FiPlus size={12} /> New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-4">No sessions yet</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s._id}
                onClick={() => { loadSession(s._id); setShowSessions(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors ${
                  currentSession?._id === s._id
                    ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-medium text-slate-300 truncate">
                  {s.messages?.[0]?.content?.slice(0, 30) || 'New session'}...
                </div>
                <div className="text-slate-500 mt-0.5">{timeAgo(s.createdAt)}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              ☰
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
              🤖
            </div>
            <div>
              <div className="font-semibold text-white text-sm">FindIt Assistant</div>
              <div className="text-xs text-green-400">● Online</div>
            </div>
          </div>
          {currentSession?.status === 'active' && (
            <button
              onClick={closeSession}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <FiX size={14} /> End Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentSession ? (
            /* No session — welcome screen */
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="text-5xl">🤖</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">FindIt Assistant</h2>
                <p className="text-slate-400 text-sm max-w-xs">
                  I can help you search for lost items, report found items, or guide you through claiming.
                </p>
              </div>
              <button
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Start a Conversation
              </button>
              {/* Quick prompts */}
              <div className="w-full max-w-sm space-y-2">
                <p className="text-xs text-slate-500">Try asking:</p>
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={async () => { await startSession(); }}
                    className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages list */
            <>
              {currentSession.messages?.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot avatar */}
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                      🤖
                    </div>
                  )}

                  <div className={`max-w-xs lg:max-w-md space-y-2`}>
                    {/* Bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>

                    {/* Suggested items */}
                    {msg.suggested_items?.length > 0 && (
                      <div className="space-y-1.5 pl-1">
                        <p className="text-xs text-slate-500">Suggested items:</p>
                        {msg.suggested_items.map((id) => (
                          <Link
                            key={id}
                            to={`/items/${id}`}
                            className="block text-xs bg-slate-700 hover:bg-slate-600 border border-slate-600 text-blue-300 px-3 py-2 rounded-lg transition-colors"
                          >
                            🔗 View Item →
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-xs text-slate-600 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {timeAgo(msg.sent_at)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Sending indicator */}
              {sending && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs mr-2">🤖</div>
                  <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        {currentSession && currentSession.status === 'active' && (
          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Enter to send)"
                rows={1}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors flex-shrink-0"
              >
                <FiSend size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        )}

        {currentSession?.status === 'closed' && (
          <div className="p-4 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm mb-3">This session has ended.</p>
            <button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}