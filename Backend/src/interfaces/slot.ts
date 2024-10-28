import mongoose from "mongoose";

export interface ISlot extends Document {
  vendorId: mongoose.Schema.Types.ObjectId;
    date: Date;
    isAvailable: boolean;
    startDate?: Date;
    endDate?: Date;
  }