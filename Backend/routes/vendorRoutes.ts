import express  from "express";
import { 
     login, fetchAddress,
     register, 
     verifyOtp
     } from "../controller/vendorController.js";



const router = express.Router();

router.post("/signup", register);
router.post("/verifyOtp", verifyOtp);

router.post("/login", login);

router.get('/getAddress', fetchAddress);


export default router;