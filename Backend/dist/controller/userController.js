"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const otpGenerator_1 = require("../utils/otpGenerator");
const sendEmail_1 = require("../utils/sendEmail");
const httpStatus_1 = require("../utils/httpStatus");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, token } = yield this.userService.loginUser(email, password);
                res.cookie("token", token, {
                    sameSite: 'strict',
                    maxAge: 3600000,
                });
                res.status(httpStatus_1.HttpStatus.OK).json({ user, token });
            }
            catch (error) {
                next(error.message);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                console.log({ otp });
                const result = yield this.userService.verifyOtpService(email, otp);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: error.message });
            }
        });
    }
    vendorList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendors = yield this.userService.getAllVendors();
                res.status(httpStatus_1.HttpStatus.OK).json(vendors);
            }
            catch (error) {
                next(error);
            }
        });
    }
    dishlist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.query;
                const dishes = yield this.userService.getAllDishes(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(dishes);
            }
            catch (error) {
                next(error);
            }
        });
    }
    auditoriumlist(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.query;
                const auditorium = yield this.userService.getAllAuditorium(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(auditorium);
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgottenPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const { user, otp } = yield this.userService.checkEmail(email);
                if (!user) {
                    return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ error: 'User not found' });
                }
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'OTP sent successfully', otp, email });
            }
            catch (error) {
                next(error.message);
            }
        });
    }
    updatePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userService.update(email, password);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: "Password updated successfully", user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    editUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = req.body;
                console.log('Request Body:', userDetails);
                const updatedUser = yield this.userService.editUser(userDetails);
                res.status(httpStatus_1.HttpStatus.OK).json(updatedUser);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchVendorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId, userId } = req.query;
                const result = yield this.userService.findVendorById(vendorId, userId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('kokokokokokkokokokokokokokokokok');
            try {
                const { vendorId, userId } = req.query;
                const result = yield this.userService.fetchReviewById(vendorId, userId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                console.log('sanooj', userId);
                const result = yield this.userService.fetchNotificationsById(userId);
                res.status(httpStatus_1.HttpStatus.OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchFoodDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const dishes = yield this.userService.findFoodVendorById(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(dishes);
            }
            catch (error) {
                console.error('Error in fetchFoodDetails:', error);
                next(error);
            }
        });
    }
    fetchAuditoriumDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const dishes = yield this.userService.findAuditoriumVendorById(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(dishes);
            }
            catch (error) {
                console.error('Error in fetchFoodDetails:', error);
                next(error);
            }
        });
    }
    fetchauditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auditoriumId } = req.params;
                const vendor = yield this.userService.findAuditoriumById(auditoriumId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchdishes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dishesId } = req.params;
                const vendor = yield this.userService.finddishesById(dishesId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchBookedData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const booking = yield this.userService.findEvent(id);
                res.status(httpStatus_1.HttpStatus.OK).json(booking);
            }
            catch (error) {
                next(error);
            }
        });
    }
    payment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('23232');
                const { txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6, udf7 } = req.body;
                if (!txnid || !amount || !productinfo || !username || !email || !udf1 || !udf2 || !udf3 || !udf4 || !udf5 || !udf6 || !udf7) {
                    console.log('poi');
                    return res.status(400).send("Mandatory fields missing");
                }
                const hash = yield this.userService.generatePaymentHash({
                    txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6, udf7,
                });
                console.log('last', { hash, udf6, udf7 });
                res.send({ hash, udf6, udf7 });
            }
            catch (error) {
                next(error);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = (0, otpGenerator_1.otpGenerator)();
                yield this.userService.registerUser({
                    username: req.body.username,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: req.body.password,
                    otp,
                    _id: undefined,
                    address: "",
                    state: "",
                    pincode: 0,
                    reviews: undefined,
                    district: undefined
                });
                yield (0, sendEmail_1.sendEmail)(req.body.email, otp);
                res.status(httpStatus_1.HttpStatus.OK).json("OTP sent to email and saved in the database.");
            }
            catch (error) {
                next(error);
            }
        });
    }
    addTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { PayUOrderId, email, status } = req.body;
                const transactionId = yield this.userService.addTransactionDetails(email, PayUOrderId, status);
                res.status(httpStatus_1.HttpStatus.OK).send(transactionId);
            }
            catch (error) {
                next(error);
            }
        });
    }
    saveData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { txnid, email, productinfo, status, amount, udf1, udf2, udf3, udf4, udf5, udf6, udf7 } = req.body;
                console.log('req.body', req.body);
                const userId = udf1;
                const auditoriumId = udf2;
                const dishesId = udf3;
                const StartingDate = udf4;
                const category = udf5;
                const vendorId = productinfo;
                const eventType = udf6;
                const EndingDate = udf7;
                const updatedBooking = yield this.userService.updateBookingStatus({
                    txnid,
                    email,
                    vendorId,
                    status,
                    amount,
                    userId,
                    auditoriumId,
                    dishesId,
                    StartingDate,
                    category,
                    eventType,
                    EndingDate
                });
                console.log('Booking Updated:', updatedBooking);
                if (updatedBooking) {
                    res.status(httpStatus_1.HttpStatus.OK).json({ success: true, updatedBookingId: updatedBooking._id });
                }
                else {
                    res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Booking update failed" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchBookingDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const booking = yield this.userService.findBookingDetails(userId);
                res.status(httpStatus_1.HttpStatus.OK).json(booking);
            }
            catch (error) {
                next(error);
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { newPassword } = req.body;
            try {
                const updatedPassword = yield this.userService.findchangePassword(id, newPassword);
                res.status(httpStatus_1.HttpStatus.OK).json(updatedPassword);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUnreadMessagesCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.query.userId;
            console.log('User ID from query:', userId);
            try {
                if (!userId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "User ID is required" });
                }
                console.log('Controller hit with valid userId');
                const chatServiceData = yield this.userService.chatServices({ userId });
                const chatIds = chatServiceData.map((chat) => chat._id);
                if (chatIds.length === 0) {
                    return res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount: 0 });
                }
                const unreadCount = yield this.userService.messageService({ chatIds, userId });
                console.log('Unread messages count:', unreadCount);
                res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    review(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviews, stars, userId, vendorId } = req.body;
                if (!reviews || !stars || !userId || !vendorId) {
                    return res.status(400).json({ message: 'All fields are required' });
                }
                const reviewData = yield this.userService.reviewService({ reviews, stars, userId, vendorId });
                res.status(httpStatus_1.HttpStatus.OK).json(reviewData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSlotsByWorkerController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.params.vendorId;
                const slots = yield this.userService.getSlotsByWorkerId(vendorId);
                res.status(200).json(slots);
            }
            catch (error) {
                console.error("Error fetching slots:", error);
                res.status(500).json({ message: "Error fetching slots", error: error.message });
            }
        });
    }
}
exports.UserController = UserController;
