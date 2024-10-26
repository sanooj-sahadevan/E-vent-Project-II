"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    getMessageService(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.chatRepository.getMessagesByChatId(chatId);
                if (messages.length > 0) {
                    yield this.chatRepository.markMessagesAsRead(chatId);
                }
                const updatedMessages = yield this.chatRepository.getMessagesByChatId(chatId);
                return updatedMessages;
            }
            catch (error) {
                throw new Error('Failed to process messages in service');
            }
        });
    }
    ;
    userGetMessageService(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.chatRepository.userGetMessagesByChatId(chatId);
                if (messages.length > 0) {
                    yield this.chatRepository.markMessagesAsRead(chatId);
                }
                const updatedMessages = yield this.chatRepository.userGetMessagesByChatId(chatId);
                return updatedMessages;
            }
            catch (error) {
                throw new Error('Failed to process messages in service');
            }
        });
    }
    ;
    savechatService(text, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatService = yield this.chatRepository.savechatDB(text, userId, vendorId);
                return chatService;
            }
            catch (error) {
                console.error("Service error:", error);
                throw new Error("Could not save chat.");
            }
        });
    }
    ;
    chatController(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield this.chatRepository.chatService(vendorId);
                return chat;
            }
            catch (error) {
                console.error("Service error:", error);
                throw new Error("Could not fetch chat data.");
            }
        });
    }
    ;
    userchatController(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield this.chatRepository.userchatService(userId);
                console.log(chat, userId, '0o0o0o0o0o0o0o');
                return chat;
            }
            catch (error) {
                console.error("Service error:", error);
                throw new Error("Could not fetch chat data.");
            }
        });
    }
    ;
    companyAddMessageService(text, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatService = yield this.chatRepository.companyAddMessageDB(text, userId, vendorId);
                return chatService;
            }
            catch (error) {
                console.error("Service error:", error);
                throw new Error("Could not save chat.");
            }
        });
    }
    ;
    userCompanyAddMessageService(text, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, vendorId);
                const chatService = yield this.chatRepository.userCompanyAddMessageDB(text, userId, vendorId);
                return chatService;
            }
            catch (error) {
                console.error("Service error:", error);
                throw new Error("Could not save chat.");
            }
        });
    }
    ;
}
exports.ChatService = ChatService;
