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
exports.ChatController = void 0;
const httpStatus_1 = require("../utils/httpStatus");
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    savechat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { text } = req.body;
                const userId = req.body.senderId;
                const vendorId = req.body.vendorId;
                const result = yield this.chatService.savechatService(text, userId, vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
        });
    }
    ;
    getMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chatId } = req.params;
            try {
                const updatedMessages = yield this.chatService.getMessageService(chatId);
                if (!updatedMessages.length) {
                    return res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json({ message: "No messages found for this chat" });
                }
                res.status(httpStatus_1.HttpStatus.OK).json(updatedMessages);
            }
            catch (error) {
                res
                    .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to retrieve messages", error: error.message });
            }
        });
    }
    ;
    userGetMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chatId } = req.params;
            try {
                const updatedMessages = yield this.chatService.userGetMessageService(chatId);
                if (!updatedMessages.length) {
                    return res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json({ message: "No messages found for this chat" });
                }
                res.status(httpStatus_1.HttpStatus.OK).json(updatedMessages);
            }
            catch (error) {
                res
                    .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: "Failed to retrieve messages", error: error.message });
            }
        });
    }
    ;
    companyChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatResponse = yield this.chatService.chatController(req.params.companyId);
                res.status(httpStatus_1.HttpStatus.OK).json(chatResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    usercompanyChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.params.userId, 'ok da');
                const chatResponse = yield this.chatService.userchatController(req.params.companyId);
                res.status(httpStatus_1.HttpStatus.OK).json(chatResponse);
            }
            catch (error) {
                next(error);
            }
        });
    }
    ;
    companyAddMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { text } = req.body;
                const vendorId = req.body.senderId;
                const userId = req.body.userId;
                const result = yield this.chatService.companyAddMessageService(text, userId, vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
        });
    }
    ;
    userCompanyAddMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { text } = req.body;
                const userId = req.body.senderId;
                const vendorId = req.body.userId;
                const result = yield this.chatService.userCompanyAddMessageService(text, userId, vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
        });
    }
    ;
}
exports.ChatController = ChatController;
