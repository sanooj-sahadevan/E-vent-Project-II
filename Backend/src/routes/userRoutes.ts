import { Router } from "express";
import userController from "../controller/userController.js"

const router = Router();

router.post("/signup", userController.register);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/login", userController.login);
router.get('/vendors', userController.vendorList);


router.get('/dishlist', userController.dishlist);
router.get('/auditoriumlist', userController.auditoriumlist);

router.patch('/edituserDetails', userController.editUserDetails);
router.post('/forgottenpassword', userController.forgottenPassword);
router.post('/updatePassword', userController.updatePassword)



router.get('/fetchVendorDetails', userController.fetchVendorDetails);
router.get('/fetchFoodDetails/:vendorId', userController.fetchFoodDetails);
router.get('/fetchAuditoriumDetails/:vendorId', userController.fetchAuditoriumDetails);



//book event
router.get("/bookEvent/:id", userController.fetchBookedData);


// info
router.get('/fetchauditorium/:auditoriumId', userController.fetchauditorium);
router.get('/fetchdishes/:dishesId', userController.fetchdishes);



// payment
router.post('/payment', userController.payment);
router.post('/addTransaction', userController.addTransaction);
router.post('/response/saveData', userController.saveData);




router.get('/fetchBookingDetails/:userId', userController.fetchBookingDetails);

router.patch('/changePassword/:id', userController.changePassword);


export default router;











