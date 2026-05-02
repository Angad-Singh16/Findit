import { create } from 'zustand';
import {
  startSessionApi, getMySessionsApi,
  getSessionByIdApi, sendMessageApi,
  closeSessionApi,
} from '../api/chat.api.js';

const useChatStore = create((set, get) => ({
  sessions:       [],
  currentSession: null,
  loading:        false,
  sending:        false,

  // Start a new session
  startSession: async () => {
    set({ loading: true });
    const data = await startSessionApi();
    set({ currentSession: data.session, loading: false });
    return data.session;
  },

  // Get all sessions
  fetchSessions: async () => {
    set({ loading: true });
    const data = await getMySessionsApi();
    set({ sessions: data.sessions, loading: false });
  },

  // Load a session by ID
  loadSession: async (id) => {
    set({ loading: true });
    const data = await getSessionByIdApi(id);
    set({ currentSession: data.session, loading: false });
  },

  // Send message + append bot reply
  sendMessage: async (content) => {
    const session = get().currentSession;
    if (!session) return;

    set({ sending: true });
    const data = await sendMessageApi(session._id, content);

    set((state) => ({
      sending: false,
      currentSession: {
        ...state.currentSession,
        messages: [
          ...state.currentSession.messages,
          data.userMessage,
          data.botMessage,
        ],
      },
    }));

    return data;
  },

  // Close session
  closeSession: async () => {
    const session = get().currentSession;
    if (!session) return;
    await closeSessionApi(session._id);
    set((state) => ({
      currentSession: { ...state.currentSession, status: 'closed' },
    }));
  },
}));

export default useChatStore;