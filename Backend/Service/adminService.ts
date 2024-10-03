import jwt from 'jsonwebtoken';
import { getAllVendorsFromDB, findVendorById, blockVendorById, getTotalVendors,
  unblockVendorById ,getAllBookingsFromDB,getTotalEvents,getTotalRevenue,getTotalUsers,
  findAllUsers,findUserById,blockUserById,unblockUserById} from '../Repository/adminRepo.js';
import { Vendor } from '../models/vendorModel.js';
import { errorHandler } from '../middleware/errorHandling.js';
import { error } from 'console';
import { User } from '../models/userModel.js';
import mongoose from 'mongoose';


export const loginUser = async (
  email: string,
  password: string
): Promise<{ adminToken: string; admin: string } | null> => {
  if (process.env.ADMIN_EMAIL !== email) {
    console.error(Error);
  }
  if (process.env.ADMIN_PASS !== password) {
    console.error(Error);
  }

  const adminToken = jwt.sign(
    {
      AdminEmail: email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { adminToken, admin: email };
};



export const getAllVendorsService = async () => {
  try {
    return await getAllVendorsFromDB();
  } catch (error) {
    console.error(error);
  }
};





export const getAllBookingsService = async () => {
  try {
    return await getAllBookingsFromDB();
  } catch (error) {
    console.error(error);
  }
};





export const blockVendor = async (
  vendorId: string
): Promise<Vendor | null> => {
  const vendor = await findVendorById(vendorId);
  if (!vendor) {
    console.error(`Vendor with ID ${vendorId} not found`);
    throw new Error("Vendor not found");
  }

  if (vendor.isBlocked) {
    console.error(`Vendor with ID ${vendorId} is already blocked`);
    throw new Error("Vendor is already blocked");
  }

  return blockVendorById(vendorId);
};

export const unblockVendor = async (
  vendorId: string
): Promise<Vendor | null> => {
  const vendor = await findVendorById(vendorId);
  if (!vendor) {
    console.error(`Vendor with ID ${vendorId} not found`);
    throw new Error("Vendor not found");
  }

  if (!vendor.isBlocked) {
    console.error(`Vendor with ID ${vendorId} is already unblocked`);
    throw new Error("Vendor is already unblocked");
  }

  return unblockVendorById(vendorId);
};



export const getAllUsers = async (): Promise<User[]> => {
  return findAllUsers();
};

/// Function to block a user
export const blockUser = async (userId: string): Promise<User | null> => {
  const user = await findUserById(userId); // Ensure this uses the User model
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isBlocked) {
    throw new Error("User is already blocked");
  }

  return blockUserById(userId); // This should operate on the UserModel, not VendorModel
};

// Function to unblock a user
export const unblockUser = async (userId: string): Promise<User | null> => {
  const user = await findUserById(userId); // Ensure this uses the User model
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isBlocked) {
    throw new Error("User is already unblocked");
  }

  return unblockUserById(userId); // This should operate on the UserModel, not VendorModel
};




export const getDashboardData = async () => {
  try {

    const totalEvents = await getTotalEvents();
    
    const totalRevenueResult = await getTotalRevenue();
    
    const totalRevenue = totalRevenueResult || 0;
    
    const totalVendors = await getTotalVendors();
    
    const totalUsers = await getTotalUsers();
    

    // const [reportStats, revenueLastTwoWeeks] = await Promise.all([
    //   getReportStats(),
    //   getRevenueLastTwoWeeks(),
    // ]);

    return {
      // reportStats,
      // revenueLastTwoWeeks,
      totalEvents,
      totalRevenue,
      totalVendors,
      totalUsers,
    };
  } catch (error: any) {
    console.log("error in admin service: ", error);
  }
};