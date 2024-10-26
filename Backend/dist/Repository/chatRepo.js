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
exports.ChatRepository = void 0;
const chatModel_1 = require("../models/chatModel");
const messageModal_1 = require("../models/messageModal");
const index_1 = require("../index");
class ChatRepository {
    constructor() {
    }
    getMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield messageModal_1.messageModel.find({ chatId }).populate('senderId');
            }
            catch (error) {
                throw new Error('Error fetching messages from the database');
            }
        });
    }
    ;
    userGetMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield messageModal_1.messageModel.find({ chatId }).populate('senderId');
            }
            catch (error) {
                throw new Error('Error fetching messages from the database');
            }
        });
    }
    ;
    markMessagesAsRead(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield messageModal_1.messageModel.updateMany({ chatId }, { $set: { isRead: true } });
            }
            catch (error) {
                throw new Error('Error updating message status to read');
            }
        });
    }
    ;
    savechatDB(text, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatDocument = yield chatModel_1.chatModel.findOne({ userId, vendorId });
                if (!chatDocument) {
                    throw new Error("Chat not found for the given user and vendor.");
                }
                const result = new messageModal_1.messageModel({
                    chatId: chatDocument._id,
                    senderId: userId,
                    senderModel: "User",
                    text: text,
                    isRead: false,
                });
                const savedMessage = yield result.save();
                index_1.io.to(chatDocument._id.toString()).emit("message", {
                    _id: savedMessage._id,
                    chatId: savedMessage.chatId,
                    senderId: savedMessage.senderId,
                    senderModel: savedMessage.senderModel,
                    text: savedMessage.text,
                    isRead: savedMessage.isRead,
                    createdAt: savedMessage.createdAt,
                });
                const chats = yield chatModel_1.chatModel.find({ vendorId: vendorId }).select('_id');
                const chatIds = chats.map(chat => chat._id);
                const unreadCount = yield messageModal_1.messageModel.countDocuments({
                    chatId: { $in: chatIds },
                    senderModel: "User",
                    isRead: false,
                });
                index_1.io.to(vendorId).emit("unreadCount", { unreadCount });
                return savedMessage;
            }
            catch (error) {
                console.error("Database error:", error);
                throw new Error("Database operation failed.");
            }
        });
    }
    ;
    companyAddMessageDB(text, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatDocument = yield chatModel_1.chatModel.findOne({ userId, vendorId });
                if (!chatDocument) {
                    throw new Error("Chat not found for the given user and vendor.");
                }
                const result = new messageModal_1.messageModel({
                    chatId: chatDocument._id,
                    senderId: vendorId,
                    senderModel: "Vendor",
                    text: text,
                    isRead: false,
                });
                const savedMessage = yield result.save();
                console.log(savedMessage, 'ok', savedMessage.chatId);
                index_1.io.to(chatDocument._id.toString()).emit("message", {
                    _id: savedMessage._id,
                    chatId: savedMessage.chatId,
                    senderId: savedMessage.senderId,
                    senderModel: savedMessage.senderModel,
                    text: savedMessage.text,
                    isRead: savedMessage.isRead,
                    createdAt: savedMessage.createdAt
                });
                console.log('Message emitted successfully');
                return savedMessage;
            }
            catch (error) {
                console.error("Database error:", error);
                throw new Error("Database operation failed.");
            }
        });
    }
    ;
    userCompanyAddMessageDB(text, userId, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, vendorId);
                const chatDocument = yield chatModel_1.chatModel.findOne({ userId, vendorId });
                if (!chatDocument) {
                    throw new Error("Chat not found for the given user and vendor.");
                }
                const result = new messageModal_1.messageModel({
                    chatId: chatDocument._id,
                    senderId: userId,
                    senderModel: "User",
                    text: text,
                    isRead: false,
                });
                const savedMessage = yield result.save();
                console.log(savedMessage, 'ok', savedMessage.chatId);
                index_1.io.to(chatDocument._id.toString()).emit("message", {
                    _id: savedMessage._id,
                    chatId: savedMessage.chatId,
                    senderId: savedMessage.senderId,
                    senderModel: savedMessage.senderModel,
                    text: savedMessage.text,
                    isRead: savedMessage.isRead,
                    createdAt: savedMessage.createdAt
                });
                console.log('Message emitted successfully');
                return savedMessage;
            }
            catch (error) {
                console.error("Database error:", error);
                throw new Error("Database operation failed.");
            }
        });
    }
    ;
    chatService(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield chatModel_1.chatModel.find({
                    vendorId,
                }).populate("userId");
                return chat;
            }
            catch (error) {
                console.error("Repository error:", error);
                throw new Error("Could not retrieve chat data.");
            }
        });
    }
    ;
    userchatService(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield chatModel_1.chatModel.find({
                    userId,
                }).populate("vendorId");
                console.log(chat, '000000000000000000000000000000000000000000000');
                return chat;
            }
            catch (error) {
                console.error("Repository error:", error);
                throw new Error("Could not retrieve chat data.");
            }
        });
    }
    ;
}
exports.ChatRepository = ChatRepository;
