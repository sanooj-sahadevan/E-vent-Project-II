import { Admin } from "../admin";

export interface IAdminService{
    loginUser(email: string,password: string): Promise<any>
    getAllVendorsService(): Promise<any>
    getAllBookingsService(): Promise<any>
    blockVendor(vendorId: string): Promise<any>
    unblockVendor(vendorId: string): Promise<any>
    getAllUsers(): Promise<any>
    blockUser(userId: string): Promise<any>
    unblockUser(userId: string): Promise<any>
    getDashboardData(): Promise<any>
}