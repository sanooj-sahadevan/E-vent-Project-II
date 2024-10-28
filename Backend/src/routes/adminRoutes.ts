import { Router } from "express";
import { AdminRepository } from "../Repository/adminRepo";
import { AdminService } from "../Service/adminService";
import { AdminController } from "../controller/adminController";

const router = Router();

const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)


router.post("/login", adminController.adminlogin.bind(adminController));
router.get("/getAllVendors", adminController.getAllVendors.bind(adminController));
router.put("/vendor/blockUser/:id", adminController.blockVendorController.bind(adminController));
router.put("/vendor/unblockUser/:id", adminController.unblockVendorController.bind(adminController));


router.get("/getAllUsers", adminController.getUsersList.bind(adminController));
router.put("/blockUser/:id", adminController.blockUserController.bind(adminController));
router.put("/unblockUser/:id", adminController.unblockUserController.bind(adminController));

router.get("/getAllBookings", adminController.getAllBookings.bind(adminController));
router.get("/dashboard", adminController.DashboardController.bind(adminController));





export default router;
