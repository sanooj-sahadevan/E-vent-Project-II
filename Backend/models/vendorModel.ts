import mongoose, { Schema } from "mongoose";
import { Vendor } from "../interfaces/vendor";

const VendorSchema: Schema<Vendor> = new Schema({
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

export const VendorModel = mongoose.model<Vendor>("Vendor", VendorSchema);

export { Vendor };
