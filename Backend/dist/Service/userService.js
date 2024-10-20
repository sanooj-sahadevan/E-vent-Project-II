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
exports.UserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jssha_1 = __importDefault(require("jssha"));
const otpGenerator_1 = require("../utils/otpGenerator");
const sendEmail_1 = require("../utils/sendEmail");
const __1 = require("..");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userRepository.findUserByEmail(user.email);
                if (existingUser) {
                    if (existingUser.otpVerified) {
                        throw new Error("User already exists and is verified.");
                    }
                }
                const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
                user.password = hashedPassword;
                return yield this.userRepository.createUser(user);
            }
            catch (error) {
                console.error("Error during user registration:", error);
                throw new Error(`Registration error: ${error.message}`);
            }
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserByEmail(email);
                if (!user) {
                    throw new Error("Invalid Email/Password");
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid Email/Password");
                }
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
                return { user, token };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    checkEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            const otp = (0, otpGenerator_1.otpGenerator)();
            yield (0, sendEmail_1.sendEmail)(email, otp);
            return { user, otp };
        });
    }
    verifyOtpService(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            if (user.otp === otp) {
                yield this.userRepository.verifyAndSaveUserRepo(email, otp);
                return "User registered successfully";
            }
            else {
                throw new Error("Invalid OTP");
            }
        });
    }
    update(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Service: Calling repository to update password');
                const user = yield this.userRepository.findUserByEmailupdate(email, password);
                return user;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getAllVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAllVendors();
            }
            catch (error) {
                throw new Error('Error fetching vendors');
            }
        });
    }
    getAllDishes(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.fetchfromDBDishes(vendorId);
                return result;
            }
            catch (error) {
                throw new Error('Error fetching dishes');
            }
        });
    }
    getAllAuditorium(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Service: Fetching auditoriums for vendor:', vendorId);
                const result = yield this.userRepository.fetchfromDBAuditorium(vendorId);
                return result;
            }
            catch (error) {
                throw new Error('Error fetching auditoriums');
            }
        });
    }
    editUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.userEditFromDB(userDetails);
            }
            catch (error) {
                throw new Error('Failed to update user details');
            }
        });
    }
    findVendorById(vendorId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.userRepository.findVendor(vendorId);
                const chat = yield this.userRepository.findVendorByIdInDb(vendorId, userId);
                return { vendor, chatId: chat.chatId };
            }
            catch (error) {
                throw new Error(`Error finding vendor: ${error}`);
            }
        });
    }
    fetchReviewById(vendorId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield this.userRepository.findReviewByIdInDb(vendorId, userId);
                if (!review || !review.review) {
                    throw new Error('No review found');
                }
                console.log(review, 'okokok');
                return { review };
            }
            catch (error) {
                throw new Error(`Error fetching review: ${error}`);
            }
        });
    }
    fetchNotificationsById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('ziya', userId); // Added userId log for more info
                const notificationsData = yield this.userRepository.findNotificationsByIdInDb(userId);
                if (!notificationsData || !notificationsData.notification) {
                    throw new Error('No notifications found'); // Updated error message for clarity
                }
                console.log(notificationsData, 'okokok');
                return notificationsData; // Returning fetched notifications
            }
            catch (error) {
                throw new Error(`Error fetching notifications: ${error}`); // Improved error message
            }
        });
    }
    findFoodVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Service invoked to find dishes for vendor:', vendorId);
                const dishes = yield this.userRepository.findFoodVendorIdInDb(vendorId);
                if (!dishes || dishes.length === 0) {
                    throw new Error(`Error finding vendor dishes`);
                }
                else {
                    return dishes;
                }
            }
            catch (error) {
                throw new Error(`Error finding vendor dishes: ${error}`);
            }
        });
    }
    findAuditoriumVendorById(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Service invoked to find dishes for vendor:', vendorId);
                const dishes = yield this.userRepository.findAuditoriumVendorIdInDb(vendorId);
                if (!dishes || dishes.length === 0) {
                    throw new Error(`Error finding vendor dishes`);
                }
                else {
                    return dishes;
                }
            }
            catch (error) {
                throw new Error(`Error finding vendor dishes: ${error}`);
            }
        });
    }
    findAuditoriumById(auditoriumId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.userRepository.findAuditoriumByIdInDb(auditoriumId);
                if (!vendor) {
                    throw new Error(`Error finding vendor dishes`);
                }
                else {
                    return vendor;
                }
            }
            catch (error) {
                throw new Error(`Error finding vendor: ${error}`);
            }
        });
    }
    finddishesById(dishesId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vendor = yield this.userRepository.finddishesByIdInDb(dishesId);
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
    findEvent(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingDetails = yield this.userRepository.getBookingDetail(bookingId);
                if (!bookingDetails) {
                    throw new Error(`Booking with id not found`);
                }
                return bookingDetails;
            }
            catch (error) {
                console.error("Error fetching booking details:", error);
                throw error;
            }
        });
    }
    addTransactionDetails(email, PayUOrderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const PayUOrderData = await PayURepository.getPayUOrder(PayUOrderId);
                // if (!PayUOrderData) throw new Error("PayU Order Data not found");
                // console.log("Got order id");
                // console.log(PayUOrderData);
                // const userData = await userServices.getUserDataByEmail(email);
                // if (!userData) throw new Error("User Data not found.");
                // const userId = userData._id.toString();
                // const transaction = await adsRepository.addTransaction(
                //   userId,
                //   PayUOrderId,
                //   PayUOrderData.mihpayid,
                //   status,
                //   PayUOrderData.amount
                // );
                // console.log("Added transaction");
                // console.log(transaction);
                // if (!transaction) throw new Error("Transaction Data not found");
                // if (status === "success") {
                //   const postId = PayUOrderData?.productinfo;
                //   const WeNetAdsData = await adsRepository.createWenetAds(
                //     userId,
                //     postId,
                //     transaction._id.toString()
                //   );
                //   console.log("created WeNetAdsData");
                //   console.log(WeNetAdsData);
                //   const postData = await adsRepository.addAdDataToPost(postId);
                //   console.log("Added ad data to post ");
                //   console.log(postData);
                //   try {
                //     await adsRepository.sendPostAdDataToMQ(
                //       postData._id.toString(),
                //       postData.WeNetAds
                //     );
                //   } catch (error: any) {
                //     console.log(error.message);
                //   }
                // }
                // return transaction._id.toString();
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findBookingDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookingDetails = yield this.userRepository.findDetailsByUserId(userId);
            if (!bookingDetails) {
                throw new Error(`Booking with id not found`);
            }
            return bookingDetails;
        });
    }
    updateBookingStatus(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBooking = yield this.userRepository.updateBookingStatus(bookingData);
            console.log(updatedBooking, 'Booking Update Service');
            return updatedBooking;
        });
    }
    findchangePassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Updating password for userId:', userId);
            const updatedPassword = yield this.userRepository.changepassword(userId, newPassword);
            if (!updatedPassword)
                throw new Error(`Booking with id not found`);
            return updatedPassword;
        });
    }
    findUserByEmailService(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findUserByEmail(email);
                console.log('otp service');
                return { user, email };
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    generatePaymentHash(_a) {
        return __awaiter(this, arguments, void 0, function* ({ txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6, udf7 }) {
            try {
                console.log('123');
                const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}||||${process.env.PAYU_SALT}`;
                console.log('123456');
                const sha = new jssha_1.default("SHA-512", "TEXT");
                sha.update(hashString);
                const hash = sha.getHash("HEX");
                console.log(hash, 'hash');
                const bookingData = {
                    txnid,
                    amount,
                    productinfo,
                    username,
                    email,
                    udf1,
                    udf2,
                    udf3,
                    udf4,
                    udf5,
                    udf6,
                    udf7,
                    paymentStatus: 'pending', // You can adjust this according to your logic
                    paymentHash: hash // Save the generated hash
                };
                const savedBooking = yield this.userRepository.saveBooking(bookingData);
                // return savedBooking;
                return hash;
            }
            catch (error) {
                throw new Error("Error generating payment hash");
            }
        });
    }
    chatServices(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            try {
                const chats = yield this.userRepository.chatDB(userId);
                console.log(chats, 'ok serive');
                return chats;
            }
            catch (error) {
                console.error("Error fetching chats:", error);
                throw error;
            }
        });
    }
    messageService(_a) {
        return __awaiter(this, arguments, void 0, function* ({ chatIds, userId, }) {
            try {
                const unreadCount = yield this.userRepository.messageDB(chatIds);
                __1.io.to(userId).emit("unreadCount", { unreadCount });
                console.log(unreadCount, 'ok messge service');
                console.log('emmited sucessfullly');
                return unreadCount;
            }
            catch (error) {
                console.error("Error fetching unread messages:", error);
                throw error;
            }
        });
    }
    // async reviewService(reviewData: { reviews: string; stars: number; userId: string; vendorId: string }): Promise<any> {
    //   try {
    //     const review = await this.userRepository.reviewRepository(reviewData);
    //     return review;
    //   } catch (error) {
    //     console.error("Error in reviewService:", error);
    //     throw error; 
    //   }
    // }
    reviewService(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield this.userRepository.reviewRepository(reviewData);
                const reviews = yield this.userRepository.getReviewsByVendorId(reviewData.vendorId);
                const averageRating = this.calculateAverageRating(reviews);
                yield this.userRepository.updateVendorRating(reviewData.vendorId, averageRating);
                return review;
            }
            catch (error) {
                console.error("Error in reviewService:", error);
                throw error;
            }
        });
    }
    calculateAverageRating(reviews) {
        console.log('hlper function');
        if (reviews.length === 0)
            return 0;
        const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
        return totalStars / reviews.length;
    }
    getSlotsByWorkerId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getSlotsByWorkerIdFromRepo(vendorId);
            }
            catch (error) {
                console.error("Error fetching slots from repository:", error);
                throw error;
            }
        });
    }
    searchVendors(term) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!term) {
                throw new Error("Search term is required");
            }
            try {
                const vendors = yield this.userRepository.searchVendorsByName(term);
                return vendors;
            }
            catch (error) {
                throw new Error(`Service error: ${error}`);
            }
        });
    }
}
exports.UserService = UserService;
