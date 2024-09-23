import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { VendorModel } from "./vendorRepo.js";
import { Dishes } from "../models/dishesModel.js";
import { Auditorium } from "../models/auditoriumModel.js";
import { bookedModel } from "../models/bookedEvent.js";
// Define the Mongoose schema for the User
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
    district: { type: String }, // Added 'district'
    pincode: { type: Number },
    reviews: { type: [String] } // Added 'reviews'
});
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
export const createUser = async (user) => {
    try {
        const newUser = new UserModel(user);
        return newUser.save();
    }
    catch (error) {
        console.error(error);
    }
};
export const findUserByEmail = async (email) => {
    try {
        return UserModel.findOne({ email });
    }
    catch (error) {
        console.error(error);
    }
};
export const findUserById = async (userId) => {
    try {
        return UserModel.findById(userId);
    }
    catch (error) {
        console.error(error);
    }
};
export const userEditFromDB = async (userDetails) => {
    try {
        const existingUser = await UserModel.findOne({ email: userDetails.email });
        if (existingUser) {
            existingUser.username = userDetails.username;
            existingUser.phone = userDetails.phone;
            existingUser.profileImage = userDetails.profileImage;
            existingUser.address = userDetails.address;
            existingUser.state = userDetails.state;
            existingUser.district = userDetails.district;
            existingUser.pincode = userDetails.pincode;
            existingUser.reviews = userDetails.reviews;
            await existingUser.save();
            return existingUser;
        }
        else {
            const newUser = new UserModel(userDetails);
            await newUser.save();
            return newUser;
        }
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Database operation failed');
    }
};
export const updateUser = async (email, update) => {
    try {
        return UserModel.findOneAndUpdate({ email }, update, { new: true });
    }
    catch (error) {
        console.error(error);
    }
};
export const findUserByEmailupdate = async (email, password) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        console.log(user.email);
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        return user;
    }
    catch (error) {
        console.error(error);
    }
};
export class VendorRepository {
    async getAllVendors() {
        try {
            return await VendorModel.find().sort({ createdAt: -1 }); // Fetch vendors sorted by creation date
        }
        catch (error) {
            throw new Error('Error fetching vendors from the database');
        }
    }
}
export const fetchfromDBDishes = async (vendorId) => {
    try {
        console.log('Fetching Dishes for vendor ID:', vendorId);
        const objectId = new mongoose.Types.ObjectId(vendorId);
        console.log(objectId);
        const result = await Auditorium.find(objectId);
        console.log('Fetched Dishes:', result);
        return result;
    }
    catch (error) {
        console.error('Error fetching Dishes from the database:', error);
        throw new Error('Error fetching Dishes from the database');
    }
};
export const fetchfromDBAuditorium = async (vendorId) => {
    try {
        console.log('Fetching auditorium for vendor ID:', vendorId);
        const objectId = new mongoose.Types.ObjectId(vendorId);
        console.log(objectId);
        const result = await Auditorium.findById(objectId);
        console.log('Fetched auditorium:', result);
        return result;
    }
    catch (error) {
        console.error('Error fetching auditorium from the database:', error);
        throw new Error('Error fetching auditorium from the database');
    }
};
export const findVendorByIdInDb = async (vendorId) => {
    try {
        return await VendorModel.findById(vendorId);
    }
    catch (error) {
        console.error(error);
    }
};
export const findFoodVendorIdInDb = async (vendorId) => {
    try {
        const objectId = new mongoose.Types.ObjectId(vendorId);
        const result = await Dishes.find({ vendorId: objectId });
        console.log('Result from database:', result);
        if (result.length === 0) {
            console.log('No dishes found for vendor:', vendorId);
            return null;
        }
        return result;
    }
    catch (error) {
        console.error('Error fetching dishes for vendor:', error);
        throw new Error(`Error fetching dishes: ${error}`);
    }
};
export const findAuditoriumVendorIdInDb = async (vendorId) => {
    try {
        const objectId = new mongoose.Types.ObjectId(vendorId);
        const result = await Auditorium.find({ vendorId: objectId }); // Query the Dishes collection
        console.log('Result from database:', result);
        if (result.length === 0) {
            console.log('No dishes found for vendor:', vendorId);
            return null; // Return null if no dishes found
        }
        return result; // Return the found dishes
    }
    catch (error) {
        console.error('Error fetching dishes for vendor:', error);
        throw new Error(`Error fetching dishes: ${error}`); // Return only the error message
    }
};
export const findAuditoriumByIdInDb = async (auditoriumId) => {
    try {
        let result = await Auditorium.findById(auditoriumId);
        console.log(result);
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
export const finddishesByIdInDb = async (dishesId) => {
    try {
        let result = await Dishes.findById(dishesId);
        console.log(result);
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
export const saveBookingDetailsInDB = async (bookingDetails) => {
    console.log('Saving booking details to database...');
    console.log(bookingDetails); // Log the details being saved
    const booking = new bookedModel(bookingDetails);
    const result = await booking.save(); // Use save on the instance
    console.log(result);
    return result;
};
export const getBookingDetail = async (id) => {
    try {
        const bookedData = await bookedModel
            .findById(id)
            .populate("userId");
        if (!bookedData) {
            throw new Error(`Booking with id ${id} not found`);
        }
        return bookedData;
    }
    catch (error) {
        console.error("Error fetching booking details:", error);
        throw error;
    }
};
