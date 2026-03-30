import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserChats } from "../../api/chat";
import { Search, MessageSquare, Loader2 } from "lucide-react";

const ChatSidebar = () => {
  const { user } = useContext(AuthContext);
  const { receiverId: activeId } = useParams();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchConversations = useCallback(async (showLoading = false) => {
    if (!user?._id) return;
    try {
      if (showLoading) setLoading(true);
      const data = await getUserChats(user._id);
      // Helpful log to see if IDs are objects or strings
      console.log("Chat Data:", data); 
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to load sidebar conversations.");
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchConversations(true);
    const interval = setInterval(() => fetchConversations(false), 10000); 
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // ✅ FIX: Robust helper to identify the other participant
  const getOtherUser = (chat) => {
    if (!chat || !user?._id) return null;

    // Convert both to strings to avoid Object vs String comparison bugs
    const senderIdStr = (chat.senderId?._id || chat.senderId || "").toString();
    const currentUserIdStr = user._id.toString();

    // If I sent it, the "other user" is the receiver. Otherwise, it's the sender.
    return senderIdStr === currentUserIdStr ? chat.receiverId : chat.senderId;
  };

  const filteredChats = conversations.filter((chat) => {
    const otherUser = getOtherUser(chat);
    if (!otherUser || !otherUser.name) return false;
    
    const search = searchTerm.toLowerCase().trim();
    return search === "" || otherUser.name.toLowerCase().includes(search);
  });

  return (
    <div className="w-80 border-r border-slate-100 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Inbox</h2>
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {conversations.length} Chats
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-30">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p className="text-xs font-bold uppercase tracking-widest">Syncing...</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <MessageSquare size={20} />
            </div>
            <p className="text-sm font-bold text-slate-400 leading-relaxed">
              {searchTerm ? "No contacts match search" : "No active conversations"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const otherUserId = (otherUser?._id || otherUser || "").toString();
            const isActive = activeId === otherUserId;

            return (
              <div
                key={chat._id}
                onClick={() => navigate(`/jobseeker/dashboard/messages/${otherUserId}?name=${encodeURIComponent(otherUser.name)}`)}
                className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 relative ${
                  isActive 
                    ? "bg-blue-600 shadow-lg shadow-blue-100" 
                    : "hover:bg-slate-50"
                }`}
              >
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-900 text-white"
                }`}>
                  {otherUser.name?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isActive ? "text-white" : "text-slate-900"}`}>
                    {otherUser.name || "Unknown User"}
                  </p>
                  <p className={`text-xs truncate font-medium ${isActive ? "text-white/70" : "text-slate-500"}`}>
                    {chat.message || "New conversation"}
                  </p>
                </div>

                {isActive && (
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-white rounded-r-full" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;