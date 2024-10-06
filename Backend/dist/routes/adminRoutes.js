"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = __importDefault(require("../controller/adminController"));
const router = express_1.default.Router();
router.post("/login", adminController_1.default.adminlogin);
router.get("/getAllVendors", adminController_1.default.getAllVendors);
router.put("/vendor/blockUser/:id", adminController_1.default.blockVendorController);
router.put("/vendor/unblockUser/:id", adminController_1.default.unblockVendorController);
router.get("/getAllUsers", adminController_1.default.getUsersList);
router.put("/blockUser/:id", adminController_1.default.blockUserController);
router.put("/unblockUser/:id", adminController_1.default.unblockUserController);
router.get("/getAllBookings", adminController_1.default.getAllBookings);
router.get("/dashboard", adminController_1.default.DashboardController);
exports.default = router;
