import { ISlot } from "../slot";
import { User } from "../user";

export interface IUserRepository {
    getAllVendors(): Promise<any>

    saveBooking(bookingData: any): Promise<any>
    createUser(user: User): Promise<any>
    findUserByEmail(email: string): Promise<any>
    verifyAndSaveUserRepo(email: string, otp: string): Promise<any>
    findUserById(userId: string): Promise<any>
    userEditFromDB(userDetails: User): Promise<any>
    updateUser(email: string, update: Partial<User>): Promise<any>
    findUserByEmailupdate(email: string, password: string): Promise<any>
    fetchfromDBDishes(vendorId: string): Promise<any>
    fetchfromDBAuditorium(vendorId: string): Promise<any>
    findVendor(vendorId: string): Promise<any>
    findVendorByIdInDb(vendorId: string, userId: string): Promise<any>
    findReviewByIdInDb(vendorId: string, userId: string): Promise<any>
    findNotificationsByIdInDb(userId: string): Promise<any>
    findAuditoriumVendorIdInDb(vendorId: string): Promise<any>
    findAuditoriumByIdInDb(auditoriumId: string): Promise<any>
    finddishesByIdInDb(dishesId: string): Promise<any>
    getBookingDetail(id: string): Promise<any>
    savechatDB(chat: string): Promise<any>
    findDetailsByUserId(userId: string): Promise<any>
    changepassword(userId: string, newPassword: string): Promise<any>
    findFoodVendorIdInDb(vendorId: string): Promise<any>
    chatDB(userId: string): Promise<any>
    messageDB(chatIds: string[]): Promise<any>
    reviewRepository(reviewData: { reviews: string; stars: number; userId: string; vendorId: string }): Promise<any>
    getReviewsByVendorId(vendorId: string): Promise<any[]>
    updateVendorRating(vendorId: string, averageRating: number): Promise<any>
    getSlotsByWorkerIdFromRepo(vendorId: any): Promise<ISlot[]>
    updateBookingStatus(bookingData: any): Promise<any>
    searchVendorsByName(term: string): Promise<any>
}