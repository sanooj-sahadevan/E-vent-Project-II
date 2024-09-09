import mongoose, { Schema } from "mongoose";
// Define the Mongoose schema for the User
const AdminSchema = new Schema({
    adminName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
// Create the Mongoose model
export const AdminModel = mongoose.model("Admin", AdminSchema);
export const findUserByEmailAdmin = async (email) => {
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
