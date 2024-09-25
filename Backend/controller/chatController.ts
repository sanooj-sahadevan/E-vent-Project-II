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

      const { chat } = req.body;  // Destructure the chat from the request body
      const userId = req.body.senderId;  // Add userId from request body
      const vendorId = req.body.vendorId;  // Add vendorId from request body
console.log(userId,'saxasxasdbgedhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');

      // Pass the chat, userId, and vendorId to the service
      const result = await savechatService(chat, userId, vendorId);

      res.status(HttpStatus.OK).json(result);  // Send the result as the response
  } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });  // Handle errors
  }
};



  export const getUnreadMessagesCount = async (
    req: Request,
    res: any
  ): Promise<void> => {
    const { userId } = req.params;
  
    // console.log({userId});
  
    try {
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      const unreadCount = await messageModel.countDocuments({
        // to: userId,
        isRead: false,
      });
  
      res.status(200).json({ unreadCount });
    } catch (error) {
      console.error("Error fetching unread messages count:", error);
      res.status(500).json({ error: "Error fetching unread messages count" });
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
  