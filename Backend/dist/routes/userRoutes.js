import express from "express";
import { 
// googleLoginHandler,
login, register, verifyOtp, vendorList, editUserDetails
// forgottenPassword,updatePassword 
 } from "../controller/userController.js";
import { verifyUser } from '../middleware/userJWT.js';
const router = express.Router();
router.post("/signup", register);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.get('/vendors', vendorList);
router.patch('/edituserDetails', verifyUser, editUserDetails);
// // router.post("/googleLogin", googleLoginHandler); 
// // router.post('/forgottenpassword',forgottenPassword)
// // router.post('/updatePassword',updatePassword)
export default router;
// import { Router } from 'express';
// import { LoginController, VendorController, UserController } from '../controller/userController.js';
// import { verifyUser } from '../middleware/userJWT.js';
// const router = Router();
// // Instantiate controllers
// const loginController = new LoginController();
// const vendorController = new VendorController();
// const userController = new UserController();
// // Define routes
// router.post('/login', loginController.login.bind(loginController));
// router.get('/vendors', vendorController.getAllVendors.bind(vendorController));
// // router.post('/signup', userController.register.bind(userController));
// export default router;
