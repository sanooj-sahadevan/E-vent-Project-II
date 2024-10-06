import mongoose, { Schema, Document } from "mongoose";
import { chatModel } from "../models/chatModel";
import { messageModel } from "../models/messageModal";
import { io } from '../index'; 
import { Ichat } from "../interfaces/chat";



export const savechatDB = async (text: string, userId: string, vendorId: string) => {
  try {
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
    const chatDocument = await chatModel.findOne({ userId, vendorId }) as Ichat;
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
