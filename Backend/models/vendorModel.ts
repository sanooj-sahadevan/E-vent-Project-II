export interface Vendor {
    vendorname: string;
    phone: number;
    email: string;
    password: string;
    profileImage?: string;
    // categories: string;
    // reviews: string;
    otp?: string;
    otpVerified?: boolean;
    adminVerified?: boolean;
}
