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
    fetchbookingData(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookedTrip = yield this.userRepository.createBookedTrip(bookingData);
            console.log(bookedTrip, 'okokookok');
            return bookedTrip;
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
        return __awaiter(this, arguments, void 0, function* ({ txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 }) {
            try {
                const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;
                const sha = new jssha_1.default("SHA-512", "TEXT");
                sha.update(hashString);
                const hash = sha.getHash("HEX");
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
    // userService.ts
    getSlotsByWorkerId(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getSlotsByWorkerIdFromRepo(vendorId);
            }
            catch (error) {
                console.error("Error fetching slots from repository:", error);
                throw error; // Re-throw to allow the controller to handle it
            }
        });
    }
}
exports.UserService = UserService;
/*
export default {
 registerUser : async (user: any) => {
    try {
      const existingUser = await userRepositary.findUserByEmail(user.email);
      if (existingUser) {
        if (existingUser.otpVerified) {
          throw new Error("User already exists and is verified.");
        } else {
          await userRepositary.updateUser(existingUser.email, { otp: user.otp, ...user });
          return existingUser;
        }
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      return await userRepositary.createUser(user);
    } catch (error) {
      console.error("Error during user registration:", error);
      throw new Error(`Registration error: ${(error as Error).message}`);
    }
  },




   loginUser : async (email: string, password: string) => {
    const user = await userRepositary.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid Email/Password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Email/Password");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    return { user, token };
  },

















  checkEmail : async (email: string) => {
    const user = await userRepositary.findUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }
    const otp = otpGenerator();
    await sendEmail(email, otp);
    return { user, otp };
  },



   verifyOtpService : async (email: string, otp: string) => {
    const user = await userRepositary.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.otp === otp) {
      await userRepositary.verifyAndSaveUserRepo(email, otp);
      return "User registered successfully";
    } else {
      throw new Error("Invalid OTP");
    }
  },


  update : async (email: string, password: string) => {
    try {
      console.log('Service: Calling repository to update password');
      const user = await userRepositary.findUserByEmailupdate(email, password);
      return user;
    } catch (error) {
      console.error(error);
    }
  },



  getAllVendors : async (): Promise<any[]> => {
    try {
      return await userRepositary.getAllVendors();
    } catch (error) {
      throw new Error('Error fetching vendors');
    }
  },



 getAllDishes : async (vendorId: string): Promise<any[]> => {
    try {
      const result = await userRepositary.fetchfromDBDishes(vendorId);
      return result;
    } catch (error) {
      throw new Error('Error fetching dishes');
    }
  },

  getAllAuditorium : async (vendorId: string): Promise<any[]> => {
    try {
      console.log('Service: Fetching auditoriums for vendor:', vendorId);
      const result = await userRepositary.fetchfromDBAuditorium(vendorId);
      return result;
    } catch (error) {
      throw new Error('Error fetching auditoriums');
    }
  },


editUser : async (userDetails: any) => {
    try {
      return await userRepositary.userEditFromDB(userDetails);
    } catch (error) {
      throw new Error('Failed to update user details');
    }
  },



findVendorById : async (vendorId: string, userId: string) => {
    try {
      const vendor = await userRepositary.findVendor(vendorId); // Fetch the vendor details
      const chat = await userRepositary.findVendorByIdInDb(vendorId, userId); // Fetch or create chat details
      return { vendor, chatId: chat.chatId }; // Return both vendor and chat ID
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },

findFoodVendorById : async (vendorId: string) => {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await userRepositary.findFoodVendorIdInDb(vendorId);
      if (!dishes || dishes.length === 0) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return dishes;

      }
    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  },

findAuditoriumVendorById : async (vendorId: string) => {
    try {
      console.log('Service invoked to find dishes for vendor:', vendorId);
      const dishes = await userRepositary.findAuditoriumVendorIdInDb(vendorId);
      if (!dishes || dishes.length === 0) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return dishes;
      }

    } catch (error) {
      throw new Error(`Error finding vendor dishes: ${error}`);
    }
  },


  findAuditoriumById : async (auditoriumId: string) => {
    try {
      const vendor = await userRepositary.findAuditoriumByIdInDb(auditoriumId);
      if (!vendor) {
        throw new Error(`Error finding vendor dishes`);
      } else {
        return vendor;
      }
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },



  finddishesById : async (dishesId: string) => {
    try {
      const vendor = await userRepositary.finddishesByIdInDb(dishesId);
      if (!vendor) {
        throw new Error(`Error finding vendor`);
      }
      return vendor
    } catch (error) {
      throw new Error(`Error finding vendor: ${error}`);
    }
  },


   findEvent : async (bookingId: string) => {
    try {

      const bookingDetails = await userRepositary.getBookingDetail(bookingId);
      if (!bookingDetails) {
        throw new Error(`Booking with id not found`);
      }
      return bookingDetails;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      throw error;
    }
  },


  addTransactionDetails : async (
    email: string,
    PayUOrderId: string,
    status: "success" | "failed"
  ) => {
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
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

   fetchbookingData : async (bookingData: any) => {
    const bookedTrip = await userRepositary.createBookedTrip(bookingData);
    console.log(bookedTrip);
    return bookedTrip;
  },



  findBookingDetails :async (userId: string) => {
    const bookingDetails = await userRepositary.findDetailsByUserId(userId);
    if (!bookingDetails) {
      throw new Error(`Booking with id not found`);
    }
    return bookingDetails;
  },


  findchangePassword :async (userId: string, newPassword: string) => {
    console.log('Updating password for userId:', userId);
    const updatedPassword = await userRepositary.changepassword(userId, newPassword);
    if(!updatedPassword)   throw new Error(`Booking with id not found`);
    return updatedPassword;
  },


 findUserByEmailService : async (email: string) => {
    try {
      const user = await userRepositary.findUserByEmail(email);
      console.log('otp service');

      return { user, email };
    } catch (error) {
      console.error(error);
    }
  },

  generatePaymentHash : async ({
    txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
  }: {
    txnid: string,
    amount: string,
    productinfo: string,
    username: string,
    email: string,
    udf1: string,
    udf2: string,
    udf3: string,
    udf4: string,
    udf5: string,
    udf6: string
  }) => {
    try {
      const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;

      const sha = new jsSHA("SHA-512", "TEXT");
      sha.update(hashString);
      const hash = sha.getHash("HEX");

      return hash;
    } catch (error) {
      throw new Error("Error generating payment hash");
    }
  }

}
*/
// export const registerUser = async (user: any) => {
//   try {
//     const existingUser = await userRepositary.findUserByEmail(user.email);
//     if (existingUser) {
//       if (existingUser.otpVerified) {
//         throw new Error("User already exists and is verified.");
//       } else {
//         console.log('Updating existing user with new OTP:', user.otp);
//         await userRepositary.updateUser(existingUser.email, { otp: user.otp, ...user });
//         return existingUser;
//       }
//     }
//     const hashedPassword = await bcrypt.hash(user.password, 10);
//     user.password = hashedPassword;
//     return await userRepositary.createUser(user);
//   } catch (error) {
//     console.error("Error during user registration:", error);
//     throw new Error(`Registration error: ${(error as Error).message}`);
//   }
// };
// export const loginUser = async (email: string, password: string) => {
//   const user = await userRepositary.findUserByEmail(email);
//   if (!user) {
//     throw new Error("Invalid Email/Password");
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new Error("Invalid Email/Password");
//   }
//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
//     expiresIn: "1h",
//   });
//   return { user, token };
// };
// export const checkEmail = async (email: string) => {
//   const user = await userRepositary.findUserByEmail(email);
//   if (!user) {
//     throw new Error('User not found');
//   }
//   const otp = otpGenerator();
//   await sendEmail(email, otp);
//   return { user, otp };
// };
// export const verifyOtpService = async (email: string, otp: string) => {
//   const user = await userRepositary.findUserByEmail(email);
//   if (!user) {
//     throw new Error("User not found");
//   }
//   if (user.otp === otp) {
//     await userRepositary.verifyAndSaveUserRepo(email, otp);
//     return "User registered successfully";
//   } else {
//     throw new Error("Invalid OTP");
//   }
// };
// export const update = async (email: string, password: string) => {
//   try {
//     console.log('Service: Calling repository to update password');
//     const user = await userRepositary.findUserByEmailupdate(email, password);
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// };
// const vendorRepository = new VendorRepository();
// export const getAllVendors = async (): Promise<any[]> => {
//   try {
//     return await vendorRepository.getAllVendors();
//   } catch (error) {
//     throw new Error('Error fetching vendors');
//   }
// };
// export const getAllDishes = async (vendorId: string): Promise<any[]> => {
//   try {
//     const result = await userRepositary.fetchfromDBDishes(vendorId);
//     return result;
//   } catch (error) {
//     throw new Error('Error fetching dishes');
//   }
// };
// export const getAllAuditorium = async (vendorId: string): Promise<any[]> => {
//   try {
//     console.log('Service: Fetching auditoriums for vendor:', vendorId);
//     const result = await userRepositary.fetchfromDBAuditorium(vendorId);
//     return result;
//   } catch (error) {
//     throw new Error('Error fetching auditoriums');
//   }
// };
// export const editUser = async (userDetails: any) => {
//   try {
//     return await userRepositary.userEditFromDB(userDetails);
//   } catch (error) {
//     throw new Error('Failed to update user details');
//   }
// };
// export const findVendorById = async (vendorId: string, userId: string) => {
//   try {
//     const vendor = await userRepositary.findVendor(vendorId); // Fetch the vendor details
//     const chat = await userRepositary.findVendorByIdInDb(vendorId, userId); // Fetch or create chat details
//     return { vendor, chatId: chat.chatId }; // Return both vendor and chat ID
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };
// export const findFoodVendorById = async (vendorId: string) => {
//   try {
//     console.log('Service invoked to find dishes for vendor:', vendorId);
//     const dishes = await userRepositary.findFoodVendorIdInDb(vendorId);
//     if (!dishes || dishes.length === 0) {
//       throw new Error(`Error finding vendor dishes`);
//     } else {
//       return dishes;
//     }
//   } catch (error) {
//     throw new Error(`Error finding vendor dishes: ${error}`);
//   }
// };
// export const findAuditoriumVendorById = async (vendorId: string) => {
//   try {
//     console.log('Service invoked to find dishes for vendor:', vendorId);
//     const dishes = await userRepositary.findAuditoriumVendorIdInDb(vendorId);
//     if (!dishes || dishes.length === 0) {
//       throw new Error(`Error finding vendor dishes`);
//     } else {
//       return dishes;
//     }
//   } catch (error) {
//     throw new Error(`Error finding vendor dishes: ${error}`);
//   }
// };
// export const findAuditoriumById = async (auditoriumId: string) => {
//   try {
//     const vendor = await userRepositary.findAuditoriumByIdInDb(auditoriumId);
//     if (!vendor) {
//       throw new Error(`Error finding vendor dishes`);
//     } else {
//       return vendor;
//     }
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };
// export const finddishesById = async (dishesId: string) => {
//   try {
//     const vendor = await userRepositary.finddishesByIdInDb(dishesId);
//     if (!vendor) {
//       throw new Error(`Error finding vendor`);
//     }
//     return vendor
//   } catch (error) {
//     throw new Error(`Error finding vendor: ${error}`);
//   }
// };
// export const findEvent = async (bookingId: string) => {
//   try {
//     const bookingDetails = await userRepositary.getBookingDetail(bookingId);
//     if (!bookingDetails) {
//       throw new Error(`Booking with id not found`);
//     }
//     return bookingDetails;
//   } catch (error) {
//     console.error("Error fetching booking details:", error);
//     throw error;
//   }
// };
// export const addTransactionDetails = async (
//   email: string,
//   PayUOrderId: string,
//   status: "success" | "failed"
// ) => {
//   try {
//     // const PayUOrderData = await PayURepository.getPayUOrder(PayUOrderId);
//     // if (!PayUOrderData) throw new Error("PayU Order Data not found");
//     // console.log("Got order id");
//     // console.log(PayUOrderData);
//     // const userData = await userServices.getUserDataByEmail(email);
//     // if (!userData) throw new Error("User Data not found.");
//     // const userId = userData._id.toString();
//     // const transaction = await adsRepository.addTransaction(
//     //   userId,
//     //   PayUOrderId,
//     //   PayUOrderData.mihpayid,
//     //   status,
//     //   PayUOrderData.amount
//     // );
//     // console.log("Added transaction");
//     // console.log(transaction);
//     // if (!transaction) throw new Error("Transaction Data not found");
//     // if (status === "success") {
//     //   const postId = PayUOrderData?.productinfo;
//     //   const WeNetAdsData = await adsRepository.createWenetAds(
//     //     userId,
//     //     postId,
//     //     transaction._id.toString()
//     //   );
//     //   console.log("created WeNetAdsData");
//     //   console.log(WeNetAdsData);
//     //   const postData = await adsRepository.addAdDataToPost(postId);
//     //   console.log("Added ad data to post ");
//     //   console.log(postData);
//     //   try {
//     //     await adsRepository.sendPostAdDataToMQ(
//     //       postData._id.toString(),
//     //       postData.WeNetAds
//     //     );
//     //   } catch (error: any) {
//     //     console.log(error.message);
//     //   }
//     // }
//     // return transaction._id.toString();
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// }
// export const fetchbookingData = async (bookingData: any) => {
//   const bookedTrip = await userRepositary.createBookedTrip(bookingData);
//   console.log(bookedTrip);
//   return bookedTrip;
// };
// export const findBookingDetails = async (userId: string) => {
//   const bookingDetails = await userRepositary.findDetailsByUserId(userId);
//   if (!bookingDetails) {
//     throw new Error(`Booking with id not found`);
//   }
//   return bookingDetails;
// };
// export const findchangePassword = async (userId: string, newPassword: string) => {
//   console.log('Updating password for userId:', userId);
//   const updatedPassword = await userRepositary.changepassword(userId, newPassword);
//   return updatedPassword;
// };
// export const findUserByEmailService = async (email: string) => {
//   try {
//     const user = await userRepositary.findUserByEmail(email);
//     console.log('otp service');
//     return { user, email };
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const generateOtp = () => {
//   const otp = otpGenerator();
//   console.log(otp, "OTP-------------------");
//   return otp;
// };
// export const generatesendEmail = async (email: string, otp: any) => {
//   try {
//     const result = sendEmail(email, otp);
//     console.log(result);
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new Error("Failed to send OTP.");
//   }
// };
// export const generatePaymentHash = async ({
//   txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
// }: {
//   txnid: string,
//   amount: string,
//   productinfo: string,
//   username: string,
//   email: string,
//   udf1: string,
//   udf2: string,
//   udf3: string,
//   udf4: string,
//   udf5: string,
//   udf6: string
// }) => {
//   try {
//     const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;
//     const sha = new jsSHA("SHA-512", "TEXT");
//     sha.update(hashString);
//     const hash = sha.getHash("HEX");
//     return hash;
//   } catch (error) {
//     throw new Error("Error generating payment hash");
//   }
// };
