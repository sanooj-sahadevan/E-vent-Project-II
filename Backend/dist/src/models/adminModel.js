import mongoose, { Schema } from "mongoose";
const AdminSchema = new Schema({
    adminName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
export const AdminModel = mongoose.model("Admin", AdminSchema);
