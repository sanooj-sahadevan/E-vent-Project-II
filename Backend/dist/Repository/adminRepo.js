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
const adminModel_js_1 = require("../models/adminModel.js");
const bookedEvent_js_1 = require("../models/bookedEvent.js");
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const vendorModel_js_1 = require("../models/vendorModel.js");
exports.default = {
    findUserByEmailAdmin: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield adminModel_js_1.AdminModel.findOne({ email });
        return admin ? admin : null;
    }),
    getAllVendorsFromDB: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return vendorModel_js_1.VendorModel.find().sort({ createdAt: -1 });
        }
        catch (error) {
            console.error(error);
        }
    }),
    getAllBookingsFromDB: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return bookedEvent_js_1.bookedModel
                .find()
                .populate('vendorId')
                .populate('userId')
                .sort({ createdAt: -1 });
        }
        catch (error) {
            console.error(error);
        }
    }),
    findVendorById: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return vendorModel_js_1.VendorModel.findById(vendorId);
        }
        catch (error) {
            console.error(error);
        }
    }),
    blockVendorById: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return vendorModel_js_1.VendorModel.findByIdAndUpdate(vendorId, { isBlocked: true }, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    }),
    unblockVendorById: (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return vendorModel_js_1.VendorModel.findByIdAndUpdate(vendorId, { isBlocked: false }, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    }),
    findAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        return userModel_js_1.default.find();
    }),
    blockUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return userModel_js_1.default.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    }),
    unblockUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return userModel_js_1.default.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
        }
        catch (error) {
            console.error(error);
        }
    }),
    findUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return userModel_js_1.default.findById(userId);
        }
        catch (error) {
            console.error(error);
        }
    }),
    getTotalEvents: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield bookedEvent_js_1.bookedModel.countDocuments();
            console.log(res);
            return res;
        }
        catch (error) {
            console.error("Error getting total trips", error);
            throw error;
        }
    }),
    getTotalRevenue: () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const result = yield bookedEvent_js_1.bookedModel.aggregate([
                { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
            ]);
            console.log(result);
            return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalRevenue) || 0;
        }
        catch (error) {
            console.error("Error getting total revenue", error);
            throw error;
        }
    }),
    getTotalVendors: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield vendorModel_js_1.VendorModel.countDocuments({});
            console.log(res);
            return res;
        }
        catch (error) {
            console.error("Error getting total companies", error);
            throw error;
        }
    }),
    getTotalUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield userModel_js_1.default.countDocuments({});
            console.log(res);
            return res;
        }
        catch (error) {
            console.error("Error getting total users", error);
            throw error;
        }
    }),
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
