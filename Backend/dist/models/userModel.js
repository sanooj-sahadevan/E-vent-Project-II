import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
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
    isBlocked: {
        type: Boolean,
        default: false,
    },
});
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
