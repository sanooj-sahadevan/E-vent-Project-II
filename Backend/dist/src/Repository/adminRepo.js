import { AdminModel } from "../models/adminModel.js";
import { bookedModel } from "../models/bookedEvent.js";
import UserModel from "../models/userModel.js";
import { VendorModel } from "../models/vendorModel.js";
export default {
    findUserByEmailAdmin: async (email) => {
        const admin = await AdminModel.findOne({ email });
        return admin ? admin : null;
    },
    getAllVendorsFromDB: async () => {
        try {
            return VendorModel.find().sort({ createdAt: -1 });
        }
        catch (error) {
            console.error(error);
        }
    },
    getAllBookingsFromDB: async () => {
        try {
            return bookedModel
                .find()
                .populate('vendorId')
                .populate('userId')
                .sort({ createdAt: -1 });
        }
        catch (error) {
            console.error(error);
        }
    },
    findVendorById: async (vendorId) => {
        try {
            return VendorModel.findById(vendorId);
        }
        catch (error) {
            console.error(error);
        }
    },
    blockVendorById: async (vendorId) => {
        try {
            return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: true }, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    },
    unblockVendorById: async (vendorId) => {
        try {
            return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: false }, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    },
    findAllUsers: async () => {
        return UserModel.find();
    },
    blockUserById: async (userId) => {
        try {
            return UserModel.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    },
    unblockUserById: async (userId) => {
        try {
            return UserModel.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
        }
        catch (error) {
            console.error(error);
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
    getTotalEvents: async () => {
        try {
            const res = await bookedModel.countDocuments();
            console.log(res);
            return res;
        }
        catch (error) {
            console.error("Error getting total trips", error);
            throw error;
        }
    },
    getTotalRevenue: async () => {
        try {
            const result = await bookedModel.aggregate([
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
            ]);
            console.log(result);
            return result[0]?.totalRevenue || 0;
        }
        catch (error) {
            console.error("Error getting total revenue", error);
            throw error;
        }
    },
    getTotalVendors: async () => {
        try {
            const res = await VendorModel.countDocuments({});
            console.log(res);
            return res;
        }
        catch (error) {
            console.error("Error getting total companies", error);
            throw error;
        }
    },
    getTotalUsers: async () => {
        try {
            const res = await UserModel.countDocuments({});
            console.log(res);
            return res;
        }
        catch (error) {
            console.error("Error getting total users", error);
            throw error;
        }
    },
};
// export const findUserByEmailAdmin = async (
//   email: string
// ): Promise<Admin | null> => {
//   const admin = await AdminModel.findOne({ email });
//   return admin ? admin : null;
// };
// export const getAllVendorsFromDB = async () => {
//   try {
//     return VendorModel.find().sort({ createdAt: -1 })
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const getAllBookingsFromDB = async () => {
//   try {
//     return bookedModel
//       .find()
//       .populate('vendorId')
//       .populate('userId')
//       .sort({ createdAt: -1 });
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const findVendorById = async (vendorId: string) => {
//   try {
//     return VendorModel.findById(vendorId);
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const blockVendorById = async (vendorId: string) => {
//   try {
//     return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: true }, { new: true });
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const unblockVendorById = async (vendorId: string) => {
//   try {
//     return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: false }, { new: true });
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const findAllUsers = async (): Promise<User[]> => {
//   return UserModel.find();
// };
// export const blockUserById = async (userId: string) => {
//   try {
//     return UserModel.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const unblockUserById = async (userId: string) => {
//   try {
//     return UserModel.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
//   } catch (error) {
//     console.error(error);
//   }
// }
// export const findUserById = async (userId: string) => {
//   try {
//     return UserModel.findById(userId);
//   } catch (error) {
//     console.error(error);
//   }
// };
// export const getTotalEvents = async () => {
//   try {
//     const res = await bookedModel.countDocuments();
//     console.log(res);
//     return res
//   } catch (error: any) {
//     console.error("Error getting total trips", error);
//     throw error;
//   }
// };
// export const getTotalRevenue = async () => {
//   try {
//     const result = await bookedModel.aggregate([
//       { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
//     ]);
//     console.log(result);
//     return result[0]?.totalRevenue || 0;
//   } catch (error: any) {
//     console.error("Error getting total revenue", error);
//     throw error;
//   }
// };
// export const getTotalVendors = async () => {
//   try {
//     const res = await VendorModel.countDocuments({});
//     console.log(res);
//     return res
//   } catch (error: any) {
//     console.error("Error getting total companies", error);
//     throw error;
//   }
// };
// export const getTotalUsers = async () => {
//   try {
//     const res = await UserModel.countDocuments({});
//     console.log(res);
//     return res
//   } catch (error: any) {
//     console.error("Error getting total users", error);
//     throw error;
//   }
// };
