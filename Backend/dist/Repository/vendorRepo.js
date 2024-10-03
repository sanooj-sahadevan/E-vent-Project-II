import mongoose, { Schema } from "mongoose";
import { uploadToS3Bucket } from "../middleware/fileUpload.js";
import { Dishes } from '../models/dishesModel.js';
import { Auditorium } from "../models/auditoriumModel.js";
import { bookedModel } from "../models/bookedEvent.js";
const VendorSchema = new Schema({
    vendorname: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true, 'Password is required'], select: false },
    profileImage: { type: String, default: '' },
    adminVerified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpVerified: { type: Boolean, default: false },
    reviews: { type: String, default: '' },
    address: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: '' },
    isBlocked: {
        type: Boolean,
        default: false,
    },
});
export const VendorModel = mongoose.model("Vendor", VendorSchema);
export const createVendor = async (vendor) => {
    try {
        const newVendor = new VendorModel(vendor);
        return newVendor.save();
    }
    catch (error) {
        console.error(error);
    }
};
export const findVendorByEmail = async (email) => {
    try {
        return VendorModel.findOne({ email });
    }
    catch (error) {
        console.error(error);
    }
};
export const updateVendor = async (email, update) => {
    try {
        return VendorModel.findOneAndUpdate({ email }, update, { new: true });
    }
    catch (error) {
        console.error(error);
    }
};
export const findVendorByEmailAndPassword = async (email, password) => {
    return VendorModel.findOne({ email, password });
};
export const vendorAddressFromDB = async () => {
    try {
        return await VendorModel.find().sort({ createdAt: -1 });
    }
    catch (error) {
        throw new Error('Database query failed');
    }
};
export const vendorEditFromDB = async (vendorDetails, imageUrl) => {
    try {
        const existingVendor = await VendorModel.findOne({ email: vendorDetails.email });
        if (existingVendor) {
            existingVendor.vendorname = vendorDetails.vendorname;
            existingVendor.phone = vendorDetails.phone;
            existingVendor.address = vendorDetails.address;
            existingVendor.district = vendorDetails.district;
            existingVendor.state = vendorDetails.state;
            existingVendor.reviews = vendorDetails.reviews;
            // Update profile image if a new one is uploaded
            if (imageUrl) {
                existingVendor.profileImage = imageUrl;
            }
            // Only update password if provided
            if (vendorDetails.password) {
                existingVendor.password = vendorDetails.password;
            }
            // Save the updated vendor
            await existingVendor.save();
            return existingVendor;
        }
        else {
            const newVendor = new VendorModel({
                ...vendorDetails,
                profileImage: imageUrl || vendorDetails.profileImage
            });
            await newVendor.save();
            return newVendor;
        }
    }
    catch (error) {
        console.error('Error updating vendor:', error);
        throw new Error('Database operation failed');
    }
};
export const uploadImage = async function (imageFile) {
    try {
        return await uploadToS3Bucket([], imageFile);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const findVendorByIdInDb = async (vendorId) => {
    console.log('controller 3');
    return await VendorModel.findById(vendorId);
};
export const findAuditoriumByIdInDb = async (auditoriumId) => {
    console.log(auditoriumId);
    let result = await Auditorium.findById(auditoriumId);
    console.log(result);
    return result;
};
export const findDishesByIdInDb = async (dishesId) => {
    try {
        console.log('controller 3');
        return await Dishes.findById(dishesId);
    }
    catch (error) {
        console.error(error);
    }
};
export const findFoodVendorIdInDb = async (vendorId) => {
    try {
        const result = await Dishes.find({ vendorId: vendorId });
        return result;
    }
    catch (error) {
        console.error(error);
    }
};
export const findAuditoriumVendorIdInDb = async (vendorId) => {
    try {
        const res = await Auditorium.find({ vendorId: vendorId });
        return res;
    }
    catch (error) {
        console.error(error);
    }
};
export const createDishes = async (dishesData) => {
    try {
        const dish = new Dishes({
            vendorId: dishesData.vendorId,
            dishesName: dishesData.data.dishesName,
            description: dishesData.data.description,
            menu: dishesData.data.menu,
            types: dishesData.data.types,
            price: dishesData.data.price,
            category: dishesData.data.category,
            status: dishesData.data.status,
            images: dishesData.images,
        });
        // Save the Dishes to the database
        const savedDish = await dish.save();
        console.log("Saved Dish: ", savedDish);
        return savedDish;
    }
    catch (error) {
        console.error("Error saving dish: ", error);
        throw error;
    }
};
export const createAuditorium = async (auditoriumData) => {
    try {
        const auditorium = new Auditorium({
            vendorId: auditoriumData.vendorId,
            auditoriumName: auditoriumData.data.auditoriumName,
            description: auditoriumData.data.description,
            types: auditoriumData.data.types,
            price: auditoriumData.data.price,
            category: auditoriumData.data.category,
            status: auditoriumData.data.status,
            images: auditoriumData.image ? [auditoriumData.image] : [], // Handle single image as array
            capacity: auditoriumData.data.capacity,
        });
        const savedAuditorium = await auditorium.save();
        console.log("Saved Auditorium: ", savedAuditorium);
        return {
            savedAuditorium,
            vendorId: auditoriumData.vendorId,
        };
    }
    catch (error) {
        console.error("Error saving auditorium: ", error);
        throw error;
    }
};
export const softDeleteDishRepo = async (dishId) => {
    try {
        const dish = await Dishes.findById(dishId);
        if (!dish || dish.isDeleted) {
            return null;
        }
        dish.isDeleted = true;
        await dish.save();
        return dish;
    }
    catch (error) {
        console.error(`Error soft-deleting dish: ${error}`);
        throw error;
    }
};
export const softDeleteAuditoriumRepo = async (auditoriumId) => {
    try {
        console.log('delete repo');
        const auditorium = await Auditorium.findById(auditoriumId);
        console.log(auditorium);
        if (!auditorium || auditorium.isDeleted) {
            return null;
        }
        auditorium.isDeleted = true;
        await auditorium.save();
        return auditorium;
    }
    catch (error) {
        console.error(`Error soft-deleting auditorium: ${error}`);
        throw error;
    }
};
export const findDetailsByvendorId = async (vendorId) => {
    try {
        const results = await bookedModel
            .find({ userId: vendorId }) // Find all bookings that match the userId
            .populate('dishesId') // Populate dishes details
            .populate('userId') // Populate user details
            .populate('vendorId') // Populate vendor details
            .populate('auditoriumId'); // Populate auditorium details
        console.log('Fetched Data with populated fields:', results);
        return results; // Return the array of populated results
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Database operation failed.");
    }
};
