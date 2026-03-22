import apiClient from './client';

// Fetch all conversations for the sidebar
export const getConversations = async () => {
  const { data } = await apiClient.get('/chat/conversations');
  return data;
};

// Fetch messages for a specific chat
export const getMessages = async (receiverId) => {
  const { data } = await apiClient.get(`/chat/messages/${receiverId}`);
  return data;
};