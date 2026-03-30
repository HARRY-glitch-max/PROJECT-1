import apiClient from "./client";

/**
 * All paths below are relative to the baseURL defined in client.js ('/api').
 * These functions handle communication with the Backend Chat Controller.
 */

/**
 * ✅ Fetch all unique conversations for the sidebar (Inbox style)
 * Returns an array of objects containing: 
 * { otherUser: { _id, name, companyName }, lastMessage: string, lastMessageAt: date }
 */
export const getUserChats = async (userId) => {
  try {
    const { data } = await apiClient.get(`/chats/user/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching inbox:", error);
    throw error;
  }
};

/**
 * ✅ Fetch full message history between two specific users
 * Used by ChatPage.jsx to populate the message bubbles.
 */
export const getChatHistory = async (senderId, receiverId) => {
  try {
    const { data } = await apiClient.get(`/chats/history/${senderId}/${receiverId}`);
    return data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

/**
 * ✅ Alias for getChatHistory 
 * This ensures compatibility with the 'import { getMessages }' statement in ChatPage.jsx.
 */
export const getMessages = getChatHistory;

/**
 * ✅ Send a new message
 * @param {Object} payload - { senderId, receiverId, message, senderType }
 */
export const sendMessage = async (payload) => {
  try {
    const { data } = await apiClient.post("/chats", payload);
    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * ✅ Mark messages as read (Optional but recommended for Sidebar badges)
 * Call this when a user clicks on a conversation in the sidebar.
 */
export const markAsRead = async (userId, senderId) => {
  try {
    const { data } = await apiClient.put(`/chats/read/${userId}/${senderId}`);
    return data;
  } catch (error) {
    console.warn("Could not mark messages as read");
    return null;
  }
};