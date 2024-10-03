import express from "express";
import {
    savechat,getMessage,companyChat,companyAddMessage
    
} from "../controller/chatController.js";
import { verifyUser } from "../middleware/userJWT.js";
const router = express.Router();


router.post('/savechat', savechat); 

router.get('/message/:chatId', getMessage);



router.get("/company/:companyId", companyChat);

router.post("/message", companyAddMessage)



export default router;