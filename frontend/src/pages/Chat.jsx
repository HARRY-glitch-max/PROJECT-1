import React, { useState, useEffect } from "react";
import { getMessages, sendMessage } from "../services/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getMessages("global").then(res => setMessages(res.data));
  }, []);

  const handleSend = async () => {
    await sendMessage("global", { text });
    setText("");
    const res = await getMessages("global");
    setMessages(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="border p-4 h-64 overflow-y-scroll mb-4">
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
