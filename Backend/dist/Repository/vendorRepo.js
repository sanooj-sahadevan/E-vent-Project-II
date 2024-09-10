// import mongoose, { Schema, Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
// Define the Mongoose schema for the Company
const VendorSchema = new Schema({
    vendorname: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    adminVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpVerified: { type: Boolean, default: false },
});
// Create the Mongoose model
export const VendorModel = mongoose.model("Vendor", VendorSchema);
// Function to create a new user
export const createVendor = async (vendor) => {
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
