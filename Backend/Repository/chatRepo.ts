import mongoose, { Schema, Document } from "mongoose";
import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModal.js";
import { io } from "../index.js"; 

interface Ichat extends Document {
  _id: mongoose.Types.ObjectId;  
  userId: string;
  vendorId: string;
}

export const savechatDB = async (text: string, userId: string, vendorId: string) => {
  try {
    console.log('Saving chat to DB');

    const chatDocument = await chatModel.findOne({ userId, vendorId }) as Ichat;  

    if (!chatDocument) {
      throw new Error("Chat not found for the given user and vendor.");
    }

    const result = new messageModel({
      chatId: chatDocument._id,  
      senderId: userId,          
      senderModel: "User",       
      text: text,                
      isRead: false,            
    });

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

    const chats = await chatModel.find({ vendorId: vendorId }).select('_id');
    const chatIds = chats.map(chat => chat._id);


    const unreadCount = await messageModel.countDocuments({
      chatId: { $in: chatIds },
      senderModel: "User",
      isRead: false,
    });

    io.to(vendorId).emit("unreadCount", {unreadCount});

    return savedMessage;

  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database operation failed.");
  }
};


export const companyAddMessageDB = async (text: string, userId: string, vendorId: string) => {
  try {
    console.log('Saving chat to DB,vendor');

    const chatDocument = await chatModel.findOne({ userId, vendorId }) as Ichat;
    console.log(chatDocument, 'iddddddddddddddddddddd');

    if (!chatDocument) {
      throw new Error("Chat not found for the given user and vendor.");
    }

    const result = new messageModel({
      chatId: chatDocument._id,
      senderId: vendorId,        
      senderModel: "Vendor",     
      text: text,                
      isRead: false,             
    });

    const savedMessage = await result.save();
    console.log(savedMessage, 'ok', savedMessage.chatId);

    io.to(chatDocument._id.toString()).emit("message", {
      _id: savedMessage._id,
      chatId: savedMessage.chatId,
      senderId: savedMessage.senderId,
      senderModel: savedMessage.senderModel,
      text: savedMessage.text,
      isRead: savedMessage.isRead,
      createdAt: savedMessage.createdAt
    });

    console.log('Message emitted successfully');

    return savedMessage;

  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database operation failed.");
  }
};
