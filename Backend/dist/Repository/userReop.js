import mongoose, { Schema } from "mongoose";
// Define the Mongoose schema for the User
const UserSchema = new Schema({
    username: { type: String, required: true },
    phone: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    otp: { type: String },
    otpVerified: { type: Boolean, default: false },
});
// Create the Mongoose model
const UserModel = mongoose.model("User", UserSchema);
// Function to create a new user
export const createUser = async (user) => {
    console.log('repo');
    const newUser = new UserModel(user);
    return newUser.save();
};
export const findUserByEmail = async (email) => {
    console.log('repositary  email');
    const result = await UserModel.findOne({ email });
    return result;
    // return await UserModel.findOne({ email })
};
export const updateUser = async (email, update) => {
    return UserModel.findOneAndUpdate({ email }, update, { new: true });
};
