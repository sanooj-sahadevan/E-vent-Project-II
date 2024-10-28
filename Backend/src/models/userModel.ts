import mongoose, { Schema } from "mongoose";
import { User } from "../interfaces/user";

const UserSchema = new Schema<User>({
    username: { type: String, required: true },
    phone: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    profileImage: { type: String },
    otp: { type: String },
    otpVerified: { type: Boolean, default: false },
    address: { type: String },
    state: { type: String },
    district: { type: String },
    pincode: { type: Number },
    reviews: { type: [String] },
    isBlocked: { type: Boolean, default: false },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
});

const UserModel = mongoose.model<User>("User", UserSchema);
export default UserModel;
