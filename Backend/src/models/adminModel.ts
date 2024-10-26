import mongoose, { Schema } from "mongoose";
import { Admin } from "../interfaces/admin";

const AdminSchema: Schema<Admin> = new Schema({

    adminName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  export const AdminModel = mongoose.model<Admin>("Admin", AdminSchema);
  export default AdminModel