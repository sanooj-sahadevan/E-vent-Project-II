"use client";
import { vendorChats, messageSend } from "@/services/vendorAPI"; // Import the vendor API functions
import ChatBox from "@/components/Vendor/chatBox"; // Import the ChatBox component
import ChatSidebar from "@/components/Vendor/chatSideBar"; // Import the ChatSidebar component
import { useEffect, useState } from "react"; // Import React hooks

// Define interfaces for Vendor and Message
interface Vendor {
  _id: string;
}

interface Message {
  _id: string;
  text: string;
  vendorId: string;
  userId: {
    _id: string;
    username: string;
  };
  time: string;
  senderModel: string; // Add this to your interface
}

interface ChatMessage {
  text: string;
  sender: string;
  time: string;
}

// ChatApp Component
const ChatApp = () => {
  const [users, setUsers] = useState<Vendor | null>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Retrieve vendor data from local storage on component mount
  useEffect(() => {
    const vendorData = localStorage.getItem("vendor");
    if (vendorData) {
      const vendor = JSON.parse(vendorData);
      setUsers(vendor);
    }
  }, []);

  // Fetch chat messages for the vendor
  useEffect(() => {
    const getChats = async () => {
      if (users) {
        try {
          const { data } = await vendorChats(users._id);
          setChats(data);
        } catch (error: any) {
          console.error(error);
          setError("Failed to load chats.");
        } finally {
          setLoading(false);
        }
      }
    };
    getChats();
  }, [users]);

  // Unique users from chats
  const uniqueUsers = Array.from(new Set(chats.map((chat) => chat.userId._id)))
    .map((id) => {
      const chat = chats.find((chat) => chat.userId._id === id);
      return { _id: id, username: chat?.userId.username };
    })
    .filter((user) => user?.username);

  const selectedUserId = uniqueUsers.find(
    (user) => user.username === selectedUser
  )?._id;

  const filteredMessages: ChatMessage[] = chats
    .filter((chat) => chat.userId.username === selectedUser)
    .map((chat) => ({
      text: chat.text,
      sender: chat.userId.username,
      time: chat.time,
    }));

  // Handle sending new messages
  const handleNewMessage = async (message: ChatMessage) => {
    try {
      const response = await messageSend({
        vendorId: users?._id,
        text: message.text,
        userId: selectedUserId,
        senderModel: "Vendor",
      });
      // Update chats state if needed
      setChats((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar
        users={uniqueUsers.map((user) => user.username!)}
        selectedUser={selectedUser || ""}
        setSelectedUser={(username: string) => setSelectedUser(username)}
      />

      {selectedUser && selectedUserId ? (
        <ChatBox
          messages={filteredMessages}
          selectedUser={selectedUser}
          senderId={users?._id || ""}
          senderModel="Vendor"
          onNewMessage={handleNewMessage} // Pass the function
        />
      ) : (
        <div className="w-3/4 h-full p-4">Select a user to view chats.</div>
      )}

      {loading && <div>Loading chats...</div>}
      {error && <div>{error}</div>}
    </div>
  );
};

export default ChatApp;
