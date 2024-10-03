import express from 'express';
import { adminlogin,getAllVendors,blockVendorController,getAllBookings,DashboardController,
    unblockVendorController,getUsersList ,unblockUserController,
    blockUserController} from '../controller/adminController.js';

const router = express.Router();

router.post("/login", adminlogin);

router.get("/getAllVendors", getAllVendors);
router.put("/vendor/blockUser/:id", blockVendorController);
router.put("/vendor/unblockUser/:id",  unblockVendorController);


router.get("/getAllUsers",  getUsersList);
router.put("/blockUser/:id", blockUserController);
router.put("/unblockUser/:id",  unblockUserController);

router.get("/getAllBookings",  getAllBookings);
router.get("/dashboard",  DashboardController);





export default router;
