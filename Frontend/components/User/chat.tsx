/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { SaveChat, getMessages } from "@/services/chatApi";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";

const ChatPage = () => {
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");
    const chatId = searchParams.get("chatId");
    const [message, setMessage] = useState<string>("");
    const [userId, setUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [companyName, setCompanyName] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketConnection = io("http://localhost:5000", {
            transports: ["websocket"],
            autoConnect: false,
        });

        socketConnection.connect();
        setSocket(socketConnection);

        return () => {
            if (socketConnection) {
                socketConnection.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket && chatId) {
            socket.emit("joinRoom", chatId);
        }
    }, [chatId, socket]);

    useEffect(() => {
        if (socket) {
            socket.on("message", (newMessage: any) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => {
                socket.off("message");
            };
        }
    }, [socket]);

    useEffect(() => {
        // Fetch userId from localStorage
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("user");
            if (user) {
                const senderId = JSON.parse(user);
                setUserId(senderId?._id || null);
            }
        }
    }, []);

    useEffect(() => {
        const fetchChatDetails = async () => {
            if (chatId) {
                try {
                    const response = await getMessages(chatId);
                    const messagesData = response?.data || [];
                    setMessages(messagesData);
                    setCompanyName(messagesData[0]?.vendorId?.vendorname || "");
                } catch (error) {
                    console.error("Failed to fetch chat details:", error);
                    setMessages([]);
                    setCompanyName("");
                }
            }
        };

        fetchChatDetails();
    }, [chatId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            console.error("User ID is not defined");
            return;
        }

        if (!message.trim()) {
            console.error("Message cannot be empty");
            return;
        }

        try {
            const response = await SaveChat({
                text: message,
                senderId: userId,
                vendorId: vendorId,
            });

            if (response) {
                setMessages([...messages, { text: message, senderId: userId, createdAt: new Date() }]);
                setMessage("");
            } else {
                console.error("Error saving message");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    // Function to format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 h-full bg-gray-800 text-white p-4 border-r border-gray-700">
                <h1 className="text-lg font-semibold mb-4">Chats</h1>
                <div className="h-full overflow-y-auto space-y-2">
                    <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 cursor-pointer">Chat 1</div>
                    <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 cursor-pointer">Chat 2</div>
                    <div className="bg-gray-700 p-3 rounded hover:bg-gray-600 cursor-pointer">Chat 3</div>
                </div>
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 flex flex-col h-full p-6 bg-white">
                {/* Chat Header */}
                <div className="h-16 bg-gray-200 flex items-center px-4 border-b border-gray-300">
                    <h2 className="text-xl font-semibold text-gray-800">{companyName || "Text"}</h2>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto bg-gray-200 p-6 space-y-4">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.senderId._id === userId ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`${msg.senderId._id === userId ? "bg-pink-400 text-white" : "bg-green-400 text-white"} 
                    rounded-lg p-3 max-w-xs break-words`}
                                >
                                    <p>{msg.text}</p>
                                    <span className="text-xs text-gray-500 block mt-1">
                                        {msg.senderId._id === userId ? "You" : companyName}
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

                {/* Message Input Area */}
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

export default ChatPage;
