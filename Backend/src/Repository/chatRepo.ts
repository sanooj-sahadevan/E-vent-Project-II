import mongoose, { Schema, Document } from "mongoose";
import { chatModel } from "../models/chatModel";
import { messageModel } from "../models/messageModal";
import { io } from '../index';
import { Ichat } from "../interfaces/chat";
import { IChatRepository } from "../interfaces/repository/chatRepository";



export class ChatRepository implements IChatRepository {
  constructor() {
  }



  async getMessagesByChatId(chatId: string) {
    try {
      return await messageModel.find({ chatId }).populate('senderId');
    } catch (error) {
      throw new Error('Error fetching messages from the database');
    }
  };

  async userGetMessagesByChatId(chatId: string) {
    try {
      return await messageModel.find({ chatId }).populate('senderId');
    } catch (error) {
      throw new Error('Error fetching messages from the database');
    }
  };


















  async markMessagesAsRead(chatId: string) {
    try {
      await messageModel.updateMany({ chatId }, { $set: { isRead: true } });
    } catch (error) {
      throw new Error('Error updating message status to read');
    }
  };






  async savechatDB(text: string, userId: string, vendorId: string) {
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

      io.to(vendorId).emit("unreadCount", { unreadCount });

      return savedMessage;

    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Database operation failed.");
    }
  };


  async companyAddMessageDB(text: string, userId: string, vendorId: string) {
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


  async userCompanyAddMessageDB(text: string, userId: string, vendorId: string) {
    try {
      console.log(userId,vendorId);
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


  async chatService(vendorId: string) {
    try {
      const chat = await chatModel.find({
        vendorId,
      }).populate("userId");
      return chat;
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Could not retrieve chat data.");
    }
  };


  async userchatService(userId: string) {
    try {
      const chat = await chatModel.find({
        userId,
      }).populate("vendorId");
      console.log(chat,'000000000000000000000000000000000000000000000');
      
      return chat;
    } catch (error) {
      console.error("Repository error:", error);
      throw new Error("Could not retrieve chat data.");
    }
  };

}