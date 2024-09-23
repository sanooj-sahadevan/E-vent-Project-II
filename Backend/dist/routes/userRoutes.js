import express from "express";
import { 
// googleLoginHandler,
login, register, verifyOtp, vendorList, editUserDetails, forgottenPassword, dishlist, updatePassword, auditoriumlist, fetchVendorDetails, fetchFoodDetails, fetchAuditoriumDetails, fetchauditorium, fetchdishes, fetchBookedData, payment, addTransaction, saveDB, } from "../controller/userController.js";
const router = express.Router();
router.post("/signup", register);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.get('/vendors', vendorList);
router.get('/dishlist', dishlist);
router.get('/auditoriumlist', auditoriumlist);
router.patch('/edituserDetails', editUserDetails);
router.post('/forgottenpassword', forgottenPassword);
router.post('/updatePassword', updatePassword);
router.get('/fetchVendorDetails/:vendorId', fetchVendorDetails);
router.get('/fetchFoodDetails/:vendorId', fetchFoodDetails);
router.get('/fetchAuditoriumDetails/:vendorId', fetchAuditoriumDetails);
router.get("/bookEvent/:id", fetchBookedData);
// info
router.get('/fetchauditorium/:auditoriumId', fetchauditorium);
router.get('/fetchdishes/:dishesId', fetchdishes);
router.post('/saveDB', saveDB); // Use POST instead of GET
router.post('/payment', payment);
router.post('/addTransaction', addTransaction);
// router.post('/response/saveData', saveData)
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
