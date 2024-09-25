import express from "express";
import {
    savechat,getUnreadMessagesCount,companyChat,
    
} from "../controller/chatController.js";
import { verifyUser } from "../middleware/userJWT.js";
const router = express.Router();


router.post('/savechat', savechat); 

router.get('/messages/unread-count/:userId', getUnreadMessagesCount);



router.get("/company/:companyId", companyChat);



export default router;