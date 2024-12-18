import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { Dishes } from "../models/dishesModel.js";
import { Auditorium } from "../models/auditoriumModel.js";
import { bookedModel } from "../models/bookedEvent.js";
import { chatModel } from "../models/chatModel.js";
import { VendorModel } from "../models/vendorModel.js";
export default {
    createUser: async (user) => {
        try {
            const newUser = new UserModel(user);
            return newUser.save();
        }
        catch (error) {
            console.error(error);
        }
    },
    verifyAndSaveUserRepo: async (email, otp) => {
        try {
            const user = await UserModel.findOne({ email, isBlocked: false }).exec();
            if (user && user.otp === otp) {
                user.otp = undefined;
                user.otpVerified = true;
                await user.save();
                return user;
            }
            throw new Error("Invalid OTP");
        }
        catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Database Error');
        }
    },
    findUserByEmail: async (email) => {
        try {
            return await UserModel.findOne({ email, isBlocked: false }).exec();
        }
        catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Database Error');
        }
    },
    findUserById: async (userId) => {
        try {
            return UserModel.findById(userId);
        }
        catch (error) {
            console.error(error);
        }
    },
    userEditFromDB: async (userDetails) => {
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
            }
            else {
                const newUser = new UserModel(userDetails);
                await newUser.save();
                return newUser;
            }
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Database operation failed');
        }
    },
    updateUser: async (email, update) => {
        try {
            return UserModel.findOneAndUpdate({ email }, update, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    },
    findUserByEmailupdate: async (email, password) => {
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
        }
        catch (error) {
            console.error(error);
        }
    },
    getAllVendors: async () => {
        try {
            return await VendorModel.find().sort({ createdAt: -1 });
        }
        catch (error) {
            throw new Error('Error fetching vendors from the database');
        }
    },
    fetchfromDBDishes: async (vendorId) => {
        try {
            const objectId = new mongoose.Types.ObjectId(vendorId);
            const result = await Auditorium.find(objectId);
            return result;
        }
        catch (error) {
            console.error('Error fetching Dishes from the database:', error);
            throw new Error('Error fetching Dishes from the database');
        }
    },
    fetchfromDBAuditorium: async (vendorId) => {
        try {
            console.log('Fetching auditorium for vendor ID:', vendorId);
            const objectId = new mongoose.Types.ObjectId(vendorId);
            console.log(objectId);
            const result = await Auditorium.findById(objectId);
            console.log('Fetched auditorium:', result);
            return result;
        }
        catch (error) {
            console.error('Error fetching auditorium from the database:', error);
            throw new Error('Error fetching auditorium from the database');
        }
    },
    findVendor: async (vendorId) => {
        try {
            const vendor = await VendorModel.findById(vendorId);
            if (!vendor) {
                throw new Error("Vendor not found");
            }
            return vendor;
        }
        catch (error) {
            console.error("Error in repository:", error);
            throw error;
        }
    },
    findVendorByIdInDb: async (vendorId, userId) => {
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
        }
        catch (error) {
            console.error("Error in repository:", error);
            throw error;
        }
    },
    findFoodVendorIdInDb: async (vendorId) => {
        try {
            const objectId = new mongoose.Types.ObjectId(vendorId);
            const result = await Dishes.find({ vendorId: objectId });
            return result;
        }
        catch (error) {
            console.error('Error fetching dishes for vendor:', error);
            throw new Error(`Error fetching dishes: ${error}`);
        }
    },
    findAuditoriumVendorIdInDb: async (vendorId) => {
        try {
            const objectId = new mongoose.Types.ObjectId(vendorId);
            const result = await Auditorium.find({ vendorId: objectId });
            return result;
        }
        catch (error) {
            console.error('Error fetching dishes for vendor:', error);
            throw new Error(`Error fetching dishes: ${error}`);
        }
    },
    findAuditoriumByIdInDb: async (auditoriumId) => {
        try {
            let result = await Auditorium.findById(auditoriumId);
            return result;
        }
        catch (error) {
            console.error(error);
        }
    },
    finddishesByIdInDb: async (dishesId) => {
        try {
            let result = await Dishes.findById(dishesId);
            return result;
        }
        catch (error) {
            console.error(error);
        }
    },
    getBookingDetail: async (id) => {
        try {
            const bookedData = await bookedModel
                .findById(id);
            return bookedData;
        }
        catch (error) {
            console.error("Error fetching booking details:", error);
            throw error;
        }
    },
    createBookedTrip: async (bookingData) => {
        try {
            console.log('save karo');
            const { vendorId, txnid, status, amount, userId, auditoriumId, dishesId, date, category, payment_source } = bookingData;
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
        }
        catch (error) {
            console.error(error);
            return null;
        }
    },
    savechatDB: async (chat) => {
        try {
            console.log('Saving chat to DB');
            const newChat = new chatModel({ message: chat });
            return await newChat.save();
        }
        catch (error) {
            console.error("Database error:", error);
            throw new Error("Database operation failed.");
        }
    },
    findDetailsByUserId: async (userId) => {
        try {
            const results = await bookedModel
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
    },
    changepassword: async (userId, newPassword) => {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return user;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
};
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
