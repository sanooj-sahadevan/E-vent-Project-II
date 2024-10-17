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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { Vendor } from "../interfaces/vendor";
const fileUpload_1 = require("../middleware/fileUpload");
const index_1 = require("../index");
const mongoose_1 = __importDefault(require("mongoose"));
class VendorService {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    registerVendor(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingVendor = yield this.vendorRepository.findVendorByEmail(vendor.email);
                console.log(existingVendor);
                if (existingVendor) {
                    if (existingVendor.otpVerified) {
                        throw new Error("User already exists");
                    }
                    else {
                        yield this.vendorRepository.updateVendor(existingVendor.email, vendor);
                        return existingVendor;
                    }
                }
                return yield this.vendorRepository.createVendor(vendor);
            }
            catch (error) {
                console.error("Error during user registration:", error);
                throw error;
            }
        });
    }
    verifyAndSaveVendor(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this.vendorRepository.findVendorByEmail(email);
            if (vendor && vendor.otp === otp) {
                vendor.otp = undefined;
                vendor.otpVerified = true;
                yield vendor.save();
                return vendor;
            }
            throw new Error("Invalid OTP");
        });
    }
    loginVendor(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this.vendorRepository.findVendorByEmail(email);
            if (!vendor) {
                throw new Error("Invalid Email/Password");
            }
            const vendorToken = jsonwebtoken_1.default.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            return { vendor, vendorToken };
        });
    }
    vendorAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorRepository.vendorAddressFromDB();
            }
            catch (error) {
                throw new Error('Failed to fetch vendor addresses');
            }
        });
    }
    editVendorService(vendorDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingVendor = yield this.vendorRepository.findVendorByEmailRepo(vendorDetails.email);
                if (existingVendor) {
                    return yield this.vendorRepository.editVendorRepo(existingVendor, vendorDetails);
                }
                else {
                    return yield this.vendorRepository.editVendorRepo(null, vendorDetails);
                }
            }
            catch (error) {
                console.error('Error in editVendorService:', error);
                throw new Error('Failed to update vendor details');
            }
        });
    }
    uploadImage(fileName, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Generating pre-signed URL for file:", fileName, "with type:", fileType); // Log the details
                const presignedUrl = yield (0, fileUpload_1.uploadToS3Bucket)(fileName, fileType);
                return presignedUrl;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.vendorRepository.findVendorByIdInDb(vendorId);
                if (!vendor) {
                    throw new Error(`Error finding vendor`);
                }
                return vendor;
            }
            catch (error) {
                throw new Error(`Error finding vendor: ${error}`);
            }
        });
    }
    findAuditoriumById(auditoriumId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('controller 2');
                const vendor = yield this.vendorRepository.findAuditoriumByIdInDb(auditoriumId);
                if (!vendor) {
                    throw new Error(`Error finding vendor`);
                }
                return vendor;
            }
            catch (error) {
                throw new Error(`Error finding vendor: ${error}`);
            }
        });
    }
    findDishesById(dishesId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.vendorRepository.findDishesByIdInDb(dishesId);
                if (!vendor) {
                    throw new Error(`Error finding vendor`);
                }
                return vendor;
            }
            catch (error) {
                throw new Error(`Error finding vendor: ${error}`);
            }
        });
    }
    uploadDishes(vendorId, data, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                data.price = Number(data.price);
                const dishesData = { vendorId, data, images };
                console.log("Dishes Data: ", dishesData);
                const newDish = yield this.vendorRepository.createDishes(dishesData);
                console.log("New dish created:", newDish);
                const dishNotification = yield this.vendorRepository.notifyDishAdded(vendorId, newDish, newDish.dishesName);
                console.log("Dish notification result:", dishNotification);
                return newDish;
            }
            catch (error) {
                console.error("Error in uploadDishes: ", error);
                throw error;
            }
        });
    }
    uploadAuditorium(vendorId, data, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const auditoriumData = { vendorId, data, images };
                auditoriumData.data.price = Number(auditoriumData.data.price);
                const newAuditorium = yield this.vendorRepository.createAuditorium(auditoriumData);
                const dishNotification = yield this.vendorRepository.notifyAuditoriumAdded(vendorId, newAuditorium, newAuditorium.auditoriumName);
                console.log("Dish notification result:", dishNotification);
                return newAuditorium;
            }
            catch (error) {
                console.error("Error in uploadAuditorium: ", error);
                throw error;
            }
        });
    }
    findFoodVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Service invoked to find dishes for vendor:', vendorId);
                const dishes = yield this.vendorRepository.findFoodVendorIdInDb(vendorId);
                return dishes;
            }
            catch (error) {
                throw new Error(`Error finding vendor dishes: ${error}`);
            }
        });
    }
    findReviewsVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Service invoked to find reviews for vendor:', vendorId);
                const dishes = yield this.vendorRepository.findReviewsVendorIdInDb(vendorId);
                return dishes;
            }
            catch (error) {
                throw new Error(`Error finding vendor dishes: ${error}`);
            }
        });
    }
    findAuditoriumVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Service invoked to find auditorium for vendor:', vendorId);
                const Auditorium = yield this.vendorRepository.findAuditoriumVendorIdInDb(vendorId);
                return Auditorium;
            }
            catch (error) {
                throw new Error(`Error finding vendor dishes: ${error}`);
            }
        });
    }
    softDeleteDishService(dishId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedDish = yield this.vendorRepository.softDeleteDishRepo(dishId);
                if (!updatedDish) {
                    throw new Error(`Error soft-deleting dish`);
                }
                return updatedDish;
            }
            catch (error) {
                throw new Error(`Error soft-deleting dish: ${error}`);
            }
        });
    }
    softDeleteAuditoriumService(auditoriumId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedAuditorium = yield this.vendorRepository.softDeleteAuditoriumRepo(auditoriumId);
                if (!updatedAuditorium) {
                    throw new Error(`Error soft-deleting auditorium`);
                }
                return updatedAuditorium;
            }
            catch (error) {
                throw new Error(`Error soft-deleting auditorium: ${error}`);
            }
        });
    }
    reviewIdService(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedreview = yield this.vendorRepository.updatedreviewRepo(reviewId);
                if (!updatedreview) {
                    throw new Error(`Error soft-deleting auditorium`);
                }
                return updatedreview;
            }
            catch (error) {
                throw new Error(`Error soft-deleting auditorium: ${error}`);
            }
        });
    }
    reviewIdServiceReject(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletereview = yield this.vendorRepository.updatedreviewRepoReject(reviewId);
                if (!deletereview) {
                    throw new Error(`Error soft-deleting auditorium`);
                }
                return deletereview;
            }
            catch (error) {
                throw new Error(`Error soft-deleting auditorium: ${error}`);
            }
        });
    }
    findBookingDetails(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingDetails = yield this.vendorRepository.findDetailsByvendorId(vendorId);
                if (!bookingDetails) {
                    throw new Error(`Error soft-deleting auditorium`);
                }
                return bookingDetails;
            }
            catch (error) {
                throw new Error(`Error soft-deleting auditorium: ${error}`);
            }
        });
    }
    findVendorByEmailService(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.vendorRepository.findVendorByEmail(email);
                return vendor;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    chatServices(_a) {
        return __awaiter(this, arguments, void 0, function* ({ vendorId }) {
            try {
                const chats = yield this.vendorRepository.chatDB(vendorId);
                return chats;
            }
            catch (error) {
                console.error("Error fetching chats:", error);
                throw error;
            }
        });
    }
    messageService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ chatIds, vendorId, }) {
            try {
                const unreadCount = yield this.vendorRepository.messageDB(chatIds);
                index_1.io.to(vendorId).emit("unreadCount", { unreadCount });
                return unreadCount;
            }
            catch (error) {
                console.error("Error fetching unread messages:", error);
                throw error;
            }
        });
    }
    createWorkerSlots(vendorId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const slots = [];
            const workerObjectId = new mongoose_1.default.Types.ObjectId(vendorId);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (startDate <= today) {
                throw new Error("Start date must be tomorrow or a future date.");
            }
            const currentDate = new Date(startDate);
            const end = new Date(endDate);
            while (currentDate <= end) {
                const existingSlot = yield this.vendorRepository.findSlotByWorkerAndDate(workerObjectId, currentDate);
                if (existingSlot) {
                    throw new Error(`Slot already exists for vendor ${vendorId} on ${currentDate.toDateString()}`);
                }
                const slot = yield this.vendorRepository.createSlot({
                    vendorId: workerObjectId,
                    date: new Date(currentDate),
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                });
                slots.push(slot);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return slots;
        });
    }
    getSlotsByWorkerId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.vendorRepository.getSlotsByWorkerIdFromRepo(vendorId);
            }
            catch (error) {
                console.error("Error fetching slots from repository:", error);
                throw error;
            }
        });
    }
}
exports.VendorService = VendorService;
