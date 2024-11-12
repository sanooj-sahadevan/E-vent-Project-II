"use client";
import {
    UserVendorChats,
    UsergetMessages,
    UsermessageSend
} from "@/services/chatApi";
import ChatSidebar from "@/components/User/chatSideBar";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { log } from "console";

interface User {
    _id: string;
}

interface Vendor {
    _id: string;
    vendorname: string;
}

interface Message {
    createdAt: string;
    senderModel: string | null;
    senderId: string;
    _id: string;
    text: string;
    vendorId: Vendor;
    userId: string;
    time: string;
}

const ChatApp = () => {
    const [user, setUser] = useState<User | null>(null);
    const [chatId, setChatId] = useState<Message[]>([]);
    const [currChatId, setCurrChatId] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
    const [selectedMessages, setSelectedMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io("https://api.eventopia.shop", {
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
        const userData = localStorage.getItem("user");

        if (userData) {
            try {
                const parsedUser = JSON.parse(userData); // Parse the string into an object
                setUser(parsedUser); // Set the user state
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }
    }, []); // Run only once on component mount

    useEffect(() => {
        const getChats = async () => {
            if (user && user._id) {
                try {
                    console.log(user._id);

                    const response = await UserVendorChats(user._id);
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
    }, [user]);  // Depend on user state




    useEffect(() => {
        if (socket && currChatId) {
            console.log(`Joining chat room: ${currChatId}`);
            socket.emit("joinRoom", currChatId);
        }
    }, [currChatId, socket]);



    useEffect(() => {
        const fetchChatDetails = async () => {
            if (selectedVendor && user) {
                const validChats = chatId.filter((chat) => chat?.vendorId?.vendorname);
                const selectedChat = validChats.find(
                    (chat) => chat?.vendorId?.vendorname === selectedVendor
                );
                console.log(selectedChat, 'plplpl');

                setCurrChatId(selectedChat?._id);

                if (selectedChat) {
                    try {
                        const response = await UsergetMessages(selectedChat._id);
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
    }, [selectedVendor, chatId, user]);

    const uniqueVendors = Array.from(
        new Set(
            chatId
                .filter((chat) => chat?.vendorId && chat.vendorId._id)
                .map((chat) => chat.vendorId._id)
        )
    ).map((id) => {
        const chat = chatId.find((chat) => chat?.vendorId?._id === id);
        return { _id: id, vendorname: chat?.vendorId?.vendorname };
    });

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id || !message.trim()) return;

        const selectedChat = chatId.find(
            (chat) => chat?.vendorId?.vendorname === selectedVendor
        );

        if (!selectedChat) {
            console.error("Selected chat not found.");
            return;
        }

        try {
            const response = await UsermessageSend({
                text: message,
                senderId: user._id, // Use correct user ID
                userId: selectedChat.vendorId._id, // Correctly send vendorId in message
            });

            if (response) {
                setMessage(""); // Clear the input after sending the message
                // Optional: Update messages state with new message
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

    return (
        <div className="h-screen flex mt">
            {/* <ChatSidebar
                vendors={uniqueVendors.map((vendor) => vendor.vendorname)}
                selectedVendor={selectedVendor || ""}
                setSelectedVendor={setSelectedVendor} 
            /> */}

            <ChatSidebar
                vendors={uniqueVendors
                    .map((vendor) => vendor.vendorname)
                    .filter((vendorname): vendorname is string => vendorname !== undefined)
                }
                selectedVendor={selectedVendor || ""}
                setSelectedVendor={setSelectedVendor}
            />

            <div className="flex-1 flex flex-col h-full p-6 bg-white">
                <div className="flex-1 overflow-y-auto bg-gray-200 p-6 space-y-4">
                    {selectedMessages.length > 0 ? (
                        selectedMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.senderModel === "User" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`${msg.senderModel === "User"
                                        ? "bg-pink-400 text-white"
                                        : "bg-gray-600 text-white"
                                        } rounded-lg p-3 max-w-xs break-words`}
                                >
                                    <p>{msg.text}</p>
                                    <span className="text-xs text-gray-500 block mt-1">
                                        {msg.senderModel === "User" ? "You" : "User"}
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
