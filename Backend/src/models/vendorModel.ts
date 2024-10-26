// import mongoose, { Schema } from "mongoose";
// import { Vendor } from "../interfaces/vendor";

// const VendorSchema: Schema<Vendor> = new Schema({

//   reviewsID: { type: mongoose.Schema.Types.ObjectId, ref: "Reviews", default: null },
//   vendorname: { type: String, required: true },
//   phone: { type: Number, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: [true, 'Password is required'], select: false },
//   profileImage: { type: String, default: '' },
//   adminVerified: { type: Boolean, default: false },
//   otp: { type: String, required: false },
//   otpVerified: { type: Boolean, default: false },
//   description: { type: String, default: '' },
//   address: { type: String, default: '' },
//   district: { type: String, default: '' },
//   rating: { type: Number, default: 0 },
//   state: { type: String, default: '' },
//   isBlocked: { type: Boolean, default: false, },
//   serviceImages: { type: [String], default: [] },  
// });

// export const VendorModel = mongoose.model<Vendor>("Vendor", VendorSchema)

// // export { Vendor };ex
// export default VendorModel

import mongoose, { Schema } from "mongoose";
import { Vendor } from "../interfaces/vendor";

const VendorSchema: Schema<Vendor> = new Schema({
    reviewsID: { type: mongoose.Schema.Types.ObjectId, ref: "Reviews", default: null },
    vendorname: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true, 'Password is required'], select: false },
    profileImage: { type: String, default: '' },
    adminVerified: { type: Boolean, default: false },
    otp: { type: String, required: false },
    otpVerified: { type: Boolean, default: false },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
    district: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    state: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
    serviceImages: { type: [String], default: [] },
    latitude: { type: Number, required: true },  
    longitude: { type: Number, required: true },  
});

export const VendorModel = mongoose.model<Vendor>("Vendor", VendorSchema);
export default VendorModel;


