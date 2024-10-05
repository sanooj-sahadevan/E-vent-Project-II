import { NextFunction, Request, Response } from "express";
import {
  savechatService, companyAddMessageService
} from "../Service/chatService.js";

import { HttpStatus } from '../utils/httpStatus.js'
import { messageModel } from "../models/messageModal.js";
import { chatModel } from "../models/chatModel.js";
import { io } from "../index.js"; // Import the Socket.IO instance
import mongoose from "mongoose";





export const savechat = async (req: Request, res: Response) => {
  try {
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

  try {
    const messages = await messageModel.find({ chatId }).populate("senderId");
    if (!messages.length) {
      return res
        .status(404)
        .json({ message: "No messages found for this chat" });
    }
    await messageModel.updateMany({ chatId }, { $set: { isRead: true } });
    const updatedMessages = await messageModel.find({ chatId }).populate("senderId");
    res.status(200).json(updatedMessages);
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
}



export const companyAddMessage = async (req: Request, res: Response) => {
  try {

    const { text } = req.body;
    const vendorId = req.body.senderId;
    const userId = req.body.userId;
    const result = await companyAddMessageService(text, userId, vendorId);

    res.status(HttpStatus.OK).json(result);
  } catch (error: any) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
  }
};
