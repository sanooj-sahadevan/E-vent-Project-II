import { NextFunction, Request, Response } from "express";
import { HttpStatus } from '../utils/httpStatus'
import { IChatService } from "../interfaces/service/chatService";

export class ChatController {
  private chatService:IChatService
  constructor(chatService: IChatService) {
    this.chatService = chatService
  }


  async savechat(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;
      const userId = req.body.senderId;
      const vendorId = req.body.vendorId;

      const result = await this.chatService.savechatService(text, userId, vendorId);

      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  };

  async getMessage(req: Request, res: Response, next: NextFunction) {
    const { chatId } = req.params;

    try {
      const updatedMessages = await this.chatService.getMessageService(chatId);
      if (!updatedMessages.length) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "No messages found for this chat" });
      }
      res.status(HttpStatus.OK).json(updatedMessages);
    } catch (error: any) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to retrieve messages", error: error.message });
    }
  };

  

  async userGetMessage(req: Request, res: Response, next: NextFunction) {
    const { chatId } = req.params;

    try {
      const updatedMessages = await this.chatService.userGetMessageService(chatId);
      if (!updatedMessages.length) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "No messages found for this chat" });
      }
      res.status(HttpStatus.OK).json(updatedMessages);
    } catch (error: any) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to retrieve messages", error: error.message });
    }
  };

  async companyChat(req: Request, res: Response, next: NextFunction) {
    try {
      const chatResponse = await this.chatService.chatController(req.params.companyId);
      res.status(HttpStatus.OK).json(chatResponse);
    } catch (error) {
      next(error);
    }
  };

  async usercompanyChat(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.params.userId,'ok da');
      
      const chatResponse = await this.chatService.userchatController(req.params.companyId);
      res.status(HttpStatus.OK).json(chatResponse);
    } catch (error) {
      next(error);
    }
  };


  async companyAddMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;
      const vendorId = req.body.senderId;
      const userId = req.body.userId;
      const result = await this.chatService.companyAddMessageService(text, userId, vendorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  };

  async userCompanyAddMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { text } = req.body;
      const userId = req.body.senderId;
      const vendorId = req.body.userId;
      const result = await this.chatService.userCompanyAddMessageService(text, userId, vendorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  };


}
