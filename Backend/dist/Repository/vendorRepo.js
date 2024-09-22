// import mongoose, { Schema, Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { uploadToS3Bucket } from "../middleware/fileUpload.js";
import { Dishes } from '../models/dishesModel.js';
import { Auditorium } from "../models/auditoriumModel.js";
const VendorSchema = new Schema({
    vendorname: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true, 'Password is required'], select: false }, // `select: false` to exclude password by default in queries
    profileImage: { type: String, default: '' }, // Set default value for profileImage
    adminVerified: { type: Boolean, default: false }, // adminVerified is not required, default is false
    otp: { type: String, required: false }, // OTP is required for registration
    otpVerified: { type: Boolean, default: false }, // Set OTP as not verified by default
    reviews: { type: String, default: '' }, // Default to an empty string for reviews
    address: { type: String, default: '' }, // Default empty address
    district: { type: String, default: '' }, // Default empty district
    state: { type: String, default: '' }, // Default empty state
});
// Create the Mongoose model
export const VendorModel = mongoose.model("Vendor", VendorSchema);
// Function to create a new user
export const createVendor = async (vendor) => {
    console.log('last');
    const newVendor = new VendorModel(vendor);
    return newVendor.save();
};
// Function to find a comapany by email
export const findVendorByEmail = async (email) => {
    return VendorModel.findOne({ email });
};
// Function to update a company by email
export const updateVendor = async (email, update) => {
    return VendorModel.findOneAndUpdate({ email }, update, { new: true });
};
// Function to find a company by email and password
export const findVendorByEmailAndPassword = async (email, password) => {
    return VendorModel.findOne({ email, password });
};
export const vendorAddressFromDB = async () => {
    try {
        return await VendorModel.find().sort({ createdAt: -1 }); // Fetch sorted addresses
    }
    catch (error) {
        throw new Error('Database query failed'); // Error message for DB failure
    }
};
export const vendorEditFromDB = async (vendorDetails, imageUrl) => {
    try {
        // Find the vendor by email
        const existingVendor = await VendorModel.findOne({ email: vendorDetails.email });
        if (existingVendor) {
            // Update vendor details
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
    console.log('controller profile audioooooooooooooooooooo');
    console.log(auditoriumId);
    let result = await Auditorium.findById(auditoriumId);
    console.log(result);
    return result;
};
export const findDishesByIdInDb = async (dishesId) => {
    console.log('controller 3');
    return await Dishes.findById(dishesId);
};
export const findFoodVendorIdInDb = async (vendorId) => {
    console.log('Fetching dishes for vendor ID:', vendorId);
    const result = await Dishes.find({ vendorId: vendorId }); // Find all dishes with the matching vendorId
    console.log('---------------------', result);
    return result;
};
export const findAuditoriumVendorIdInDb = async (vendorId) => {
    console.log('Fetching auditorium for vendor ID:', vendorId);
    const res = await Auditorium.find({ vendorId: vendorId }); // Find all auditorium with the matching vendorId
    console.log('---------------------', res);
    return res;
};
export const createDishes = async (dishesData) => {
    try {
        // Create a new Dishes instance
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
