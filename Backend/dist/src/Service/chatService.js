import { savechatDB, companyAddMessageDB } from "../Repository/chatRepo.js";
export const savechatService = async (text, userId, vendorId) => {
    try {
        const chatService = await savechatDB(text, userId, vendorId);
        return chatService;
    }
    catch (error) {
        console.error("Service error:", error);
        throw new Error("Could not save chat."); // Throw an error if there's an issue
    }
};
export const companyAddMessageService = async (text, userId, vendorId) => {
    try {
        const chatService = await companyAddMessageDB(text, userId, vendorId);
        return chatService;
    }
    catch (error) {
        console.error("Service error:", error);
        throw new Error("Could not save chat.");
    }
};
