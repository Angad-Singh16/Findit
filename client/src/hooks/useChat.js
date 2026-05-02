import useChatStore from '../store/chatStore.js';

export const useChat = () => {
  return useChatStore();
};

export default useChat;