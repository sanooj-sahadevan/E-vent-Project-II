import express from "express";
import { ChatRepository } from "../Repository/chatRepo";
import { ChatController } from "../controller/chatController";
import { ChatService } from "../Service/chatService";

const router = express.Router();
const chatRepository = new ChatRepository()
const chatService = new ChatService(chatRepository)
const chatController = new ChatController(chatService)

router.post('/savechat', chatController.savechat.bind(chatController));
router.get('/message/:chatId', chatController.getMessage.bind(chatController));
router.get("/company/:companyId", chatController.companyChat.bind(chatController));
router.get("/usercompany/:companyId", chatController.usercompanyChat.bind(chatController));
router.post("/message", chatController.companyAddMessage.bind(chatController))
router.post("/usermessage", chatController.userCompanyAddMessage.bind(chatController))
router.get('/message/:chatId', chatController.userGetMessage.bind(chatController));


export default router;