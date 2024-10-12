"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../middleware/multer"));
const vendorJWT_1 = require("../middleware/vendorJWT");
const vendorController_1 = require("../controller/vendorController");
const vendorRepo_1 = require("../Repository/vendorRepo");
const vendorService_1 = require("../Service/vendorService");
const router = (0, express_1.Router)();
const vendorRepository = new vendorRepo_1.VendorRepository();
const vendorService = new vendorService_1.VendorService(vendorRepository);
const vendorController = new vendorController_1.VendorController(vendorService);
// Auth
router.post("/signup", vendorController.register.bind(vendorController));
router.post("/verifyOtp", vendorController.verifyOtp.bind(vendorController));
router.post("/login", vendorController.login.bind(vendorController));
// vndor Dashboard
router.patch('/editVendorDetails', multer_1.default.single('image'), vendorController.editVendorDetails.bind(vendorController));
router.post('/addDishes', vendorJWT_1.verifyvendor, multer_1.default.single('image'), vendorController.addDishes.bind(vendorController));
router.post('/addAuditorium', vendorJWT_1.verifyvendor, multer_1.default.single('image'), vendorController.addAuditorium.bind(vendorController));
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
router.get('/unread-count', vendorJWT_1.verifyvendor, vendorController.getUnreadMessagesCount.bind(vendorController));
exports.default = router;
