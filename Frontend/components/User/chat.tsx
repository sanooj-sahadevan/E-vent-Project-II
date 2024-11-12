/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { SaveChat, getMessages } from "@/services/chatApi";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";

// Message type definition
interface Message {
    vendorId: any;
    text: string;
    senderId: { _id: string };
    createdAt: string;
}

const ChatContent = () => {
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");
    const chatId = searchParams.get("chatId");
    const [message, setMessage] = useState<string>("");
    const [userId, setUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [companyName, setCompanyName] = useState<string>("");
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketConnection = io('https://api.eventopia.shop', {
            withCredentials: true,
        });

        socketConnection.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socketConnection.on('message', (message) => {
            console.log('Received message:', message);
            setMessages(prevState => [...prevState, message]);
        });

        setSocket(socketConnection);

        return () => {
            if (socketConnection) {
                console.log('Disconnecting socket');
                socketConnection.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket && chatId) {
            console.log(`Joining chat room: ${chatId}`);
            socket.emit("joinRoom", chatId);
        }
    }, [chatId, socket]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("user");
            if (user) {
                const parsedUser = JSON.parse(user);
                setUserId(parsedUser?._id || null);
            }
        }
    }, []);

    useEffect(() => {
        const fetchChatDetails = async () => {
            if (chatId) {
                try {
                    const response = await getMessages(chatId);
                    const messagesData: Message[] = response?.data || [];
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
                setMessages([...messages, {
                    text: message, senderId: { _id: userId }, createdAt: new Date().toISOString(),
                    vendorId: undefined
                }]);
                setMessage("");
            } else {
                console.error("Error saving message");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    return (
        <div className="flex h-[95vh] bg-gray-100">
            <div className="flex-1 flex flex-col h-full p-6 bg-white w-[10%]">
                <div className="h-16 bg-gray-200 flex items-center px-4 border-b border-gray-300">
                    <h2 className="text-xl font-semibold text-gray-800">{companyName || "Vendor"}</h2>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-200 p-6 space-y-4">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.senderId._id === userId ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`${msg.senderId._id === userId
                                        ? "bg-pink-400 text-white"
                                        : "bg-gray-600 text-white"
                                        } rounded-lg p-3 max-w-xs break-words`}
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
                        <p className="text-center text-gray-500 mt-6">No messages available.</p>
                    )}
                </div>
                <div className="bg-gray-100 flex items-center p-4 border-t border-gray-300 mt-4">
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

const ChatPage = () => (
    <Suspense fallback={<div>Loading chat...</div>}>
        <ChatContent />
    </Suspense>
);

export default ChatPage;
