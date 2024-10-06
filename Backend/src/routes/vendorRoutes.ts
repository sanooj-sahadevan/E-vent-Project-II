import express from "express";
import upload from "../middleware/multer";
import { verifyvendor } from "../middleware/vendorJWT";
import vendorController from "../controller/vendorController"


const router = express.Router();

router.post("/signup", vendorController.register);
router.post("/verifyOtp", vendorController.verifyOtp);
router.post("/login", vendorController.login);
router.patch('/editVendorDetails', upload.single('image'), vendorController.editVendorDetails);
router.post('/addDishes', verifyvendor, upload.single('image'), vendorController.addDishes);
router.post('/addAuditorium', verifyvendor, upload.single('image'), vendorController.addAuditorium);


router.get('/fetchDetailsVendor/:vendorId', vendorController.fetchDetailsVendor);
router.get('/fetchFoodDetails/:vendorId', vendorController.fetchFoodDetails);
router.get('/fetchAuditoriumDetails/:vendorId', vendorController.fetchAuditoriumDetails);


router.get('/fetchauditorium/:auditoriumId', vendorController.fetchauditorium);
router.get('/fetchdishes/:dishesId', vendorController.fetchdishes);







router.patch('/dishes/:dishId', vendorController.softDeleteDish);
router.patch('/auditorium/:auditoriumId', vendorController.softDeleteAuditorium);
router.get('/vendorBookingDetils/:vendorId', vendorController.vendorBookingDetils);
router.get('/unread-count', verifyvendor, vendorController.getUnreadMessagesCount);


export default router;
