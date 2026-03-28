import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Send } from "lucide-react";
import { getChatHistory, sendMessage } from "../api/chat";
import { AuthContext } from "../contexts/AuthContext";

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const { receiverId } = useParams(); // ✅ get receiverId from route
  const location = useLocation();

  // Receiver name can still be passed via state for display
  const receiverName = location.state?.receiverName || "Conversation";

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Fetch chat history
  const fetchMessages = async () => {
    if (!receiverId || !user?._id) return;
    try {
      setLoading(true);
      const data = await getChatHistory(user._id, receiverId);
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receiverId) {
      fetchMessages();
    }
  }, [receiverId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send new message
  const handleSend = async () => {
    if (!newMsg.trim() || !receiverId) return;
    try {
      const msgData = await sendMessage({
        senderId: user._id,
        receiverId,
        message: newMsg,
      });
      setMessages((prev) => [...prev, msgData]);
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If no receiver selected
  if (!receiverId) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Select an applicant to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow border">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {receiverName?.charAt(0) || "U"}
        </div>
        <div>
          <p className="font-semibold">{receiverName}</p>
          <p className="text-xs text-slate-400">Direct Chat</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50"
      >
        {loading ? (
          <p className="text-center text-slate-400">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400">No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const isSender = msg.senderId === user._id;
            return (
              <div
                key={msg._id}
                className={`flex flex-col max-w-xs ${
                  isSender ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl ${
                    isSender
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-900"
                  }`}
                >
                  {msg.message}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-4 border-t border-slate-200">
        <textarea
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          placeholder="Type your message..."
          className="flex-1 resize-none p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
