import express from "express";
import { googleLoginHandler, login, register, verifyOtp } from "../controller/userController.js";
const router = express.Router();
router.post("/signup", register);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.post("/googleLogin", googleLoginHandler); // googleLoginHandler
export default router;
