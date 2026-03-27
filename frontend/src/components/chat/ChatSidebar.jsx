import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUserChats } from "../../api/chat";

const ChatSidebar = ({ onSelectConversation }) => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const data = await getUserChats(user._id);
      setConversations(data);
    };
    fetchConversations();
  }, [user._id]);

  return (
    <div className="w-64 border-r p-4">
      <h2 className="font-bold mb-4">Inbox</h2>
      {conversations.map((chat) => (
        <div
          key={chat._id}
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() =>
            onSelectConversation(
              chat.senderId === user._id ? chat.receiverId : chat.senderId
            )
          }
        >
          <p className="font-medium">
            {chat.senderId === user._id
              ? chat.receiverId.name
              : chat.senderId.name}
          </p>
          <p className="text-sm text-gray-500 truncate">{chat.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;
