import express from 'express';
import adminController from "../controller/adminController";

const router = express.Router();

router.post("/login", adminController.adminlogin);

router.get("/getAllVendors", adminController.getAllVendors);
router.put("/vendor/blockUser/:id", adminController.blockVendorController);
router.put("/vendor/unblockUser/:id",  adminController.unblockVendorController);


router.get("/getAllUsers",  adminController.getUsersList);
router.put("/blockUser/:id", adminController.blockUserController);
router.put("/unblockUser/:id",  adminController.unblockUserController);

router.get("/getAllBookings",  adminController.getAllBookings);
router.get("/dashboard",  adminController.DashboardController);





export default router;
