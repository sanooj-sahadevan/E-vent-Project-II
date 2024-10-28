"use client";
import { vendorChats, getMessages, messageSend } from "@/services/vendorAPI";
import ChatSidebar from "@/components/Vendor/chatSideBar";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Vendor {
  _id: string;
}

interface User {
  _id: string;
  username: string;
}

interface Message {
  createdAt: string;
  senderModel: string | null;
  senderId: string;
  _id: string;
  text: string;
  vendorId: string;
  userId: User;
  time: string;
}

const ChatApp = () => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [chatId, setChatId] = useState<Message[]>([]);
  const [currChatId, setCurrChatId] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server vendor");
    });

    socketInstance.on("message", (newMessage: Message) => {
      console.log("Vendor received message:", newMessage);
      setSelectedMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      console.log("Disconnecting vendor socket");
    };
  }, []);

  useEffect(() => {
    const vendorData = localStorage.getItem("vendor");
    if (vendorData) {
      const parsedVendor = JSON.parse(vendorData);
      setVendor(parsedVendor);
      setVendorId(parsedVendor._id);
    }
  }, []);

  useEffect(() => {
    if (socket && currChatId) {
      console.log(`Joining chat room: ${currChatId}`);
      socket.emit("joinRoom", currChatId);
    }
  }, [currChatId, socket]);

  useEffect(() => {
    const getChats = async () => {
      if (vendor) {
        try {
          const response = await vendorChats(vendor._id);
          const data = response?.data;
          if (data) {
            setChatId(data);
          } else {
            setError("No data found.");
          }
        } catch (error) {
          console.error(error);
          setError("Failed to load chats.");
        } finally {
          setLoading(false);
        }
      }
    };
    getChats();
  }, [vendor]);

  useEffect(() => {
    const fetchChatDetails = async () => {
      if (selectedUser && vendor) {
        const validChats = chatId.filter((chat) => chat?.userId?.username);
        const selectedChat = validChats.find(
          (chat) => chat?.userId?.username === selectedUser
        );
        setCurrChatId(selectedChat?._id);

        if (selectedChat) {
          try {
            const response = await getMessages(selectedChat._id);
            const data = response?.data;
            if (data) {
              setSelectedMessages(data);
            } else {
              setSelectedMessages([]);
              setError("No messages found.");
            }
          } catch (error) {
            console.error("Failed to fetch chat details:", error);
            setSelectedMessages([]);
          }
        }
      }
    };
    fetchChatDetails();
  }, [selectedUser, chatId, vendor]);

  const uniqueUsers = Array.from(
    new Set(
      chatId
        .filter((chat) => chat?.userId && chat.userId._id)
        .map((chat) => chat.userId._id)
    )
  ).map((id) => {
    const chat = chatId.find((chat) => chat?.userId?._id === id);
    return { _id: id, username: chat?.userId?.username };
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor?._id || !message.trim()) return;

    const selectedChat = chatId.find(
      (chat) => chat?.userId?.username === selectedUser
    );

    if (!selectedChat) {
      console.error("Selected chat not found.");
      return;
    }

    try {
      const response = await messageSend({
        text: message,
        senderId: vendorId,
        userId: selectedChat.userId._id,
      });

      if (response) {
        setMessage(""); // Clear the input after sending the message
      } else {
        console.error("Error saving message");
      }
    } catch (error) {
      console.error("Network error:", error);
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
  console.log({ selectedMessages });

  return (
    <div className="h-screen flex mt">
      <ChatSidebar
        users={uniqueUsers
          .map((user) => user.username)
          .filter((username): username is string => username !== undefined)
        }
        selectedUser={selectedUser || ""}
        setSelectedUser={setSelectedUser}
      />



      <div className="flex-1 flex flex-col h-full p-6 bg-white">
        <div className="flex-1 overflow-y-auto bg-gray-200 p-6 space-y-4">
          {selectedMessages.length > 0 ? (
            selectedMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.senderModel === "Vendor" ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`${msg.senderModel === "Vendor" ? "bg-pink-400 text-white" : "bg-gray-600 text-white"
                    } rounded-lg p-3 max-w-xs break-words`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs text-gray-500 block mt-1">
                    {msg.senderModel === "Vendor" ? "You" : "User"}
                  </span>
                  <span className="text-xs text-white-300 block mt-1">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages available.</p>
          )}
        </div>


        <div className="bg-gray-100 flex items-center p-4 border-t border-gray-300">
          <form onSubmit={handleSendMessage} className="flex w-full">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
    </div>
  );
};

export default ChatApp;
