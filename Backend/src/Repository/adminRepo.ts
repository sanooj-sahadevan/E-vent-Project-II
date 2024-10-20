import mongoose, { Schema, Document } from "mongoose";
import { AdminModel } from "../models/adminModel";
import { bookedModel } from "../models/bookedEvent";
import { User } from "../interfaces/user";
import UserModel from "../models/userModel";
import { Admin } from "../interfaces/admin"
import { VendorModel } from "../models/vendorModel";
import { IAdminRepository } from "../interfaces/repository/adminRepository";



export class AdminRepository implements IAdminRepository {
  constructor() {
  }


  async findUserByEmailAdmin(email: string): Promise<Admin | null> {
    try {
      const admin = await AdminModel.findOne({ email });
      return admin ? admin : null;
    } catch (error) {
      throw new Error('Database Error');

    }
  }


  async getAllVendorsFromDB() {

    try {
      return VendorModel.find().sort({ createdAt: -1 })

    } catch (error) {
      throw new Error('Database Error');

    }
  }

  async getAllBookingsFromDB() {

    try {
      return bookedModel
        .find()
        .populate('vendorId')
        .populate('userId')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error('Database Error');

    }

  }




  async findVendorById(vendorId: string) {
    try {
      return VendorModel.findById(vendorId);
    } catch (error) {
      throw new Error('Database Error');

    }
  }




  async blockVendorById(vendorId: string) {
    try {
      return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: true }, { new: true });

    } catch (error) {
      throw new Error('Database Error');

    }
  }

  async unblockVendorById(vendorId: string) {
    try {
      return VendorModel.findByIdAndUpdate(vendorId, { isBlocked: false }, { new: true });

    } catch (error) {
      throw new Error('Database Error');

    }
  }


  async findAllUsers(): Promise<User[]> {
    try {
      return UserModel.find();
    } catch (error) {
      throw new Error('Database Error');

    }
  }

  async blockUserById(userId: string) {
    try {
      return UserModel.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });

    } catch (error) {
      throw new Error('Database Error');
    }
  }

  async unblockUserById(userId: string) {
    try {
      return UserModel.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });

    } catch (error) {
      throw new Error('Database Error');

    }
  }

  async findUserById(userId: string) {
    try {
      return UserModel.findById(userId);

    } catch (error) {
      throw new Error('Database Error');

    }
  }


  async getTotalEvents() {
    try {
      const res = await bookedModel.countDocuments();
      return res
    } catch (error: any) {
      console.error("Error getting total trips", error);
      throw new Error('Database Error');
    }
  }


  async getTotalRevenue() {
    try {
      const result = await bookedModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
      ]);
      console.log(result);

      return result[0]?.totalRevenue || 0;
    } catch (error: any) {
      console.error("Error getting total revenue", error);
      throw new Error('Database Error');
    }
  }

  async getTotalVendors() {
    try {

      const res = await VendorModel.countDocuments({});
      return res
    } catch (error: any) {
      console.error("Error getting total companies", error);
      throw new Error('Database Error');
    }
  }

  async getTotalUsers() {
    try {
      const res = await UserModel.countDocuments({});
      return res
    } catch (error: any) {
      console.error("Error getting total users", error);
      throw new Error('Database Error');
    }
  }



}
