import { NextFunction, Request, Response } from "express";
import {
  savechatService,companyAddMessageService
} from "../Service/chatService.js";

import { HttpStatus } from '../utils/httpStatus.js'
import { messageModel } from "../models/messageModal.js";
import { chatModel } from "../models/chatModel.js";
import { io } from "../index.js"; // Import the Socket.IO instance
import mongoose from "mongoose";





export const savechat = async (req: Request, res: Response) => {
  try {
    console.log('start');

    const { text } = req.body;
    const userId = req.body.senderId;
    const vendorId = req.body.vendorId;

    const result = await savechatService(text, userId, vendorId);

    res.status(HttpStatus.OK).json(result);
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};




export const getMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  console.log('hry ');

  try {
    const messages = await messageModel.find({ chatId }).populate("senderId");

    console.log(messages);
    if (!messages.length) {
      return res
        .status(404)
        .json({ message: "No messages found for this chat" });
    }

    res.status(200).json(messages);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to retrieve messages", error: error.message });
  }
};

export const companyChat = async (req: Request, res: Response) => {
  try {

    const chat = await chatModel.find({
      vendorId: req.params.companyId,
    }).populate("userId");

    res.status(200).json(chat);
  } catch (error: any) {
    res.status(500).json(error);
  }
};



interface Ichat extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  vendorId: string;
  // Add other fields from the chat schema here
}


// export const companyAddMessage = async (req: Request, res: Response) => {
//   console.log('controller save chat');

//   const { vendorId, text, userId, senderModel } = req.body;
//   console.log(req.body);

//   if (!vendorId || !text || !userId || !senderModel) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   if (!["User", "Vendor"].includes(senderModel)) {
//     return res.status(400).json({ message: "Invalid sender model" });
//   }

//   try {
//     let chatDocument = await chatModel.findOne({ userId, vendorId }) as Ichat;

//     const message = new messageModel({
//       chatId: chatDocument._id,
//       text,
//       senderId: vendorId,
//       senderModel,
//     });

//     const result = await message.save();

//     // Emit the message to the specific chat room
//     io.to(chatDocument._id.toString()).emit("message", {
//       _id: result._id,
//       chatId: result.chatId,
//       senderId: result.senderId,
//       senderModel: result.senderModel,
//       text: result.text,
//       isRead: result.isRead || false,
//       createdAt: result.createdAt,
//     });
//     console.log('Message emitted successfully');

//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Error while saving the message:', error);
//     res.status(500).json({ message: "Failed to add message", error });
//   }
// };

export const companyAddMessage = async (req: Request, res: Response) => {
  try {
    console.log('start vendor');

    // const { text, userId, senderId } = req.body;  
    const { text } = req.body;
    const vendorId = req.body.senderId;
    const userId = req.body.userId;
    console.log(vendorId);
    console.log(userId);

    
    console.log('start vendor 2');

    const result = await companyAddMessageService(text, userId, vendorId);

    res.status(HttpStatus.OK).json(result);
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};
