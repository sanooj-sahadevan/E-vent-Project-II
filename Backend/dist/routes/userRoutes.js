import express from "express";
import { 
// googleLoginHandler,
login, proceedWithRegistration, verifyOtp, vendorList, editUserDetails, forgottenPassword, dishlist, updatePassword, auditoriumlist, fetchVendorDetails, fetchBookingDetails, fetchFoodDetails, fetchAuditoriumDetails, fetchauditorium, fetchdishes, fetchBookedData, saveData, payment, addTransaction, changePassword, } from "../controller/userController.js";
// import { verifyUser } from "../middleware/userJWT.js";
const router = express.Router();
router.post("/signup", proceedWithRegistration);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.get('/vendors', vendorList);
router.get('/dishlist', dishlist);
router.get('/auditoriumlist', auditoriumlist);
router.patch('/edituserDetails', editUserDetails);
router.post('/forgottenpassword', forgottenPassword);
router.post('/updatePassword', updatePassword);
router.get('/fetchVendorDetails', fetchVendorDetails);
router.get('/fetchFoodDetails/:vendorId', fetchFoodDetails);
router.get('/fetchAuditoriumDetails/:vendorId', fetchAuditoriumDetails);
//book event
router.get("/bookEvent/:id", fetchBookedData);
// info
router.get('/fetchauditorium/:auditoriumId', fetchauditorium);
router.get('/fetchdishes/:dishesId', fetchdishes);
// payment
router.post('/payment', payment);
router.post('/addTransaction', addTransaction);
router.post('/response/saveData', saveData);
router.get('/fetchBookingDetails/:userId', fetchBookingDetails);
router.patch('/changePassword/:id', changePassword);
export default router;
