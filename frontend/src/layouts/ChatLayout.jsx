import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, Outlet, useLocation } from "react-router-dom";
import { getUserChats } from "../api/chat";
import { AuthContext } from "../contexts/AuthContext";
import { MessageSquare, Search, Loader2 } from "lucide-react";

const ChatLayout = () => {
  const { user } = useContext(AuthContext);
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInbox = async () => {
      if (!user?._id) return;
      try {
        const data = await getUserChats(user._id);
        setConversations(data);
      } catch (err) {
        console.error("Inbox fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
    // Poll for new conversations every 10 seconds
    const interval = setInterval(fetchInbox, 10000);
    return () => clearInterval(interval);
  }, [user?._id]);

  return (
    <div className="flex h-[82vh] bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden m-2">
      {/* --- Sidebar --- */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/10">
        <div className="p-5 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-black text-slate-800 mb-4">Messages</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-10 text-center opacity-40">
              <MessageSquare className="mx-auto mb-2" size={32} />
              <p className="text-xs font-bold uppercase">No chats yet</p>
            </div>
          ) : (
            conversations.map((chat) => {
              const contact = chat.otherUser; 
              const isActive = receiverId === contact?._id;

              return (
                <div
                  key={chat._id}
                  onClick={() => navigate(`/jobseeker/dashboard/messages/${contact._id}?name=${encodeURIComponent(contact.name || contact.companyName)}`)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-l-4 ${
                    isActive 
                      ? "bg-blue-50/50 border-blue-600" 
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-bold shadow-sm">
                    {(contact.name || contact.companyName)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-slate-800 truncate text-sm">
                        {contact.name || contact.companyName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- Main Chat Window --- */}
      <div className="flex-1 bg-white relative">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;