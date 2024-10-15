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
class UserRepository {
    constructor() {
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.default(user);
                return yield newUser.save();
            }
            catch (error) {
                throw new Error('Database Error');
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield userModel_1.default.findOne({ email, isBlocked: false }).exec();
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
                return userModel_1.default.findById(userId);
            }
            catch (error) {
                console.error(error);
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
                return userModel_1.default.findOneAndUpdate({ email }, update, { new: true });
            }
            catch (error) {
                console.error(error);
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
                console.error(error);
            }
        });
    }
    getAllVendors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield vendorModel_1.VendorModel.find().sort({ createdAt: -1 });
            }
            catch (error) {
                throw new Error('Error fetching vendors from the database');
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
    fetchfromDBAuditorium(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching auditorium for vendor ID:', vendorId);
                const objectId = new mongoose_1.default.Types.ObjectId(vendorId);
                console.log(objectId);
                const result = yield auditoriumModel_1.Auditorium.findById(objectId);
                console.log('Fetched auditorium:', result);
                return result;
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
                const vendor = yield vendorModel_1.VendorModel.findById(vendorId);
                if (!vendor) {
                    throw new Error("Vendor not found");
                }
                return vendor;
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
                console.error("Error in repository:", error);
                throw error;
            }
        });
    }
    findNotificationsByIdInDb(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.Notification.find();
                // .populate('vendorId')
                // .populate('userId')
                return { notification: notifications };
            }
            catch (error) {
                console.error("Error in repository:", error);
                throw new Error(`Error fetching notifications from DB: ${error}`);
            }
        });
    }
    findFoodVendorIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(vendorId);
                const result = yield dishesModel_1.Dishes.find({ vendorId: objectId });
                return result;
            }
            catch (error) {
                console.error('Error fetching dishes for vendor:', error);
                throw new Error(`Error fetching dishes: ${error}`);
            }
        });
    }
    findAuditoriumVendorIdInDb(vendorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(vendorId);
                const result = yield auditoriumModel_1.Auditorium.find({ vendorId: objectId });
                return result;
            }
            catch (error) {
                console.error('Error fetching dishes for vendor:', error);
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
                console.error(error);
            }
        });
    }
    finddishesByIdInDb(dishesId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield dishesModel_1.Dishes.findById(dishesId);
                return result;
            }
            catch (error) {
                console.error(error);
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
                throw error;
            }
        });
    }
    createBookedTrip(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('save karo');
                const { vendorId, txnid, status, amount, userId, auditoriumId, dishesId, StartingDate, eventType, EndingDate, category, payment_source } = bookingData;
                console.log(bookingData);
                const bookedData = yield bookedEvent_1.bookedModel.create({
                    vendorId,
                    txnId: txnid,
                    paymentStatus: status,
                    totalAmount: amount,
                    userId,
                    auditoriumId,
                    dishesId,
                    StartingDate,
                    eventType, EndingDate,
                    category,
                    payment_source,
                    createdAt: new Date(),
                });
                return bookedData;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    savechatDB(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Saving chat to DB');
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
                    .find({ userId: userId })
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
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return yield slotModel_1.Slot.find({
                vendorId,
                date: { $gte: today },
            }).exec();
        });
    }
}
exports.UserRepository = UserRepository;
/*
export default {
 createUser : async (user: User) => {
  try {
    const newUser = new UserModel(user);
    return newUser.save();
  } catch (error) {
    console.error(error);

  }
},
 verifyAndSaveUserRepo : async (email: string, otp: string) => {
  try {
    const user = await  UserModel.findOne({ email, isBlocked: false }).exec();
    if (user && user.otp === otp) {
      user.otp = undefined;
      user.otpVerified = true;
      await user.save();
      return user;
    }
    throw new Error("Invalid OTP");
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Database Error');
  }
},


 findUserByEmail : async (email: string) => {
  try {
    return await UserModel.findOne({ email, isBlocked: false }).exec();
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw new Error('Database Error');
  }
},



 findUserById : async (userId: string) => {
  try {
    return UserModel.findById(userId);
  } catch (error) {
    console.error(error);

  }
},

 userEditFromDB : async (userDetails: User): Promise<User> => {
  try {
    const existingUser = await UserModel.findOne({ email: userDetails.email });
    if (existingUser) {
      existingUser.username = userDetails.username;
      existingUser.phone = userDetails.phone;
      existingUser.profileImage = userDetails.profileImage;
      existingUser.address = userDetails.address;
      existingUser.state = userDetails.state;
      existingUser.district = userDetails.district;
      existingUser.pincode = userDetails.pincode;
      existingUser.reviews = userDetails.reviews;
      await existingUser.save();
      return existingUser;
    } else {
      const newUser = new UserModel(userDetails);
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Database operation failed');
  }
},

updateUser : async (email: string, update: Partial<User>) => {
  try {
    return UserModel.findOneAndUpdate({ email }, update, { new: true });
  } catch (error) {
    console.error(error);
  }
},

 findUserByEmailupdate : async (email: string, password: string) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    console.log(user.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return user;
  } catch (error) {
    console.error(error);

  }
},

getAllVendors : async () => {
    try {
      return await VendorModel.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error('Error fetching vendors from the database');
    }
  },













 fetchfromDBDishes : async (vendorId: string): Promise<any | null> => {
  try {
    const objectId = new mongoose.Types.ObjectId(vendorId);
    const result = await Auditorium.find(objectId);
    return result;
  } catch (error) {
    console.error('Error fetching Dishes from the database:', error);
    throw new Error('Error fetching Dishes from the database');
  }

},


fetchfromDBAuditorium : async (vendorId: string): Promise<any | null> => {
  try {
    console.log('Fetching auditorium for vendor ID:', vendorId);

    const objectId = new mongoose.Types.ObjectId(vendorId);
    console.log(objectId);

    const result = await Auditorium.findById(objectId);

    console.log('Fetched auditorium:', result);

    return result;
  } catch (error) {
    console.error('Error fetching auditorium from the database:', error);
    throw new Error('Error fetching auditorium from the database');
  }
},

 findVendor : async (vendorId: string) => {
  try {
    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return vendor;
  } catch (error) {
    console.error("Error in repository:", error);
    throw error;
  }
},

 findVendorByIdInDb : async (vendorId: string, userId: string) => {
  try {
    let chat = await chatModel.findOne({ userId, vendorId });
    if (!chat) {
      chat = new chatModel({
        userId,
        vendorId,
      });
      await chat.save();
    }
    return { chatId: chat._id };
  } catch (error) {
    console.error("Error in repository:", error);
    throw error;
  }
},



 findFoodVendorIdInDb : async (vendorId: string) => {
  try {
    const objectId = new mongoose.Types.ObjectId(vendorId);
    const result = await Dishes.find({ vendorId: objectId });
    return result;
  } catch (error) {
    console.error('Error fetching dishes for vendor:', error);
    throw new Error(`Error fetching dishes: ${error}`);
  }
},

 findAuditoriumVendorIdInDb : async (vendorId: string) => {
  try {
    const objectId = new mongoose.Types.ObjectId(vendorId);

    const result = await Auditorium.find({ vendorId: objectId });
    return result
  } catch (error) {
    console.error('Error fetching dishes for vendor:', error);
    throw new Error(`Error fetching dishes: ${error}`);
  }
},


 findAuditoriumByIdInDb : async (auditoriumId: string) => {

  try {
    let result = await Auditorium.findById(auditoriumId);
    return result
  } catch (error) {
    console.error(error);

  }
},

 finddishesByIdInDb : async (dishesId: string) => {
  try {
     let result = await Dishes.findById(dishesId);
    return result
  } catch (error) {
    console.error(error);
  }
},

getBookingDetail : async (id: string) => {
  try {

    const bookedData = await bookedModel
      .findById(id)
    return bookedData;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
},


 createBookedTrip : async (bookingData: any) => {
  try {
    console.log('save karo');

    const {
      vendorId,
      txnid,
      status,
      amount,
      userId,
      auditoriumId,
      dishesId,
      date,
      category,
      payment_source
    } = bookingData;

    const bookedData = await bookedModel.create({
      vendorId,
      txnId: txnid,
      paymentStatus: status,
      totalAmount: amount,
      userId,
      auditoriumId,
      dishesId,
      date,
      category,
      payment_source,
      createdAt: new Date(),
    });

    return bookedData;
  } catch (error) {
    console.error(error);
    return null;
  }
},

 savechatDB : async (chat: string) => {
  try {
    console.log('Saving chat to DB');

    const newChat = new chatModel({ message: chat });
    return await newChat.save();
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database operation failed.");
  }
},


 findDetailsByUserId : async (userId: string) => {
  try {
    const results = await bookedModel
      .find({ userId: userId })
      .populate('dishesId')
      .populate('userId')
      .populate('vendorId')
      .populate('auditoriumId');
    return results;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database operation failed.");
  }
},


changepassword : async (userId: string, newPassword: string) => {
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
}

*/
// export const createUser = async (user: User) => {
//   try {
//     const newUser = new UserModel(user);
//     return newUser.save();
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const verifyAndSaveUserRepo = async (email: string, otp: string) => {
//   try {
//     const user = await findUserByEmail(email);
//     if (user && user.otp === otp) {
//       user.otp = undefined;
//       user.otpVerified = true;
//       await user.save();
//       return user;
//     }
//     throw new Error("Invalid OTP");
//   } catch (error) {
//     console.error('Error saving user:', error);
//     throw new Error('Database Error');
//   }
// };
// export const findUserByEmail = async (email: string) => {
//   try {
//     return await UserModel.findOne({ email, isBlocked: false }).exec();
//   } catch (error) {
//     console.error('Error finding user by email:', error);
//     throw new Error('Database Error');
//   }
// };
// export const findUserById = async (userId: string) => {
//   try {
//     return UserModel.findById(userId);
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const userEditFromDB = async (userDetails: User): Promise<User> => {
//   try {
//     const existingUser = await UserModel.findOne({ email: userDetails.email });
//     if (existingUser) {
//       existingUser.username = userDetails.username;
//       existingUser.phone = userDetails.phone;
//       existingUser.profileImage = userDetails.profileImage;
//       existingUser.address = userDetails.address;
//       existingUser.state = userDetails.state;
//       existingUser.district = userDetails.district;
//       existingUser.pincode = userDetails.pincode;
//       existingUser.reviews = userDetails.reviews;
//       await existingUser.save();
//       return existingUser;
//     } else {
//       const newUser = new UserModel(userDetails);
//       await newUser.save();
//       return newUser;
//     }
//   } catch (error) {
//     console.error('Error updating user:', error);
//     throw new Error('Database operation failed');
//   }
// };
// export const updateUser = async (email: string, update: Partial<User>) => {
//   try {
//     return UserModel.findOneAndUpdate({ email }, update, { new: true });
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const findUserByEmailupdate = async (email: string, password: string) => {
//   try {
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       throw new Error("User not found");
//     }
//     console.log(user.email);
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     await user.save();
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// };
// export class VendorRepository {
//   public async getAllVendors(): Promise<any[]> {
//     try {
//       return await VendorModel.find().sort({ createdAt: -1 });
//     } catch (error) {
//       throw new Error('Error fetching vendors from the database');
//     }
//   }
// }
// export const fetchfromDBDishes = async (vendorId: string): Promise<any | null> => {
//   try {
//     const objectId = new mongoose.Types.ObjectId(vendorId);
//     const result = await Auditorium.find(objectId);
//     return result;
//   } catch (error) {
//     console.error('Error fetching Dishes from the database:', error);
//     throw new Error('Error fetching Dishes from the database');
//   }
// };
// export const fetchfromDBAuditorium = async (vendorId: string): Promise<any | null> => {
//   try {
//     console.log('Fetching auditorium for vendor ID:', vendorId);
//     const objectId = new mongoose.Types.ObjectId(vendorId);
//     console.log(objectId);
//     const result = await Auditorium.findById(objectId);
//     console.log('Fetched auditorium:', result);
//     return result;
//   } catch (error) {
//     console.error('Error fetching auditorium from the database:', error);
//     throw new Error('Error fetching auditorium from the database');
//   }
// };
// export const findVendor = async (vendorId: string) => {
//   try {
//     const vendor = await VendorModel.findById(vendorId);
//     if (!vendor) {
//       throw new Error("Vendor not found");
//     }
//     return vendor;
//   } catch (error) {
//     console.error("Error in repository:", error);
//     throw error;
//   }
// };
// export const findVendorByIdInDb = async (vendorId: string, userId: string) => {
//   try {
//     let chat = await chatModel.findOne({ userId, vendorId });
//     if (!chat) {
//       chat = new chatModel({
//         userId,
//         vendorId,
//       });
//       await chat.save();
//     }
//     return { chatId: chat._id };
//   } catch (error) {
//     console.error("Error in repository:", error);
//     throw error;
//   }
// };
// export const findFoodVendorIdInDb = async (vendorId: string) => {
//   try {
//     const objectId = new mongoose.Types.ObjectId(vendorId);
//     const result = await Dishes.find({ vendorId: objectId });
//     return result;
//   } catch (error) {
//     console.error('Error fetching dishes for vendor:', error);
//     throw new Error(`Error fetching dishes: ${error}`);
//   }
// };
// export const findAuditoriumVendorIdInDb = async (vendorId: string) => {
//   try {
//     const objectId = new mongoose.Types.ObjectId(vendorId);
//     const result = await Auditorium.find({ vendorId: objectId });
//     return result
//   } catch (error) {
//     console.error('Error fetching dishes for vendor:', error);
//     throw new Error(`Error fetching dishes: ${error}`);
//   }
// };
// export const findAuditoriumByIdInDb = async (auditoriumId: string) => {
//   try {
//     let result = await Auditorium.findById(auditoriumId);
//     return result
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const finddishesByIdInDb = async (dishesId: string) => {
//   try {
//      let result = await Dishes.findById(dishesId);
//     return result
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const getBookingDetail = async (id: string) => {
//   try {
//     const bookedData = await bookedModel
//       .findById(id)
//     return bookedData;
//   } catch (error) {
//     console.error("Error fetching booking details:", error);
//     throw error;
//   }
// };
// export const createBookedTrip = async (bookingData: any) => {
//   try {
//     console.log('save karo');
//     const {
//       vendorId,
//       txnid,
//       status,
//       amount,
//       userId,
//       auditoriumId,
//       dishesId,
//       date,
//       category,
//       eventType,
//       payment_source
//     } = bookingData;
//     const bookedData = await bookedModel.create({
//       vendorId,
//       txnId: txnid,
//       paymentStatus: status,
//       totalAmount: amount,
//       userId,
//       auditoriumId,
//       dishesId,
//       date,
//       category,
//       eventType,
//       payment_source,
//       createdAt: new Date(),
//     });
//     return bookedData;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
// export const savechatDB = async (chat: string) => {
//   try {
//     console.log('Saving chat to DB');
//     const newChat = new chatModel({ message: chat });
//     return await newChat.save();
//   } catch (error) {
//     console.error("Database error:", error);
//     throw new Error("Database operation failed.");
//   }
// };
// export const findDetailsByUserId = async (userId: string) => {
//   try {
//     const results = await bookedModel
//       .find({ userId: userId })
//       .populate('dishesId')
//       .populate('userId')
//       .populate('vendorId')
//       .populate('auditoriumId');
//     return results;
//   } catch (error) {
//     console.error("Database error:", error);
//     throw new Error("Database operation failed.");
//   }
// };
// export const changepassword = async (userId: string, newPassword: string) => {
//   try {
//     const user = await UserModel.findById(userId);
//     if (!user) {
//       throw new Error("User not found");
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
//     return user;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
