import apiClient from "./client";

// ✅ Fetch all chats for a user (inbox style, for sidebar)
export const getUserChats = async (userId) => {
  const { data } = await apiClient.get(`/api/chats/user/${userId}`);
  return data;
};

// ✅ Fetch messages between two users (conversation view)
export const getChatHistory = async (senderId, receiverId) => {
  const { data } = await apiClient.get(
    `/api/chats/history/${senderId}/${receiverId}`
  );
  return data;
};

// ✅ Alias for getChatHistory so ChatPage.jsx can import getMessages
export const getMessages = getChatHistory;

// ✅ Send a new message
export const sendMessage = async (payload) => {
  const { data } = await apiClient.post("/api/chats", payload);
  return data;
};
