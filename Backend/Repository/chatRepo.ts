import mongoose, { Schema, Document } from "mongoose";
import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModal.js";



export const savechatDB = async (chat: string, userId: string, vendorId: string) => {
  try {
      console.log('Saving chat to DB');

      // Find the chat by matching userId and vendorId
      const chatDocument = await chatModel.findOne({ userId, vendorId });
console.log(userId,'userid');
console.log(vendorId,'vendor');


      if (!chatDocument) {
          throw new Error("Chat not found for the given user and vendor.");
      }

      // Create a new message with the found chat ID
      const result = new messageModel({
          chatId: chatDocument._id,  // Use the found chat's ID
          senderId: userId,          // Reference to the sender's ID
          senderModel: "User",       // Assuming sender is a User, change if needed
          text: chat,                // The chat message text
          isRead: false,             // Initial state of the message
      });

      // Save the message to the database
      return await result.save();

  } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database operation failed.");  // Handle and throw database-related errors
  }
};
