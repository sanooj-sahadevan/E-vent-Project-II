import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { VendorModel } from "./vendorRepo.js";
import { Dishes } from "../models/dishesModel.js";
import { Auditorium } from "../models/auditoriumModel.js";
import { bookedModel } from "../models/bookedEvent.js";
import { chatModel } from "../models/chatModel.js";
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
        return await UserModel.findOne({ email, isBlocked: false }).exec();
    }
    catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Database Error');
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
export const findVendorByIdInDb = async (vendorId, userId) => {
    try {
        // Find the vendor by ID
        const vendor = await VendorModel.findById(vendorId);
        if (!vendor) {
            throw new Error("Vendor not found");
        }
        let chat = await chatModel.findOne({ userId, vendorId });
        if (!chat) {
            chat = new chatModel({
                userId,
                vendorId,
            });
            await chat.save();
        }
        return {
            vendor,
            chatId: chat._id
        };
    }
    catch (error) {
        console.error("Error in repository:", error);
        throw error;
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
        const result = await Auditorium.find({ vendorId: objectId });
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
export const findAuditoriumByIdInDb = async (auditoriumId) => {
    console.log('repoo vann auditorum1');
    try {
        console.log('repoo vann auditorum2');
        let result = await Auditorium.findById(auditoriumId);
        console.log('repoo vann auditorum3');
        console.log(result);
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
export const finddishesByIdInDb = async (dishesId) => {
    console.log('repo van');
    try {
        console.log('repo van');
        let result = await Dishes.findById(dishesId);
        console.log(result, 'resulty ann ');
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
export const getBookingDetail = async (id) => {
    try {
        const bookedData = await bookedModel
            .findById(id);
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
export const createBookedTrip = async (bookingData) => {
    try {
        console.log('save karo');
        const { vendorId, txnid, status, amount, userId, auditoriumId, dishesId, date, category, eventType, payment_source } = bookingData;
        const bookedData = await bookedModel.create({
            vendorId,
            txnId: txnid,
            paymentStatus: status,
            totalAmount: amount,
            userId,
            auditoriumId,
            dishesId,
            date,
            category,
            eventType,
            payment_source,
            createdAt: new Date(),
        });
        return bookedData;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
export const savechatDB = async (chat) => {
    try {
        console.log('Saving chat to DB');
        const newChat = new chatModel({ message: chat });
        return await newChat.save();
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Database operation failed.");
    }
};
export const findDetailsByUserId = async (userId) => {
    try {
        const results = await bookedModel
            .find({ userId: userId })
            .populate('dishesId')
            .populate('userId')
            .populate('vendorId')
            .populate('auditoriumId');
        console.log('Fetched Data with populated fields:', results);
        return results;
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Database operation failed.");
    }
};
export const changepassword = async (userId, newPassword) => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return user;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
