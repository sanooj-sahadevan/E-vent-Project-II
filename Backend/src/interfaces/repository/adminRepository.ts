import { Admin } from "../admin";

export interface IAdminRepository {
    getAllVendorsFromDB(): Promise<any>
    getAllBookingsFromDB(): Promise<any>
    findVendorById(vendorId: string): Promise<any>
    blockVendorById(vendorId: string): Promise<any>
    unblockVendorById(vendorId: string): Promise<any>
    findAllUsers(): Promise<any>
    blockUserById(userId: string): Promise<any>
    unblockUserById(userId: string): Promise<any>
    findUserById(userId: string): Promise<any>
    getTotalEvents(): Promise<any>
    getTotalRevenue(): Promise<any>
    getTotalVendors(): Promise<any>
    getTotalUsers(): Promise<any>

}