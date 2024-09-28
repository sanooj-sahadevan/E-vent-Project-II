import React, { useState } from "react";

interface ChatBoxProps {
  messages: {
    text: string;
    sender: string;
    time: string;
    isFromVendor: boolean;
    createdAt: string;
  }[];
  selectedUser: string;
  senderId: string;
  senderModel: string;
  companyName: string;
  onNewMessage: (message: { text: string; sender: string; time: string }) => void;
}

const ChatBox = ({
  messages,
  onNewMessage,
  senderId,
  selectedUser,
  companyName,
}: ChatBoxProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onNewMessage({
        text: newMessage,
        sender: senderId,  
        time: new Date().toISOString(),

      });
      
      setNewMessage("");
    }
  };
  

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="flex-1 flex flex-col h-full p-6 bg-white">
      {/* Chat Header */}
      <div className="h-16 bg-gray-200 flex items-center px-4 border-b border-gray-300">
        <h2 className="text-xl font-semibold text-gray-800">{companyName || "Chat"}</h2>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-200 p-6 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isFromVendor ? "justify-end" : "justify-start"}`}>
              <div
                className={`${
                  msg.isFromVendor ? "bg-pink-400 text-white" : "bg-gray-300 text-black"
                } rounded-lg p-3 max-w-xs break-words`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {msg.isFromVendor ? "You" : selectedUser}
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  {formatDate(msg.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages available.</p>
        )}
      </div>

      {/* Message Input Area */}
      <div className="bg-gray-100 flex items-center p-4 border-t border-gray-300">
        <form onSubmit={handleSendMessage} className="flex w-full">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-3 rounded-r-lg hover:bg-pink-600 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
