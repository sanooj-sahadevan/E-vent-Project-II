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
exports.UserRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dishesModel_1 = require("../models/dishesModel");
const auditoriumModel_1 = require("../models/auditoriumModel");
const bookedEvent_1 = require("../models/bookedEvent");
const chatModel_1 = require("../models/chatModel");
const vendorModel_1 = require("../models/vendorModel");
const messageModal_1 = require("../models/messageModal");
const reviews_1 = require("../models/reviews");
const notificationModel_1 = require("../models/notificationModel");
const slotModel_1 = require("../models/slotModel");
const BaseRepo_1 = require("../Base Repository/BaseRepo");
const adminModel_1 = __importDefault(require("../models/adminModel"));
class UserRepository extends BaseRepo_1.BaseRepository {
    constructor() {
        super(userModel_1.default, vendorModel_1.VendorModel, adminModel_1.default, chatModel_1.chatModel);
    }
    getAllVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAll();
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.create(user);
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userByEmail(email);
                return user;
            }
            catch (error) {
                console.error('Error finding user by email:', error);
                throw new Error('Database Error');
            }
        });
    }
    verifyAndSaveUserRepo(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ email, isBlocked: false }).exec();
                if (user && user.otp === otp) {
                    user.otp = undefined;
                    user.otpVerified = true;
                    yield user.save();
                    return user;
                }
                throw new Error("Invalid OTP");
            }
            catch (error) {
                console.error('Error saving user:', error);
                throw new Error('Database Error');
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userById(userId);
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    userEditFromDB(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield userModel_1.default.findOne({ email: userDetails.email });
                if (existingUser) {
                    existingUser.username = userDetails.username;
                    existingUser.phone = userDetails.phone;
                    existingUser.profileImage = userDetails.profileImage;
                    existingUser.address = userDetails.address;
                    existingUser.state = userDetails.state;
                    existingUser.district = userDetails.district;
                    existingUser.pincode = userDetails.pincode;
                    existingUser.reviews = userDetails.reviews;
                    yield existingUser.save();
                    return existingUser;
                }
                else {
                    const newUser = new userModel_1.default(userDetails);
                    yield newUser.save();
                    return newUser;
                }
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Database operation failed');
            }
        });
    }
    updateUser(email, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.updateUserBase(email, update);
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    findUserByEmailupdate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    throw new Error("User not found");
                }
                console.log(user.email);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                user.password = hashedPassword;
                yield user.save();
                return user;
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    fetchfromDBDishes(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(vendorId);
                const result = yield auditoriumModel_1.Auditorium.find(objectId);
                return result;
            }
            catch (error) {
                console.error('Error fetching Dishes from the database:', error);
                throw new Error('Error fetching Dishes from the database');
            }
        });
    }
    // async updateUser(email: string, update: Partial<User>) {
    //   try {
    //     return this.updateUserBase
    //   } catch (error) {
    //     throw new Error('Database Error');
    //   }
    // }
    fetchfromDBAuditorium(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.fetchAuditorium(vendorId);
            }
            catch (error) {
                console.error('Error fetching auditorium from the database:', error);
                throw new Error('Error fetching auditorium from the database');
            }
        });
    }
    findVendor(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.findVendorBase(vendorId);
            }
            catch (error) {
                console.error("Error in repository:", error);
                throw error;
            }
        });
    }
    findVendorByIdInDb(vendorId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('1234323');
                let chat = yield chatModel_1.chatModel.findOne({ userId, vendorId });
                if (!chat) {
                    chat = new chatModel_1.chatModel({
                        userId,
                        vendorId,
                    });
                    yield chat.save();
                }
                return { chatId: chat._id };
            }
            catch (error) {
                console.error("Error in repository:", error);
                throw error;
            }
        });
    }
    findReviewByIdInDb(vendorId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield reviews_1.Reviews.find({
                    userId,
                    vendorId,
                    vendorVerified: true
                }).populate('userId');
                console.log(review);
                if (!review) {
                    return { message: 'No review found' };
                }
                return { review };
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    findNotificationsByIdInDb(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.NotificationModel.find();
                // .populate('vendorId')
                // .populate('userId')
                return { notification: notifications };
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    findFoodVendorIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(vendorId);
                const result = yield dishesModel_1.Dishes.find({ vendorId: objectId, isDeleted: false });
                return result;
            }
            catch (error) {
                console.error('Error fetching dishes:', error);
                throw new Error(`Error fetching dishes: ${error}`);
            }
        });
    }
    findAuditoriumVendorIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(vendorId);
                const result = yield auditoriumModel_1.Auditorium.find({ vendorId: objectId, isDeleted: false });
                return result;
            }
            catch (error) {
                throw new Error(`Error fetching dishes: ${error}`);
            }
        });
    }
    findAuditoriumByIdInDb(auditoriumId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield auditoriumModel_1.Auditorium.findById(auditoriumId);
                return result;
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    finddishesByIdInDb(dishesId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = this.dishesById;
                return result;
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    getBookingDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookedData = yield bookedEvent_1.bookedModel
                    .findById(id);
                return bookedData;
            }
            catch (error) {
                console.error("Error fetching booking details:", error);
                throw new Error('Database Error');
            }
        });
    }
    updateBookingStatus(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { txnid, status, StartingDate, EndingDate, vendorId } = bookingData;
                const bookings = yield bookedEvent_1.bookedModel.find({ txnId: txnid });
                console.log(bookings, 'liston');
                if (bookings.length > 1) {
                    const [firstBooking, ...duplicateBookings] = bookings;
                    yield bookedEvent_1.bookedModel.deleteMany({ _id: { $in: duplicateBookings.map(b => b._id) } });
                    console.log(`Deleted ${duplicateBookings.length} duplicate bookings for txnid: ${txnid}`);
                    firstBooking.paymentStatus = 'success';
                    yield firstBooking.save();
                    console.log('Booking updated successfully:', firstBooking);
                    yield this.updateSlotAvailability(firstBooking.StartingDate, firstBooking.EndingDate, vendorId);
                    return firstBooking;
                }
                else if (bookings.length === 1) {
                    const booking = bookings[0];
                    booking.paymentStatus = 'success';
                    yield booking.save();
                    console.log('Booking updated successfully:', booking);
                    yield this.updateSlotAvailability(booking.StartingDate, booking.EndingDate, vendorId);
                    return booking;
                }
                else {
                    const newBooking = yield bookedEvent_1.bookedModel.create(Object.assign(Object.assign({ txnId: txnid, paymentStatus: status }, bookingData), { createdAt: new Date() }));
                    console.log('New booking created:', newBooking);
                    yield this.updateSlotAvailability(newBooking.StartingDate, newBooking.EndingDate, vendorId);
                    return newBooking;
                }
            }
            catch (error) {
                console.error('Error updating booking:', error);
                throw new Error('Database Error');
            }
        });
    }
    updateSlotAvailability(startingDate, endingDate, vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startTimestamp = startingDate.getTime();
                const endTimestamp = endingDate.getTime();
                const availableSlots = yield slotModel_1.Slot.find({
                    vendorId: vendorId,
                    date: {
                        $gte: new Date(Math.min(startTimestamp, endTimestamp)),
                        $lte: new Date(Math.max(startTimestamp, endTimestamp))
                    },
                    isAvailable: true,
                });
                if (availableSlots.length > 0) {
                    yield slotModel_1.Slot.updateMany({
                        _id: { $in: availableSlots.map(slot => slot._id) },
                    }, { isAvailable: false });
                    console.log(`Updated ${availableSlots.length} slots to unavailable.`);
                }
                else {
                    console.log('No available slots found for the given dates.');
                }
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    savechatDB(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newChat = new chatModel_1.chatModel({ message: chat });
                console.log('save karo--------------------------');
                return yield newChat.save();
            }
            catch (error) {
                console.error("Database error:", error);
                throw new Error("Database operation failed.");
            }
        });
    }
    findDetailsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield bookedEvent_1.bookedModel
                    .find({ userId: userId, paymentStatus: "success" })
                    .populate('dishesId')
                    .populate('userId')
                    .populate('vendorId')
                    .populate('auditoriumId');
                return results;
            }
            catch (error) {
                console.error("Database error:", error);
                throw new Error("Database operation failed.");
            }
        });
    }
    changepassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                user.password = hashedPassword;
                yield user.save();
                return user;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    chatDB(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chats = yield chatModel_1.chatModel.find({ userId }).select('_id');
                return chats;
            }
            catch (error) {
                console.error("Error fetching chats from the database:", error);
                throw error;
            }
        });
    }
    messageDB(chatIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unreadCount = yield messageModal_1.messageModel.countDocuments({
                    chatId: { $in: chatIds },
                    senderModel: "Vendor",
                    isRead: false,
                });
                return unreadCount;
            }
            catch (error) {
                console.error("Error fetching unread messages count from the database:", error);
                throw error;
            }
        });
    }
    reviewRepository(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('reviewRepository');
                const review = new reviews_1.Reviews(reviewData);
                const savedReview = yield review.save();
                console.log("Review saved:", savedReview);
                return savedReview;
            }
            catch (error) {
                console.error("Error saving review to the database:", error);
                throw error;
            }
        });
    }
    getReviewsByVendorId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getReviewsByVendorId');
            try {
                const reviews = yield reviews_1.Reviews.find({
                    vendorId: vendorId,
                    vendorVerified: true
                });
                console.log(reviews);
                return reviews;
            }
            catch (error) {
                console.error("Error fetching reviews:", error);
                throw error;
            }
        });
    }
    updateVendorRating(vendorId, averageRating) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updateVendorRating');
            try {
                const updatedVendor = yield vendorModel_1.VendorModel.findByIdAndUpdate(vendorId, { rating: averageRating }, { new: true });
                return updatedVendor;
            }
            catch (error) {
                console.error("Error updating vendor rating:", error);
                throw error;
            }
        });
    }
    getSlotsByWorkerIdFromRepo(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return yield slotModel_1.Slot.find({
                    vendorId,
                    isAvailable: true,
                    date: { $gte: today },
                }).exec();
            }
            catch (error) {
                throw error;
            }
        });
    }
    saveBooking(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('sanooj');
                const newBooking = new bookedEvent_1.bookedModel({
                    vendorId: bookingData.productinfo,
                    userId: bookingData.udf1,
                    totalAmount: bookingData.amount,
                    paymentType: "online",
                    paymentStatus: bookingData.paymentStatus,
                    txnId: bookingData.txnid || null,
                    StartingDate: bookingData.udf4,
                    EndingDate: bookingData.udf7,
                    eventType: bookingData.udf6,
                    category: bookingData.udf5,
                    occupancy: bookingData.occupancy,
                    dishesId: bookingData.udf3 || null,
                    auditoriumId: bookingData.udf2 || null
                });
                const savedBooking = yield newBooking.save();
                return savedBooking;
            }
            catch (error) {
                console.error('Error saving booking:', error);
                throw new Error('Error saving booking');
            }
        });
    }
    searchVendorsByName(term) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vendorModel_1.VendorModel.find({
                    vendorname: { $regex: term, $options: 'i' },
                    isBlocked: false,
                }).exec();
            }
            catch (error) {
                throw new Error(`Error fetching vendors: ${error}`);
            }
        });
    }
}
exports.UserRepository = UserRepository;
