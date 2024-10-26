import { Router } from "express";
import { UserController } from "../controller/userController";
import { UserService } from "../Service/userService";
import { UserRepository } from "../Repository/userReop";
import { baseRepo } from "../Base Repository/BaseRepo";


const router = Router();
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)


// Auth
router.post("/signup", userController.register.bind(userController));
router.post("/verifyOtp", userController.verifyOtp.bind(userController));
router.post("/login", userController.login.bind(userController));
router.get('/vendors', userController.vendorList.bind(userController));
router.post('/forgottenpassword', userController.forgottenPassword.bind(userController));
router.post('/updatePassword', userController.updatePassword.bind(userController))


router.get('/dishlist', userController.dishlist.bind(userController));
router.get('/auditoriumlist', userController.auditoriumlist.bind(userController));
router.patch('/edituserDetails', userController.editUserDetails.bind(userController));


// All fetch
router.get('/fetchVendorDetails', userController.fetchVendorDetails.bind(userController));
router.get('/fetchReview', userController.fetchReview.bind(userController));
router.get('/fetchNotifications', userController.fetchNotifications.bind(userController));

router.get('/fetchFoodDetails/:vendorId', userController.fetchFoodDetails.bind(userController));
router.get('/fetchAuditoriumDetails/:vendorId', userController.fetchAuditoriumDetails.bind(userController));
router.get('/fetchauditorium/:auditoriumId', userController.fetchauditorium.bind(userController));
router.get('/fetchdishes/:dishesId', userController.fetchdishes.bind(userController));


router.get("/bookEvent/:id", userController.fetchBookedData.bind(userController));


// payment
router.post('/payment', userController.payment.bind(userController));
router.post('/addTransaction', userController.addTransaction.bind(userController));
router.post('/response/saveData', userController.saveData.bind(userController));


//profile section
router.get('/fetchBookingDetails/:userId', userController.fetchBookingDetails.bind(userController));
router.patch('/changePassword/:id', userController.changePassword.bind(userController));
router.get('/userunread-count', userController.getUnreadMessagesCount.bind(userController));
//review
router.post('/review', userController.review.bind(userController));
router.get("/slots/:vendorId", userController.getSlotsByWorkerController.bind(userController));
router.get('/searchUsers', userController.searchVendors.bind(userController));


export default router;











