import React, { useState } from "react";

// Define interfaces for ChatMessage and ChatBoxProps
interface ChatMessage {
  text: string;
  sender: string;
  time: string;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  selectedUser: string;
  senderId: string;
  senderModel: string;
  onNewMessage: (message: ChatMessage) => void;
}

// ChatBox Component
const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  selectedUser,
  senderId,
  senderModel,
  onNewMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        text: newMessage,
        sender: senderModel,  
        time: new Date().toISOString(),
      };

      onNewMessage(message); 
      setNewMessage("");
    }
  };

  return (
    <div className="w-3/4 h-full p-4 bg-white flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chat with {selectedUser}</h2>
      <div className="flex-grow overflow-y-auto">
        {messages.length > 0 ? (
          <ul>
            {messages.map((message, index) => (
              <li key={index} className="mb-2">
                <strong>{message.sender}:</strong> {message.text}
                <div className="text-xs text-gray-500">{message.time}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages yet</p>
        )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
