import { Router } from "express";
import { UserController } from "../controller/userController";
import { UserService } from "../Service/userService";
import { UserRepository } from "../Repository/userReop";

const router = Router();
const userRepository = new UserRepository()
const userService = new UserService(userRepository)

const userController = new UserController(userService)

router.post("/signup", userController.register.bind(userController));
router.post("/verifyOtp", userController.verifyOtp.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get('/vendors', userController.vendorList.bind(userController));


router.get('/dishlist', userController.dishlist.bind(userController));
router.get('/auditoriumlist', userController.auditoriumlist.bind(userController));

router.patch('/edituserDetails', userController.editUserDetails.bind(userController));
router.post('/forgottenpassword', userController.forgottenPassword.bind(userController));
router.post('/updatePassword', userController.updatePassword.bind(userController))



router.get('/fetchVendorDetails', userController.fetchVendorDetails.bind(userController));
router.get('/fetchFoodDetails/:vendorId', userController.fetchFoodDetails.bind(userController));
router.get('/fetchAuditoriumDetails/:vendorId', userController.fetchAuditoriumDetails.bind(userController));



//book event
router.get("/bookEvent/:id", userController.fetchBookedData.bind(userController));


// info
router.get('/fetchauditorium/:auditoriumId', userController.fetchauditorium.bind(userController));
router.get('/fetchdishes/:dishesId', userController.fetchdishes.bind(userController));



// payment
router.post('/payment', userController.payment.bind(userController));
router.post('/addTransaction', userController.addTransaction.bind(userController));
router.post('/response/saveData', userController.saveData.bind(userController));




router.get('/fetchBookingDetails/:userId', userController.fetchBookingDetails.bind(userController));
router.patch('/changePassword/:id', userController.changePassword.bind(userController));


export default router;











