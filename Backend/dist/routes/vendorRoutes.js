import express from "express";
import { login, register, verifyOtp, editVendorDetails } from "../controller/vendorController.js";
const router = express.Router();
router.post("/signup", register);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
// Update vendor details route
router.patch('/editVendorDetails', editVendorDetails);
export default router;
