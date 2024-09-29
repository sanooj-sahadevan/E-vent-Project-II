"use client";
import { vendorChats, getMessages, messageSend } from "@/services/vendorAPI";
import ChatBox from "@/components/Vendor/chatBox";
import ChatSidebar from "@/components/Vendor/chatSideBar";
import { useEffect, useState } from "react";

interface Vendor {
  _id: string;
}

interface Message {
  senderId: string; // senderId is the sender's ID, which can be the vendor's ID or user's ID
  _id: string;
  text: string;
  vendorId: string;
  userId: {
    _id: string;
    username: string;
  };
  time: string;
  senderModel: string;
}

interface ChatMessage {
  text: string;
  sender: string;
  time: string;
}

const ChatApp = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);

  // Fetch vendor info from local storage
  useEffect(() => {
    // Fetch vendorId from localStorage
    if (typeof window !== "undefined") {
      const vendorData = localStorage.getItem("vendor");
      if (vendorData) {
        const vendor = JSON.parse(vendorData);
        setVendor(vendor);
        setVendorId(vendor._id); // Store vendor ID
      }
    }
  }, []);

  // Fetch chats for the vendor
  useEffect(() => {
    const getChats = async () => {
      if (vendor) {
        try {
          const { data } = await vendorChats(vendor._id);
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
  }, [vendor]);

  // Fetch chat messages for the selected user
  useEffect(() => {
    const fetchChatDetails = async () => {
      if (selectedUser && vendor) {
        const selectedChat = chats.find(
          (chat) => chat?.userId?.username === selectedUser
        );
        if (selectedChat) {
          try {
            const response = await getMessages(selectedChat._id);
            setSelectedMessages(response?.data || []);
          } catch (error) {
            console.error("Failed to fetch chat details:", error);
            setSelectedMessages([]);
          }
        }
      }
    };
    fetchChatDetails();
  }, [selectedUser, chats, vendor]);

  // Get unique users from the chat
  const uniqueUsers = Array.from(new Set(chats.map((chat) => chat?.userId?._id)))
    .map((id) => {
      const chat = chats.find((chat) => chat?.userId?._id === id);
      return { _id: id, username: chat?.userId?.username };
    })
    .filter((user) => user?.username);

  // Handle sending a new message
  const handleNewMessage = async (message: ChatMessage) => {
    const selectedChat = chats.find(
      (chat) => chat?.userId?.username === selectedUser
    );
    if (!vendor || !selectedChat) return;
  
    try {
      const response = await messageSend({
        vendorId: vendor._id, // Pass the vendor ID as the sender
        text: message.text,
        userId: selectedChat.userId._id,
        senderModel: "Vendor",
      });
  
      const newMessage: Message = {
        _id: response.data._id, 
        senderId: vendor._id,   
        text: response.data.text,
        vendorId: vendor._id,
        userId: {
          _id: selectedChat.userId._id,
          username: selectedChat.userId.username,
        },
        time: response.data.time,   // Assuming the API provides the time
        senderModel: "Vendor",      // The model for the vendor
      };
  
      // Update the messages state immediately after sending the message
      setSelectedMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  

  return (
    <div className="h-screen flex">
      <ChatSidebar
        users={uniqueUsers.map((user) => user?.username!)}
        selectedUser={selectedUser || ""}
        setSelectedUser={setSelectedUser}
      />

      {selectedUser ? (
        <ChatBox
  messages={selectedMessages
    .filter((chat) => chat && chat.text)
    .map((chat) => ({
      text: chat.text,
      senderId: chat.senderId,  // This can be vendorId
      time: chat.time,
      isFromVendor: chat.senderId === vendorId,  // This checks if the message is from the vendor
      createdAt: chat.time,
    }))}
  selectedUser={selectedUser}
  senderId={vendorId || ""}  // vendorId passed here as senderId
  senderModel="Vendor"
  onNewMessage={handleNewMessage}
  companyName={""}
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
