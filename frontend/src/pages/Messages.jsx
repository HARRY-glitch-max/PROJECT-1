import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { getUserChats, getChatHistory, sendMessage } from '../api/chat';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Messages = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const scrollRef = useRef();

  // Unified ID extraction - Essential for Employer/JobSeeker distinction
  const currentUserId = user?.employerId || user?.userId || user?._id;

  // ✅ 1. Auto-select first chat
  useEffect(() => {
    if (conversations.length > 0 && !activeChat) {
      const first = conversations[0];
      const rid = first.otherUser?._id || first._id;
      setActiveChat({ ...first, _id: rid });
    }
  }, [conversations, activeChat]);

  // ✅ 2. Load chats and handle deep-linking (target params)
  useEffect(() => {
    const loadChats = async () => {
      try {
        if (!currentUserId) return;
        const data = await getUserChats(currentUserId);
        setConversations(data);

        const params = new URLSearchParams(location.search);
        const targetId = params.get('target');
        const targetName = params.get('name');

        if (targetId) {
          const existingChat = data.find(c => 
            (c.otherUser?._id === targetId || c.senderId?._id === targetId || c.receiverId?._id === targetId || c._id === targetId)
          );

          if (existingChat) {
            setActiveChat({ ...existingChat, _id: targetId });
          } else if (targetName) {
            setActiveChat({ _id: targetId, name: targetName, isNew: true });
          }
          navigate(location.pathname, { replace: true });
        }
      } catch (err) {
        console.error("❌ Error loading chats", err);
      }
    };
    loadChats();
  }, [currentUserId, location.search, navigate]);

  // ✅ 3. Load message history
  useEffect(() => {
    const recipientId = activeChat?.otherUser?._id || activeChat?._id;
    if (recipientId && !activeChat.isNew) {
      const loadMessages = async () => {
        try {
          const data = await getChatHistory(currentUserId, recipientId);
          setMessages(data);
        } catch (err) {
          console.error("❌ Error fetching history", err);
        }
      };
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeChat, currentUserId]);

  // ✅ 4. Socket real-time listener
  useEffect(() => {
    if (socket && activeChat) {
      const recipientId = activeChat.otherUser?._id || activeChat._id;
      const handleReceive = (message) => {
        const isRelevant = message.senderId === recipientId || message.receiverId === recipientId;
        if (isRelevant) {
          setMessages(prev => [...prev, message]);
        }
      };
      socket.on("receive_message", handleReceive);
      return () => socket.off("receive_message", handleReceive);
    }
  }, [socket, activeChat]);

  // ✅ 5. Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 6. SEND MESSAGE LOGIC
  const handleSendMessage = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
    }
    
    // THE ULTIMATE CONSOLE CHECK
    console.log("🔥 CLICK REGISTERED AT:", new Date().toLocaleTimeString());

    const recipientId = activeChat?.otherUser?._id || activeChat?._id;

    if (sending || !newMessage.trim() || !recipientId || !currentUserId) {
      console.warn("⚠️ Validation Failed:", { sending, recipientId, currentUserId });
      return;
    }

    const messageData = {
      receiverId: recipientId,
      senderId: currentUserId,
      message: newMessage.trim(),
      senderType: user?.employerId ? "Employer" : "JobSeeker"
    };

    try {
      setSending(true);
      const savedMsg = await sendMessage(messageData);
      
      setMessages(prev => [...prev, savedMsg]);
      setNewMessage('');

      if (socket) {
        socket.emit("send_message", savedMsg);
      }

      if (activeChat.isNew) {
        const updatedChats = await getUserChats(currentUserId);
        setConversations(updatedChats);
        setActiveChat(prev => ({ ...prev, isNew: false }));
      }
    } catch (err) {
      console.error("❌ API FAILURE:", err.response?.data || err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-1/4 border-r overflow-y-auto bg-slate-50 flex flex-col shrink-0">
        <div className="p-6 font-bold text-xl border-b bg-white sticky top-0 z-10">Inbox</div>
        <div className="flex-1">
          {conversations.map((conv) => {
            const rid = conv.otherUser?._id || conv._id;
            const isActive = activeChat?._id === rid;
            return (
              <div
                key={conv._id}
                onClick={() => setActiveChat({ ...conv, _id: rid })}
                className={`p-4 flex items-center gap-3 cursor-pointer border-b transition-all ${
                  isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                  {(conv.otherUser?.name?.[0] || conv.name?.[0] || 'U').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{conv.otherUser?.name || conv.name || "User"}</p>
                  <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {conv.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 relative min-w-0">
        {activeChat ? (
          <>
            <div className="p-4 border-b font-bold bg-white shadow-sm z-20 flex items-center gap-2 shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="truncate">{activeChat.otherUser?.name || activeChat.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg, index) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 px-4 rounded-2xl text-sm shadow-sm max-w-[80%] break-words ${
                      isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} className="h-2" />
            </div>

            {/* --- THE FIX: FORCED INTERACTION LAYER --- */}
            <div className="p-4 bg-white border-t relative z-[100] isolate">
              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center max-w-4xl mx-auto"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-slate-100 rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 pr-16 text-slate-900 border-none shadow-inner"
                />
                <button
                  type="submit"
                  // Explicit onClick to bypass any form blocking
                  onClick={(e) => {
                    if (newMessage.trim()) handleSendMessage(e);
                  }}
                  disabled={sending || !newMessage.trim()}
                  className="absolute right-2 bg-blue-600 text-white p-3 rounded-full disabled:opacity-30 hover:bg-blue-700 active:scale-90 transition-all z-[110] cursor-pointer shadow-md"
                >
                  <Send size={20} className="pointer-events-none" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <MessageSquare size={48} className="opacity-10" />
            </div>
            <h3 className="font-bold text-slate-600">No Chat Selected</h3>
            <p className="text-sm max-w-xs mt-2">Choose a conversation from the sidebar to start messaging candidates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;