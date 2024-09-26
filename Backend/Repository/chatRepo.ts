import mongoose, { Schema, Document } from "mongoose";
import { chatModel } from "../models/chatModel.js";
import { messageModel } from "../models/messageModal.js";



export const savechatDB = async (text: string, userId: string, vendorId: string) => {
    try {
        console.log('Saving chat to DB');

        const chatDocument = await chatModel.findOne({ userId, vendorId });
        console.log(userId, 'userid');
        console.log(vendorId, 'vendor');


        if (!chatDocument) {
            throw new Error("Chat not found for the given user and vendor.");
        }

        const result = new messageModel({
            chatId: chatDocument._id,  
            senderId: userId,          
            senderModel: "User",       
            text: text,                
            isRead: false,            
        })

        return await result.save();

    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Database operation failed.");  
    }
};
