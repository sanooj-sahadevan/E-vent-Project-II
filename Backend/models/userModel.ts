// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   phone: { type: Number, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   profileImage: { type: String, default: '' },
//   otp: { type: String, default: '' },
//   otpVerified: { type: Boolean, default: false },
// });

// export const User = mongoose.model('User', UserSchema);




export interface User {
    reviews: any;
    district: any;
    _id: any;
    save(): unknown;
    username: string;
    phone?: number;
    email: string;
    password: string;
    profileImage?: string;
    otp?: string;
    otpVerified?: boolean;
    address: string;
    state: string;
    pincode: number;
    isBlocked?: boolean;

}

