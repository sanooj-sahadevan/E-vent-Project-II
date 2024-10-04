import mongoose from "mongoose";

export interface Ichat  {
    _id: any;
    // members: String[];
    userId: mongoose.Schema.Types.ObjectId;
    vendorId: mongoose.Schema.Types.ObjectId;
  }