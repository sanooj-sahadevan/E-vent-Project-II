import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


import {
  savechatDB,
} from "../Repository/chatRepo.js";


export const savechatService = async (chat: string, userId: string, vendorId: string) => {
  try {
      const chatService = await savechatDB(chat, userId, vendorId);  // Call the repository function to save the chat
      return chatService;  // Return the saved chat result
  } catch (error) {
      console.error("Service error:", error);
      throw new Error("Could not save chat.");  // Throw an error if there's an issue
  }
};


  
  
