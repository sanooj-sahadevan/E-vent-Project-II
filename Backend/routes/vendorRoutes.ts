import express from "express";
import {
     login,
     register,
     verifyOtp,
     editVendorDetails,softDeleteAuditorium,
      addDishes, addAuditorium, fetchDetailsVendor, fetchFoodDetails, fetchAuditoriumDetails,fetchdishes,fetchauditorium,softDeleteDish,
} from "../controller/vendorController.js";
import upload from "../middleware/multer.js";
import { verifyvendor } from "../middleware/vendorJWT.js";

const router = express.Router();

router.post("/signup", register);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.patch('/editVendorDetails', upload.single('image'), editVendorDetails);
router.post('/addDishes', verifyvendor, upload.single('image'), addDishes);
router.post('/addAuditorium', verifyvendor, upload.single('image'), addAuditorium);
router.get('/fetchDetailsVendor/:vendorId', fetchDetailsVendor);



router.get('/fetchFoodDetails/:vendorId', fetchFoodDetails);


router.get('/fetchAuditoriumDetails/:vendorId', fetchAuditoriumDetails);


router.get('/fetchauditorium/:auditoriumId', fetchauditorium);
router.get('/fetchdishes/:dishesId', fetchdishes);







router.patch('/dishes/:dishId',softDeleteDish);
router.patch('/auditorium/:auditoriumId',softDeleteAuditorium);



export default router;
