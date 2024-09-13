// import mongoose, { Schema, Document } from "mongoose";
import mongoose,{Schema,Document} from "mongoose";
import { Vendor } from "../models/vendorModel.js";
import jwt from "jsonwebtoken";




// Extending the Company interface with mongoose Document
interface VendorModel extends Vendor, Document {
  otp?: string;
  otpVerified?: boolean;
}
const VendorSchema: Schema<VendorModel> = new Schema({
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
export const VendorModel = mongoose.model<VendorModel>("Vendor", VendorSchema);

// Function to create a new user
export const createVendor = async (vendor: Vendor) => {
  console.log('last');
  
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



export const vendorAddressFromDB = async () => {
  try {
    return await VendorModel.find().sort({ createdAt: -1 }); // Fetch sorted addresses
  } catch (error) {
    throw new Error('Database query failed'); // Error message for DB failure
  }
};




export const vendorEditFromDB = async (vendorDetails: Vendor): Promise<Vendor> => {
  try {
    // Find the vendor by email
    const existingVendor = await VendorModel.findOne({ email: vendorDetails.email });

    if (existingVendor) {
      // Update vendor details
      existingVendor.vendorname = vendorDetails.vendorname;
      existingVendor.phone = vendorDetails.phone;
      existingVendor.profileImage = vendorDetails.profileImage;
      existingVendor.address = vendorDetails.address;
      existingVendor.district = vendorDetails.district;
      existingVendor.state = vendorDetails.state;
      existingVendor.reviews = vendorDetails.reviews;

      // Only update password if provided
      if (vendorDetails.password) {
        existingVendor.password = vendorDetails.password;
      }

      // Save the updated vendor
      await existingVendor.save();
      return existingVendor;
    } else {
      // If vendor doesn't exist, create a new one
      const newVendor = new VendorModel(vendorDetails);
      await newVendor.save();
      return newVendor;
    }
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw new Error('Database operation failed');
  }
};


