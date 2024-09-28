import { NextFunction, Request, Response } from "express";
import {
  savechatService
} from "../Service/chatService.js";

import { HttpStatus } from '../utils/httpStatus.js'
import { messageModel } from "../models/messageModal.js";
import { chatModel } from "../models/chatModel.js";





export const savechat = async (req: Request, res: Response) => {
  try {
    console.log('start');

    const { text } = req.body;
    const userId = req.body.senderId;
    const vendorId = req.body.vendorId;
    console.log(userId, 'saxasxasdbgedhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

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




export const companyAddMessage = async (req: Request, res: Response) => {
  const { vendorId, text, userId, senderModel } = req.body;
  console.log(req.body);

  // Validation check for required fields
  if (!vendorId || !text || !userId || !senderModel) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validation for senderModel
  if (!["User", "Vendor"].includes(senderModel)) {
    return res.status(400).json({ message: "Invalid sender model" });
  }

  try {
    // Check if chatDocument exists, if not create one
    let chatDocument = await chatModel.findOne({ userId, vendorId });
    console.log(chatDocument);
    
    if (!chatDocument) {
      chatDocument = new chatModel({ userId, vendorId });
      await chatDocument.save();
    }

    // Create a new message
    const message = new messageModel({
      chatId: chatDocument._id,  
      text,
      senderId: vendorId,
      senderModel,
    });

    const result = await message.save();

    res.status(200).json(result); 
  } catch (error) {
    console.error('Error while saving the message:', error);
    res.status(500).json({ message: "Failed to add message", error });
  }
};
