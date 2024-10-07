import {
  savechatDB,companyAddMessageDB
} from "../Repository/chatRepo";


export const savechatService = async (text: string, userId: string, vendorId: string) => {
  try {
      const chatService = await savechatDB(text, userId, vendorId);  
      return chatService;  
  } catch (error) {
      console.error("Service error:", error);
      throw new Error("Could not save chat."); 
  }
};





export const companyAddMessageService = async (text: string, userId: string, vendorId: string) => {
  try {
    const chatService = await companyAddMessageDB(text, userId, vendorId);  
    return chatService;  
  } catch (error) {
    console.error("Service error:", error);
    throw new Error("Could not save chat.");
  }
};



  
  
