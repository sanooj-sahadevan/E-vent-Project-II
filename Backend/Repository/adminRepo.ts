import mongoose, { Schema, Document } from "mongoose";
import { Admin } from "../models/adminModel";
import { Vendor } from "../models/vendorModel";
import { VendorModel } from "./vendorRepo";

// Define the Mongoose schema for the User
const AdminSchema: Schema<Admin> = new Schema({
  adminName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the Mongoose model
export const AdminModel = mongoose.model<Admin>("Admin", AdminSchema);

export const findUserByEmailAdmin = async (
  email: string
): Promise<Admin | null> => {
  const admin = await AdminModel.findOne({ email });
  return admin ? admin : null;
};

// export const getAllUnapprovalFromDB = async () => {
//   return await VendorModel.find({ adminVerified: false }).sort({
//     createdAt: -1,
//   });
// };

// export const updateVendorFromDB = async (id: string) => {
//   return await VendorModel.findOneAndUpdate(
//     { _id: id },
//     { $set: { adminVerified: true } },
//     {
//       returnOriginal: false,
//       upsert: false,
//     }
//   );
// };
