import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
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
export const findUserByEmailupdate = async (email, password) => {
    console.log('Repository: Updating user password');
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    // Safely log the user's email (after the null check)
    console.log(user.email);
    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update the user's password
    user.password = hashedPassword;
    // Save the updated user back to the database
    await user.save();
    return user; // Return the updated user
};
