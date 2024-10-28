import { Router } from "express";
import upload from "../middleware/multer";
import { verifyvendor } from "../middleware/vendorJWT";
import { VendorController } from "../controller/vendorController";
import { VendorRepository } from "../Repository/vendorRepo";
import { VendorService } from "../Service/vendorService";
import multer from "multer";


const router = Router();
const vendorRepository = new VendorRepository()
const vendorService = new VendorService(vendorRepository)
const vendorController = new VendorController(vendorService)


// Auth
router.post("/signup", vendorController.register.bind(vendorController));
router.post("/verifyOtp", vendorController.verifyOtp.bind(vendorController));
router.post("/login", vendorController.login.bind(vendorController));

// vndor Dashboard
router.patch('/editVendorDetails', upload.single('image'), vendorController.editVendorDetails.bind(vendorController));
router.post('/addDishes', verifyvendor, upload.single('image'), vendorController.addDishes.bind(vendorController));
router.post('/addAuditorium', verifyvendor, upload.single('image'), vendorController.addAuditorium.bind(vendorController));


router.get('/fetchDetailsVendor/:vendorId', vendorController.fetchDetailsVendor.bind(vendorController));
router.get('/fetchFoodDetails/:vendorId', vendorController.fetchFoodDetails.bind(vendorController));
router.get('/fetchAuditoriumDetails/:vendorId', vendorController.fetchAuditoriumDetails.bind(vendorController));
router.get('/fetchauditorium/:auditoriumId', vendorController.fetchauditorium.bind(vendorController));
router.get('/fetchdishes/:dishesId', vendorController.fetchdishes.bind(vendorController));
router.get('/fetchReviews/:vendorId', vendorController.fetchReviews.bind(vendorController));



router.get("/getPresignedUrl", vendorController.getPresignedUrl.bind(vendorController));
router.patch('/dishes/:dishId', vendorController.softDeleteDish.bind(vendorController));
router.patch('/auditorium/:auditoriumId', vendorController.softDeleteAuditorium.bind(vendorController));
router.patch('/approveReview/:reviewId', vendorController.approveReview.bind(vendorController));
router.delete('/rejectReview/:reviewId', vendorController.rejectReview.bind(vendorController));

router.get('/vendorBookingDetils/:vendorId', vendorController.vendorBookingDetils.bind(vendorController));
router.get('/unread-count', verifyvendor, vendorController.getUnreadMessagesCount.bind(vendorController));

router.post("/create-slot/:vendorId", vendorController.createSlotController.bind(vendorController));
router.get("/slots/:vendorId", vendorController.getSlotsByWorkerController.bind(vendorController));


router.post("/serviceImage", vendorController.uploadVendorImages.bind(vendorController))

export default router;
