import React, { useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext";
import { Send, User, Loader2, CheckCheck } from "lucide-react";
import axios from "axios";

// 1. Ensure this points to your BACKEND port (5000), not frontend (5173)
const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket", "polling"]
});

const ChatWindow = ({ receiverId, receiverName, receiverAvatar }) => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (!user?._id || !receiverId) return;

    // Join room (Matches your server.js: socket.on("join", ...))
    socket.emit("join", user._id);

    const loadMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // FIX: Removed extra '/api' if your axios base instance already includes it.
        // If your base URL is 'http://localhost:5000/api', use `/chats/...`
        // Given your logs showed /api/api/chats, we use:
        const { data } = await axios.get(`/chats/${user._id}/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChatHistory(data);
      } catch (err) {
        console.error("History Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Listen for real-time updates
    socket.on("receive_message", (data) => {
      // Logic check: only add if the message is relevant to this specific open chat
      if (data.senderId === receiverId || (data.senderId === user._id && data.receiverId === receiverId)) {
        setChatHistory((prev) => [...prev, data]);
      }
    });

    socket.on("display_typing", ({ isTyping }) => {
      setIsTyping(isTyping);
    });

    return () => {
      socket.off("receive_message");
      socket.off("display_typing");
    };
  }, [user?._id, receiverId]); // Hook triggers only when user or chat partner changes

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      senderId: user._id,
      receiverId: receiverId,
      message: message, 
      senderType: user.role, // "JobSeeker" or "Employer" - needed for your dynamic backend lookup
    };

    socket.emit("send_message", messageData);
    setMessage("");
    
    // Immediately tell receiver we stopped typing
    socket.emit("typing", { receiverId, isTyping: false });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { 
      receiverId, 
      isTyping: e.target.value.length > 0 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[500px] w-full bg-slate-50 rounded-3xl border border-slate-200">
        <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
        <p className="text-slate-400 text-sm font-medium">Loading your conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {receiverAvatar ? (
              <img src={receiverAvatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-sm">
                {receiverName?.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{receiverName}</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active</span>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
        {chatHistory.map((msg, index) => {
          const isMe = msg.senderId === user._id;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className={`p-3 rounded-2xl text-sm shadow-sm transition-all ${
                  isMe 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                }`}>
                  {msg.message}
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </span>
                  {isMe && <CheckCheck size={12} className="text-blue-400" />}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Animated Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Write something..."
          className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 text-sm transition-all outline-none"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          disabled={!message.trim()}
          className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-40 disabled:shadow-none"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;