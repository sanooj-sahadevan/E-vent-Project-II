import mongoose from "mongoose";

export interface Vendor {
    [x: string]: any;
    vendorname: string;
    phone: number;
    email: string;
    password: string;
    profileImage?: string;
    address: string,
    district: string,
    state: string,
    description: string;
    otp?: string;
    otpVerified?: boolean;
    adminVerified?: boolean;
    isBlocked?: boolean;
    vendorId?: string;
    rating: number;
    reviewsID: mongoose.Schema.Types.ObjectId | null;
    serviceImages: string[];
    latitude: number;
    longitude: number;

}
