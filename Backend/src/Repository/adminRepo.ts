import mongoose, { Schema, Document } from "mongoose";
import { AdminModel } from "../models/adminModel";
import { bookedModel } from "../models/bookedEvent";
import { User } from "../interfaces/user";
import UserModel from "../models/userModel";
import {Admin} from "../interfaces/admin"
import { VendorModel } from "../models/vendorModel";
import { IAdminRepository } from "../interfaces/repository/adminRepository";



export class AdminRepository implements IAdminRepository {
  constructor() {
  }
  
  
  async findUserByEmailAdmin  (
    email: string
  ): Promise<Admin | null>  {
    const admin = await AdminModel.findOne({ email });
    return admin ? admin : null;
  }
  
  
  async getAllVendorsFromDB  () {
    try {
      return VendorModel.find().sort({ createdAt: -1 })
  
    } catch (error) {
      console.error(error);
  
    }
  }
  
  async getAllBookingsFromDB  (){
  
    try {
      return bookedModel
        .find()
        .populate('vendorId')
        .populate('userId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error(error);
  
    }
  
  }
  
  
  
  
  async findVendorById  (vendorId: string)  {
    try {
      return VendorModel.findById(vendorId);
    } catch (error) {
      console.error(error);
  
    }
  }
  
  
  
  
  async  blockVendorById  (vendorId: string)  {
    try {
      return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: true }, { new: true });
  
    } catch (error) {
      console.error(error);
      
    }
  }
  
  async unblockVendorById  (vendorId: string)  {
    try {
      return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: false }, { new: true });
  
    } catch (error) {
      console.error(error);
      
    }
  }
  
  
  async findAllUsers  (): Promise<User[]>  {
    return UserModel.find();
  }
  
  async blockUserById  (userId: string)  {
    try {
      return UserModel.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
  
    } catch (error) {
      console.error(error);
      
    }
  }
  
  async unblockUserById  (userId: string)  {
    try {
      return UserModel.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
  
    } catch (error) {
      console.error(error);
      
    }
  }

  async findUserById  (userId: string)  {
    try {
      return UserModel.findById(userId);
  
    } catch (error) {
      console.error(error);
      
    }
  }
  
  
  async getTotalEvents  ()  {
    try {
      const res = await bookedModel.countDocuments();
      console.log(res);
      return res
  
    } catch (error: any) {
      console.error("Error getting total trips", error);
      throw error;
    }
  }
  
  
  async  getTotalRevenue  ()  {
    try {
      const result = await bookedModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]);
      console.log(result);
  
      return result[0]?.totalRevenue || 0;
    } catch (error: any) {
      console.error("Error getting total revenue", error);
      throw error;
    }
  }
  
  async getTotalVendors  ()  {
    try {
  
      const res = await VendorModel.countDocuments({});
      console.log(res);
      return res
    } catch (error: any) {
      console.error("Error getting total companies", error);
      throw error;
    }
  }
  
  async  getTotalUsers  ()  {
    try {
      const res = await UserModel.countDocuments({});
      console.log(res);
      return res
    } catch (error: any) {
      console.error("Error getting total users", error);
      throw error;
    }
  }



}

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