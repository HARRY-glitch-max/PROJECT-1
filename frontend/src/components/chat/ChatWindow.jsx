import React, { useState, useEffect } from "react";
import { getChatHistory, sendMessage } from "../../api/chat";

const ChatWindow = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getChatHistory(senderId, receiverId);
      setMessages(data);
    };
    if (receiverId) fetchMessages();
  }, [senderId, receiverId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const newMsg = await sendMessage({ senderId, receiverId, message: text });
    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-2 rounded">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 ${
              msg.senderId === senderId ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block px-2 py-1 rounded bg-blue-100">
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
