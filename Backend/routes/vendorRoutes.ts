import express from "express";
import {
     login,
     register,
     verifyOtp,
     editVendorDetails,
     fetchVendorDetails,addDishes,addAuditorium
} from "../controller/vendorController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", register);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.patch('/editVendorDetails', upload.single('image'), editVendorDetails);
router.get('/fetchVendorDetails/:vendorId', fetchVendorDetails);
router.post('/addDishes', upload.single('image'), addDishes);
router.post('/addAuditorium', upload.single('image'), addAuditorium);



export default router;
