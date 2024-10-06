"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
const router = (0, express_1.Router)();
router.post("/signup", userController_1.default.register);
router.post("/verifyOtp", userController_1.default.verifyOtp);
router.post("/login", userController_1.default.login);
router.get('/vendors', userController_1.default.vendorList);
router.get('/dishlist', userController_1.default.dishlist);
router.get('/auditoriumlist', userController_1.default.auditoriumlist);
router.patch('/edituserDetails', userController_1.default.editUserDetails);
router.post('/forgottenpassword', userController_1.default.forgottenPassword);
router.post('/updatePassword', userController_1.default.updatePassword);
router.get('/fetchVendorDetails', userController_1.default.fetchVendorDetails);
router.get('/fetchFoodDetails/:vendorId', userController_1.default.fetchFoodDetails);
router.get('/fetchAuditoriumDetails/:vendorId', userController_1.default.fetchAuditoriumDetails);
//book event
router.get("/bookEvent/:id", userController_1.default.fetchBookedData);
// info
router.get('/fetchauditorium/:auditoriumId', userController_1.default.fetchauditorium);
router.get('/fetchdishes/:dishesId', userController_1.default.fetchdishes);
// payment
router.post('/payment', userController_1.default.payment);
router.post('/addTransaction', userController_1.default.addTransaction);
router.post('/response/saveData', userController_1.default.saveData);
router.get('/fetchBookingDetails/:userId', userController_1.default.fetchBookingDetails);
router.patch('/changePassword/:id', userController_1.default.changePassword);
exports.default = router;
