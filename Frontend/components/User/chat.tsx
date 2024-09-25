'use client';
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { SaveChat } from "@/services/chatApi";
import { useSearchParams } from "next/navigation";

const ChatPage = () => {
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");
    const [message, setMessage] = useState<string>("");
    const [userId, setUserId] = useState<string | null>(null);

    // Use useEffect to set userId when the component mounts
    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem('user');
            if (user) {
                const senderId = JSON.parse(user); // Parse the user object
                setUserId(senderId?._id || null); // Safely set userId
            }
        }
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure userId is defined before proceeding
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
                chat: message, 
                senderId: userId, // Use the state userId
                vendorId: vendorId 
            });

            if (response) {
                console.log("Message saved:", response);
                setMessage(""); // Clear the input after sending
            } else {
                console.error("Error saving message");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 h-full bg-gray-800 text-white p-4 border-r border-gray-700 mt-4">
                <h1 className="text-lg font-semibold mb-4">Chats</h1>
                <div className="h-full overflow-y-auto">
                    <p className="mb-2 p-2 bg-gray-700 rounded">Chat 1</p>
                    <p className="mb-2 p-2 bg-gray-700 rounded">Chat 2</p>
                    <p className="mb-2 p-2 bg-gray-700 rounded">Chat 3</p>
                </div>
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 flex flex-col h-full p-6 bg-white border-l border-gray-300 mt-14">
                <div className="h-16 bg-gray-200 flex items-center px-4 border-b border-gray-300">
                    <h2 className="text-lg font-semibold">Chat Header</h2>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    {/* Messages will be rendered here */}
                </div>

                {/* Message Input Area */}
                <div className="bg-gray-100 flex items-center px-4 py-4 mb-16 space-x-4">
                    <form onSubmit={handleSendMessage} className="flex w-full">
                        <input
                            type="text"
                            id="chat"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
