import mongoose from "mongoose";

export interface IMessage extends Document {
    chatId: mongoose.Schema.Types.ObjectId; // Reference to chat
    senderId: mongoose.Schema.Types.ObjectId; // Reference to the sender (User or Company)
    senderModel: "User" | "Vendor"; 
    text: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }