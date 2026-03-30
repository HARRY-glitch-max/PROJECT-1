import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Send, MessageSquare, Loader2, Info, CheckCircle2 } from "lucide-react";
import { getMessages, sendMessage } from "../api/chat";
import { AuthContext } from "../contexts/AuthContext";

const ChatPage = () => {
  const { user, role } = useContext(AuthContext);
  const { receiverId: routeReceiverId } = useParams();
  const location = useLocation();
  
  // Parse name from URL or navigation state
  const searchParams = new URLSearchParams(location.search);
  const queryName = searchParams.get("name");

  // Logic to prevent "messages" from being treated as a valid ID during routing
  const isIdValid = routeReceiverId && routeReceiverId !== "messages" && routeReceiverId.length >= 24; 
  const receiverId = isIdValid ? routeReceiverId : null;
  
  const [displayName, setDisplayName] = useState(queryName || "Conversation");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync Header Name when switching chats in the sidebar
  useEffect(() => {
    if (queryName) {
      setDisplayName(queryName);
    } else if (location.state?.receiverName) {
      setDisplayName(location.state.receiverName);
    } else if (!receiverId) {
      setDisplayName("Conversation");
    }
  }, [queryName, receiverId, location.state]);

  const fetchMessages = useCallback(async (showLoading = false) => {
    if (!receiverId || !user?._id) return;

    try {
      if (showLoading) setLoading(true);
      const data = await getMessages(user._id, receiverId);
      setMessages(data || []);
    } catch (err) {
      console.error("Chat history fetch failed.");
    } finally {
      setLoading(false);
    }
  }, [receiverId, user?._id]);

  // Handle auto-polling and initial fetch
  useEffect(() => {
    if (!receiverId) {
      setMessages([]); 
      return;
    }

    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 4000);
    return () => clearInterval(interval);
  }, [fetchMessages, receiverId]);

  // Force scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTextareaChange = (e) => {
    setNewMsg(e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!newMsg.trim() || !receiverId || !user?._id) return;
    
    const messageText = newMsg.trim();
    setNewMsg(""); 
    
    try {
      const msgData = await sendMessage({
        senderId: user._id,
        receiverId,
        message: messageText,
        senderType: role === "employer" ? "Employer" : "JobSeeker"
      });
      
      setMessages((prev) => [...prev, msgData]);
      if (textareaRef.current) textareaRef.current.style.height = 'inherit';
    } catch (err) {
      console.error("Error sending message:", err);
      setNewMsg(messageText); // Restore on failure
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 1. Empty State (No Chat Selected)
  if (!receiverId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-white animate-in fade-in duration-700">
        <div className="bg-blue-50/50 p-12 rounded-[4rem] mb-8 border border-blue-50 shadow-inner">
          <MessageSquare size={80} className="text-blue-600/30" strokeWidth={1.2} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Your Inbox</h3>
        <p className="text-slate-500 max-w-xs text-center mt-3 font-medium leading-relaxed">
          Select a contact from the sidebar to view your message history.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-100 uppercase transition-transform hover:scale-105">
            {displayName?.charAt(0)}
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-xl leading-tight truncate max-w-[300px]">
              {displayName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">Live Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Message History */}
      <div 
        ref={scrollRef} 
        className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50/20 custom-scrollbar"
      >
        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading encrypted chat...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-10">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-5">
               <Info size={36} className="text-blue-500" />
            </div>
            <p className="text-xl font-black text-slate-900">Start the conversation</p>
            <p className="text-sm font-medium text-slate-500 mt-2">Introduce yourself to {displayName} to begin networking.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isSender = String(msg.senderId) === String(user._id);
            return (
              <div key={msg._id || idx} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] group`}>
                  <div className={`px-6 py-4 rounded-[2rem] text-[15px] font-medium leading-relaxed transition-all shadow-sm ${
                    isSender 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}>
                    {msg.message}
                  </div>
                  <div className={`flex items-center gap-2 mt-2 px-1 ${isSender ? "justify-end" : "justify-start"}`}>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {isSender && <CheckCircle2 size={12} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-end gap-3 bg-slate-50 p-3 rounded-[2.5rem] border border-slate-200 focus-within:bg-white focus-within:ring-8 focus-within:ring-blue-50/50 focus-within:border-blue-400 transition-all duration-500 shadow-inner">
          <textarea
            ref={textareaRef}
            value={newMsg}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyPress}
            rows={1}
            placeholder={`Message ${displayName}...`}
            className="flex-1 bg-transparent resize-none p-3 text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none min-h-[48px] max-h-40 custom-scrollbar"
          />
          <button
            type="submit"
            disabled={!newMsg.trim()}
            className="w-12 h-12 bg-blue-600 rounded-full text-white hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all disabled:opacity-10 disabled:grayscale shadow-xl shadow-blue-200 flex items-center justify-center flex-shrink-0 mb-0.5"
          >
            <Send size={18} strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;