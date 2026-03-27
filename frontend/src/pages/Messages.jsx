import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import { getUserChats, getChatHistory, sendMessage } from '../api/chat'; // ✅ include sendMessage
import { Send, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Messages = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef();

  // Load sidebar conversations (inbox style)
  useEffect(() => {
    const loadChats = async () => {
      const data = await getUserChats(user._id);
      setConversations(data);
    };
    if (user?._id) loadChats();
  }, [user?._id]);

  // Load messages when a contact is clicked
  useEffect(() => {
    if (activeChat) {
      const loadMessages = async () => {
        const data = await getChatHistory(user._id, activeChat._id);
        setMessages(data);
      };
      loadMessages();
    }
  }, [activeChat, user._id]);

  // Listen for real-time messages via Socket
  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (message) => {
        if (
          message.senderId === activeChat?._id ||
          message.receiverId === activeChat?._id
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
    return () => socket?.off("receive_message");
  }, [socket, activeChat]);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Persist + emit new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      receiverId: activeChat._id,
      senderId: user._id,
      message: newMessage, // match backend schema
    };

    // Save to DB
    const savedMsg = await sendMessage(messageData);

    // Emit to socket for real-time delivery
    socket.emit("send_message", savedMsg);

    // Update local state immediately
    setMessages((prev) => [...prev, savedMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Sidebar: Contact List */}
      <div className="w-1/4 border-r overflow-y-auto bg-slate-50">
        <div className="p-4 font-bold text-lg border-b bg-white">Messages</div>
        {conversations.map((conv) => (
          <div 
            key={conv._id}
            onClick={() => setActiveChat(conv)}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-blue-50 border-b ${
              activeChat?._id === conv._id ? 'bg-blue-50 border-r-4 border-r-blue-600' : ''
            }`}
          >
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={20}/>
            </div>
            <div className="flex-1 truncate">
              <p className="font-semibold text-sm">{conv.name}</p>
              <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b font-bold flex items-center gap-3 shadow-sm">
               <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-xs">
                 {activeChat.name[0]}
               </div>
               {activeChat.name}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.senderId === user._id
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border rounded-tl-none text-slate-800'
                  }`}>
                    {msg.message || msg.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2 bg-white">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
