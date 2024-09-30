import mongoose, { Schema, Document } from "mongoose";
import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModal.js";
import { io } from "../index.js"; // Import the Socket.IO instance

// Define the Ichat interface
interface Ichat extends Document {
    _id: mongoose.Types.ObjectId;  // Explicitly define _id as ObjectId
    userId: string;
    vendorId: string;
    // Add other fields from the chat schema here
}

export const savechatDB = async (text: string, userId: string, vendorId: string) => {
    try {
        console.log('Saving chat to DB');

        // Find the chat document for the given user and vendor
        const chatDocument = await chatModel.findOne({ userId, vendorId }) as Ichat;  // Cast the result as Ichat

        if (!chatDocument) {
            throw new Error("Chat not found for the given user and vendor.");
        }

        // Create a new message in the chat
        const result = new messageModel({
            chatId: chatDocument._id,  // Associate the message with the chat
            senderId: userId,          // User ID of the sender
            senderModel: "User",       // Indicates it's a user sending the message
            text: text,                // Message content
            isRead: false,             // Initially, the message is unread
        });

        // Save the message to the database
        const savedMessage = await result.save();

        io.to(chatDocument._id.toString()).emit("message", {
            
            _id: savedMessage._id,
            chatId: savedMessage.chatId,
            senderId: savedMessage.senderId,
            senderModel: savedMessage.senderModel,
            text: savedMessage.text,
            isRead: savedMessage.isRead,
            createdAt: savedMessage.createdAt,
        });
        console.log('w');

        // Return the saved message
        return savedMessage;

    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Database operation failed.");
    }
};
