import { savechatService, companyAddMessageService } from "../Service/chatService.js";
import { HttpStatus } from '../utils/httpStatus.js';
import { messageModel } from "../models/messageModal.js";
import { chatModel } from "../models/chatModel.js";
export const savechat = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.body.senderId;
        const vendorId = req.body.vendorId;
        const result = await savechatService(text, userId, vendorId);
        res.status(HttpStatus.OK).json(result);
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
};
export const getMessage = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await messageModel.find({ chatId }).populate("senderId");
        if (!messages.length) {
            return res
                .status(HttpStatus.NOT_FOUND)
                .json({ message: "No messages found for this chat" });
        }
        await messageModel.updateMany({ chatId }, { $set: { isRead: true } });
        const updatedMessages = await messageModel.find({ chatId }).populate("senderId");
        res.status(HttpStatus.OK).json(updatedMessages);
    }
    catch (error) {
        res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Failed to retrieve messages", error: error.message });
    }
};
export const companyChat = async (req, res) => {
    try {
        const chat = await chatModel.find({
            vendorId: req.params.companyId,
        }).populate("userId");
        res.status(HttpStatus.OK).json(chat);
    }
    catch (error) {
        next(error);
    }
};
export const companyAddMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const vendorId = req.body.senderId;
        const userId = req.body.userId;
        const result = await companyAddMessageService(text, userId, vendorId);
        res.status(HttpStatus.OK).json(result);
    }
    catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
};
function next(error) {
    throw new Error("Function not implemented.");
}
