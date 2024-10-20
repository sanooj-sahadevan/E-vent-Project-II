

export interface IUserService {

    registerUser(user: any): Promise<any[]>
    loginUser(email: string, password: string): Promise<any[]>
    checkEmail(email: string): Promise<any[]>
    verifyOtpService(email: string, otp: string): Promise<any[]>
    update(email: string, password: string): Promise<any[]>
    reviewService(reviewData: { reviews: string; stars: number; userId: string; vendorId: string }): Promise<any[]>
    getAllVendors(): Promise<any[]>
    getAllDishes(vendorId: string): Promise<any[]>
    getAllAuditorium(vendorId: string): Promise<any[]>
    editUser(userDetails: any): Promise<any[]>
    findVendorById(vendorId: string, userId: string): Promise<any[]>
    findFoodVendorById(vendorId: string): Promise<any[]>
    findAuditoriumVendorById(vendorId: string): Promise<any[]>

    findAuditoriumById(auditoriumId: string): Promise<any[]>

    finddishesById(dishesId: string): Promise<any[]>

    findEvent(bookingId: string): Promise<any[]>

    addTransactionDetails(
        email: string,
        PayUOrderId: string,
        status: "success" | "failed"
    ): Promise<any[]>

    fetchbookingData(bookingData: any): Promise<any[]>


    findBookingDetails(userId: string): Promise<any[]>


    findchangePassword(userId: string, newPassword: string): Promise<any[]>
    findUserByEmailService(email: string): Promise<any[]>

    generatePaymentHash({
        txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6
    }: {
        txnid: string,
        amount: string,
        productinfo: string,
        username: string,
        email: string,
        udf1: string,
        udf2: string,
        udf3: string,
        udf4: string,
        udf5: string,
        udf6: string
    }): Promise<any[]>

    chatServices({ userId }: { userId: string }): Promise<any>
    messageService({
        chatIds,
        userId,
    }: {
        chatIds: string[];
        userId: string;
    }): Promise<any>

}