import jwt from 'jsonwebtoken';
import { IAdminRepository } from '../interfaces/repository/adminRepository';
import { IAdminService } from '../interfaces/service/adminService';


export class AdminService implements IAdminService {

  private adminRepository: IAdminRepository
  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async loginUser(email: string, password: string) {
    try {
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
    } catch (error) {
      throw new Error    }
  }

  async getAllVendorsService() {
    try {
      return await this.adminRepository.getAllVendorsFromDB();
    } catch (error) {
      console.error(error);
    }
  }
  async getAllBookingsService() {
    try {
      return await this.adminRepository.getAllBookingsFromDB();
    } catch (error) {
      throw new Error    }
  }

  async blockVendor(
    vendorId: string
  ) {
    const vendor = await this.adminRepository.findVendorById(vendorId);
    if (!vendor) {
      console.error(`Vendor with ID ${vendorId} not found`);
      throw new Error("Vendor not found");
    }
    if (vendor.isBlocked) {
      console.error(`Vendor with ID ${vendorId} is already blocked`);
      throw new Error("Vendor is already blocked");
    }

    return this.adminRepository.blockVendorById(vendorId);
  }

  async unblockVendor(
    vendorId: string
  ) {
    const vendor = await this.adminRepository.findVendorById(vendorId);
    if (!vendor) {
      console.error(`Vendor with ID ${vendorId} not found`);
      throw new Error("Vendor not found");
    }

    if (!vendor.isBlocked) {
      console.error(`Vendor with ID ${vendorId} is already unblocked`);
      throw new Error("Vendor is already unblocked");
    }

    return this.adminRepository.unblockVendorById(vendorId);
  }

  async getAllUsers() {
    return this.adminRepository.findAllUsers();
  }

  async blockUser(userId: string) {
    const user = await this.adminRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isBlocked) {
      throw new Error("User is already blocked");
    }

    return this.adminRepository.blockUserById(userId);
  }

  async unblockUser(userId: string) {
    const user = await this.adminRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isBlocked) {
      throw new Error("User is already unblocked");
    }

    return this.adminRepository.unblockUserById(userId);
  }

  async getDashboardData() {
    try {

      const totalEvents = await this.adminRepository.getTotalEvents();

      const totalRevenueResult = await this.adminRepository.getTotalRevenue();

      const totalRevenue = totalRevenueResult || 0;

      const totalVendors = await this.adminRepository.getTotalVendors();

      const totalUsers = await this.adminRepository.getTotalUsers();

      return {
        totalEvents,
        totalRevenue,
        totalVendors,
        totalUsers,
      };
    } catch (error: any) {
      console.log("error in admin service: ", error);
    }
  }
}
