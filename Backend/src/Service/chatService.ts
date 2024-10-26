import { IChatRepository } from "../interfaces/repository/chatRepository";
import { IChatService } from "../interfaces/service/chatService";

export class ChatService implements IChatService {

  private chatRepository: IChatRepository

  constructor(chatRepository: IChatRepository) {
    this.chatRepository = chatRepository
  }



  async getMessageService(chatId: string) {
    try {
      const messages = await this.chatRepository.getMessagesByChatId(chatId);
      if (messages.length > 0) {
        await this.chatRepository.markMessagesAsRead(chatId);
      }
      const updatedMessages = await this.chatRepository.getMessagesByChatId(chatId);
      return updatedMessages;
    } catch (error) {
      throw new Error('Failed to process messages in service');
    }
  };


  async userGetMessageService(chatId: string) {
    try {
      const messages = await this.chatRepository.userGetMessagesByChatId(chatId);
      if (messages.length > 0) {
        await this.chatRepository.markMessagesAsRead(chatId);
      }
      const updatedMessages = await this.chatRepository.userGetMessagesByChatId(chatId);
      return updatedMessages;
    } catch (error) {
      throw new Error('Failed to process messages in service');
    }
  };



  async savechatService(text: string, userId: string, vendorId: string) {
    try {
      const chatService = await this.chatRepository.savechatDB(text, userId, vendorId);
      return chatService;
    } catch (error) {
      console.error("Service error:", error);
      throw new Error("Could not save chat.");
    }
  };

  async chatController(vendorId: string) {
    try {
      const chat = await this.chatRepository.chatService(vendorId);
      return chat;
    } catch (error) {
      console.error("Service error:", error);
      throw new Error("Could not fetch chat data.");
    }
  };

  async userchatController(userId: string) {
    try {
      const chat = await this.chatRepository.userchatService(userId);
      console.log(chat, userId, '0o0o0o0o0o0o0o');

      return chat;
    } catch (error) {
      console.error("Service error:", error);
      throw new Error("Could not fetch chat data.");
    }
  };


  async companyAddMessageService(text: string, userId: string, vendorId: string) {
    try {
      
      const chatService = await this.chatRepository.companyAddMessageDB(text, userId, vendorId);
      return chatService;
    } catch (error) {
      console.error("Service error:", error);
      throw new Error("Could not save chat.");
    }
  };

  async userCompanyAddMessageService(text: string, userId: string, vendorId: string) {
    try {
      console.log(userId,vendorId);
      
      const chatService = await this.chatRepository.userCompanyAddMessageDB(text, userId, vendorId);
      return chatService;
    } catch (error) {
      console.error("Service error:", error);
      throw new Error("Could not save chat.");
    }
  };

}

