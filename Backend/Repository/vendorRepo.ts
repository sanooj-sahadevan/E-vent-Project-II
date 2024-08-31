// import mongoose, { Schema, Document } from "mongoose";
import mongoose,{Schema,Document} from "mongoose";
import { Vendor } from "../models/vendorModel.js";



// Extending the Company interface with mongoose Document
interface VendorModel extends Vendor, Document {
  otp?: string;
  otpVerified?: boolean;
}

// Define the Mongoose schema for the Company
const VendorSchema: Schema<VendorModel> = new Schema({
vendorname: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  adminVerified: { type: Boolean, default: false},
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },
});

// Create the Mongoose model
export const VendorModel = mongoose.model<VendorModel>("Vendor", VendorSchema);

// Function to create a new user
export const createVendor = async (vendor: Vendor) => {
  const newVendor = new VendorModel(vendor);
  return newVendor.save();
};

// Function to find a comapany by email
export const findVendorByEmail = async (email: string) => {
  return VendorModel.findOne({ email });
};

// Function to update a company by email
export const updateVendor = async (email: string, update: Partial<Vendor>) => {
  return VendorModel.findOneAndUpdate({ email }, update, { new: true });
};

// Function to find a company by email and password
export const findVendorByEmailAndPassword = async (
  email: string,
  password: string
) => {
  return VendorModel.findOne({ email, password });
};


