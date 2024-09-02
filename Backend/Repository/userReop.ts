import mongoose, { Schema, Document } from "mongoose";
import { User } from "../models/userModel.js";

// Extending the User interface with mongoose Document
interface UserModel extends User, Document {
    otp?: string;
    otpVerified?: boolean;
}

// Define the Mongoose schema for the User
const UserSchema: Schema<UserModel> = new Schema({
    username: { type: String, required: true },
    phone: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    otp: { type: String },
    otpVerified: { type: Boolean, default: false },
});

// Create the Mongoose model
const UserModel = mongoose.model<UserModel>("User", UserSchema);

// Function to create a new user
export const createUser = async (user: User) => {
    console.log('repo');

    const newUser = new UserModel(user);
    return newUser.save();
};

export const findUserByEmail = async (email: string) => {
    console.log('repositary  email');
    const result = await UserModel.findOne({email});
    
    return result;
    // return await UserModel.findOne({ email })
};

export const updateUser = async (email: string, update: Partial<User>) => {
    return UserModel.findOneAndUpdate({ email }, update, { new: true });
};
