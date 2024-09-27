"use client";
import { vendorChats, getMessages, messageSend } from "@/services/vendorAPI";
import ChatBox from "@/components/Vendor/chatBox";
import ChatSidebar from "@/components/Vendor/chatSideBar";
import { useEffect, useState } from "react";

// Define interfaces for Vendor, Message, and ChatMessage
interface Vendor {
  _id: string;
}

interface Message {
  senderId: any;
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

  // Retrieve vendor data from local storage on component mount
  useEffect(() => {
    const vendorData = localStorage.getItem("vendor");
    if (vendorData) {
      const vendor = JSON.parse(vendorData);
      setVendor(vendor);
    }
  }, []);

  // Fetch chat users for the vendor
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

  // Fetch chat messages when the selected user changes
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
            console.log({response});
            
          } catch (error) {
            console.error("Failed to fetch chat details:", error);
            setSelectedMessages([]);
          }
        }
      }
    };
    fetchChatDetails();
  }, [selectedUser, chats, vendor]);

  // Get unique users from chats
  const uniqueUsers = Array.from(new Set(chats.map((chat) => chat?.userId?._id)))
    .map((id) => {
      const chat = chats.find((chat) => chat?.userId?._id === id);
      return { _id: id, username: chat?.userId?.username };
    })
    .filter((user) => user?.username);

  // Handle sending new messages
  const handleNewMessage = async (message: ChatMessage) => {
    const selectedChat = chats.find(
      (chat) => chat?.userId?.username === selectedUser
    );
    if (!vendor || !selectedChat) return;

    try {
      const response = await messageSend({
        vendorId: vendor._id,
        text: message.text,
        userId: selectedChat.userId._id,
        senderModel: "Vendor",
      });
      setSelectedMessages((prev) => [...prev, response.data]);
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
            .filter((chat) => chat && chat.text) // Filter out any undefined or invalid messages
            .map((chat) => ({
              text: chat.text,
              sender: chat.senderId.username, // Ensure this points to the username
              time: chat.time, // Adjust this if your API returns a different time format
              isFromVendor: chat.senderId?._id === vendor?._id, // Check if the message is from the vendor
              createdAt: chat.time, // Use time here, assuming it's in ISO format; otherwise format accordingly
            }))} 
          selectedUser={selectedUser}
          senderId={vendor?._id || ""}
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
