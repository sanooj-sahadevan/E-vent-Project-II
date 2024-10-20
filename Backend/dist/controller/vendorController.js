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
exports.VendorController = void 0;
const httpStatus_1 = require("../utils/httpStatus");
const otpGenerator_1 = require("../utils/otpGenerator");
const sendEmail_1 = require("../utils/sendEmail");
class VendorController {
    constructor(vendorService) {
        this.vendorService = vendorService;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorname, email, phone, password } = req.body;
                const proceedWithRegistration = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const otp = (0, otpGenerator_1.otpGenerator)();
                        yield this.vendorService.registerVendor({
                            vendorname,
                            phone,
                            email,
                            password,
                            otp,
                            reviews: "",
                            address: "",
                            district: "",
                            state: "",
                            description: "", rating: 0,
                            reviewsID: null,
                            serviceImages: []
                        });
                        yield (0, sendEmail_1.sendEmail)(email, otp);
                        res.status(httpStatus_1.HttpStatus.OK).json("OTP sent to email");
                    }
                    catch (error) {
                        next(error);
                    }
                });
                yield proceedWithRegistration();
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const vendor = yield this.vendorService.findVendorByEmailService(email);
                if (!vendor) {
                    res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor not found" });
                    return;
                }
                if (vendor.otp === otp) {
                    yield this.vendorService.verifyAndSaveVendor(email, otp);
                    res.status(httpStatus_1.HttpStatus.OK).json("Vendor registered successfully");
                }
                else {
                    res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Invalid OTP" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { vendor, vendorToken } = yield this.vendorService.loginVendor(email, password);
                res.cookie("vendorToken", vendorToken);
                res.status(httpStatus_1.HttpStatus.OK).json({ vendor, vendorToken });
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchAddress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorAddresses = yield this.vendorService.vendorAddress();
                res.status(httpStatus_1.HttpStatus.OK).json(vendorAddresses);
            }
            catch (error) {
                next(error);
            }
        });
    }
    editVendorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = req.body;
                const updatedUser = yield this.vendorService.editVendorService(userDetails);
                res.status(httpStatus_1.HttpStatus.OK).json(updatedUser);
            }
            catch (error) {
                console.error('Error in editUserDetails controller:', error);
                next(error);
            }
        });
    }
    fetchVendorDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params; // Extract vendorId from request params
                const vendor = yield this.vendorService.findVendorById(vendorId); // Fetch vendor details
                if (!vendor) {
                    res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: "Vendor not found" });
                }
                else {
                    res.status(httpStatus_1.HttpStatus.OK).json(vendor);
                }
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
                const vendor = yield this.vendorService.findDishesById(dishesId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchauditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auditoriumId } = req.params;
                const vendor = yield this.vendorService.findAuditoriumById(auditoriumId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPresignedUrl(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fileName, fileType } = req.query;
                if (!fileName || !fileType) {
                    return res.status(400).json({ error: "fileName and fileType are required" });
                }
                const presignedUrl = yield this.vendorService.uploadImage(fileName, fileType);
                return res.status(200).json({ url: presignedUrl });
            }
            catch (error) {
                console.error("Error generating pre-signed URL:", error);
                next(error);
            }
        });
    }
    addDishes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const vendorId = req.vendorId;
                console.log("Request Body: ", body); // Add this line to check the body
                if (!vendorId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
                }
                yield this.vendorService.uploadDishes(vendorId, body, body.image);
                return res.status(httpStatus_1.HttpStatus.OK).json("Dishes added successfully");
            }
            catch (error) {
                console.error("Error adding dishes: ", error);
                next(error);
            }
        });
    }
    addAuditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const vendorId = req.vendorId;
                if (!vendorId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
                }
                const auditoriumData = yield this.vendorService.uploadAuditorium(vendorId, body, body.image);
                if (auditoriumData) {
                    return res.status(httpStatus_1.HttpStatus.OK).json("Auditorium added successfully");
                }
                else {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Auditorium not added: something went wrong" });
                }
            }
            catch (error) {
                console.error("Error adding auditorium: ", error);
                next(error);
            }
        });
    }
    fetchDetailsVendor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const vendor = yield this.vendorService.findVendorById(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(vendor);
            }
            catch (error) {
                console.error('Error in fetchDetailsVendor:', error);
                next(error);
            }
        });
    }
    fetchFoodDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const dishes = yield this.vendorService.findFoodVendorById(vendorId);
                if (!dishes || dishes.length === 0) {
                    res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
                }
                else {
                    res.status(httpStatus_1.HttpStatus.OK).json(dishes);
                }
            }
            catch (error) {
                console.error('Error in fetchFoodDetails:', error);
                next(error);
            }
        });
    }
    fetchReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vendorId } = req.params;
                const Reviews = yield this.vendorService.findReviewsVendorById(vendorId);
                if (!Reviews || Reviews.length === 0) {
                    res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: "No Reviews found for this vendor" });
                }
                else {
                    res.status(httpStatus_1.HttpStatus.OK).json(Reviews);
                }
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
                const auditorium = yield this.vendorService.findAuditoriumVendorById(vendorId);
                if (!auditorium || auditorium.length === 0) {
                    res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ message: "No dishes found for this vendor" });
                }
                else {
                    res.status(httpStatus_1.HttpStatus.OK).json(auditorium);
                }
            }
            catch (error) {
                console.error('Error in fetchFoodDetails:', error);
                next(error);
            }
        });
    }
    softDeleteDish(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dishId } = req.params;
                if (!dishId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Dish ID is missing' });
                }
                const updatedDish = yield this.vendorService.softDeleteDishService(dishId);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'Dish deleted successfully', dish: updatedDish });
            }
            catch (error) {
                next(error);
            }
        });
    }
    softDeleteAuditorium(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auditoriumId } = req.params;
                if (!auditoriumId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'Auditorium ID is missing' });
                }
                const updatedAuditorium = yield this.vendorService.softDeleteAuditoriumService(auditoriumId);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'Auditorium deleted successfully', auditorium: updatedAuditorium });
            }
            catch (error) {
                next(error);
            }
        });
    }
    approveReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.params;
                if (!reviewId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'reviewId  is missing' });
                }
                const updatedAuditorium = yield this.vendorService.reviewIdService(reviewId);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'reviewId deleted successfully', auditorium: updatedAuditorium });
            }
            catch (error) {
                next(error);
            }
        });
    }
    rejectReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.params;
                if (!reviewId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ message: 'reviewId  is missing' });
                }
                const updatedAuditorium = yield this.vendorService.reviewIdServiceReject(reviewId);
                res.status(httpStatus_1.HttpStatus.OK).json({ message: 'reviewId deleted successfully', auditorium: updatedAuditorium });
            }
            catch (error) {
                next(error);
            }
        });
    }
    vendorBookingDetils(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vendorId } = req.params;
            try {
                const booking = yield this.vendorService.findBookingDetails(vendorId);
                res.status(httpStatus_1.HttpStatus.OK).json(booking);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUnreadMessagesCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendorId = req.vendorId;
            try {
                if (!vendorId) {
                    return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({ error: "Vendor ID is required" });
                }
                const chatServiceData = yield this.vendorService.chatServices({ vendorId });
                const chatIds = chatServiceData.map((chat) => chat._id);
                if (chatIds.length === 0) {
                    return res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount: 0 });
                }
                const unreadCount = yield this.vendorService.messageService({ chatIds, vendorId });
                res.status(httpStatus_1.HttpStatus.OK).json({ unreadCount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createSlotController(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.body; // Extract start and end dates from body
                const { vendorId } = req.params; // Extract vendorId from URL params
                if (!startDate || !endDate) {
                    return res.status(400).json({ message: "Start and End dates are required" });
                }
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    return res.status(400).json({ message: "Invalid start or end date" });
                }
                if (!vendorId) {
                    return res.status(400).json({ message: "Vendor ID is required" });
                }
                const slots = yield this.vendorService.createWorkerSlots(vendorId, start, end);
                res.status(201).json(slots);
            }
            catch (error) {
                console.error("Error creating slots:", error);
                res.status(500).json({ message: "Error creating slots", error: error.message });
            }
        });
    }
    getSlotsByWorkerController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendorId = req.params.vendorId; // Get vendorId from route parameters
                const slots = yield this.vendorService.getSlotsByWorkerId(vendorId);
                res.status(200).json(slots);
            }
            catch (error) {
                console.error("Error fetching slots:", error);
                res.status(500).json({ message: "Error fetching slots", error: error.message });
            }
        });
    }
    uploadVendorImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vendorId, photoUrls } = req.body.body;
            try {
                console.log({ vendorId, photoUrls });
                const updatedVendor = yield this.vendorService.saveVendorServiceImages(vendorId, photoUrls);
                return res.status(200).json({ message: "Service images saved successfully", vendor: updatedVendor });
            }
            catch (error) {
                return res.status(500).json({ message: `Error saving service images: ${error}` });
            }
        });
    }
}
exports.VendorController = VendorController;
