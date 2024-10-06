export interface Vendor {
    [x: string]: any;
    vendorname: string;
    phone: number;
    email: string;
    password: string;
    profileImage?: string;
    // categories: string;
    address: string,
    district: string,
    state: string,
    reviews: string;
    otp?: string;
    otpVerified?: boolean;
    adminVerified?: boolean;
    isBlocked?: boolean;
    vendorId?: string;

}
