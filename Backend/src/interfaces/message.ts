import mongoose from "mongoose";

export interface IMessage extends Document {
    chatId: mongoose.Schema.Types.ObjectId; 
    senderId: mongoose.Schema.Types.ObjectId; 
    senderModel: "User" | "Vendor"; 
    text: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }