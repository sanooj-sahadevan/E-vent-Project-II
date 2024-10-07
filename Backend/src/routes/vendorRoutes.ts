import { Router } from "express";
import upload from "../middleware/multer";
import { verifyvendor } from "../middleware/vendorJWT";
import { VendorController } from "../controller/vendorController";
import { UserController } from "../controller/userController";
import { VendorRepository } from "../Repository/vendorRepo";
import { VendorService } from "../Service/vendorService";
// import vendorController from "../controller/vendorController"


const router = Router();
const vendorRepository = new VendorRepository()
const vendorService = new VendorService(vendorRepository)

const vendorController = new VendorController(vendorService)





router.post("/signup", vendorController.register.bind(vendorController));
router.post("/verifyOtp", vendorController.verifyOtp.bind(vendorController));
router.post("/login", vendorController.login.bind(vendorController));
router.patch('/editVendorDetails', upload.single('image'), vendorController.editVendorDetails.bind(vendorController));
router.post('/addDishes', verifyvendor, upload.single('image'), vendorController.addDishes.bind(vendorController));
router.post('/addAuditorium', verifyvendor, upload.single('image'), vendorController.addAuditorium.bind(vendorController));


router.get('/fetchDetailsVendor/:vendorId', vendorController.fetchDetailsVendor.bind(vendorController));
router.get('/fetchFoodDetails/:vendorId', vendorController.fetchFoodDetails.bind(vendorController));
router.get('/fetchAuditoriumDetails/:vendorId', vendorController.fetchAuditoriumDetails.bind(vendorController));


router.get('/fetchauditorium/:auditoriumId', vendorController.fetchauditorium.bind(vendorController));
router.get('/fetchdishes/:dishesId', vendorController.fetchdishes.bind(vendorController));







router.patch('/dishes/:dishId', vendorController.softDeleteDish.bind(vendorController));
router.patch('/auditorium/:auditoriumId', vendorController.softDeleteAuditorium.bind(vendorController));
router.get('/vendorBookingDetils/:vendorId', vendorController.vendorBookingDetils.bind(vendorController));
router.get('/unread-count', verifyvendor, vendorController.getUnreadMessagesCount.bind(vendorController));


export default router;
