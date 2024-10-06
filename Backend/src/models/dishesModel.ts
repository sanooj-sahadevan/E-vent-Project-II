import mongoose, { Document, Schema } from 'mongoose';
import { DishDocument } from '../interfaces/dishes';



const dishesSchema = new Schema<DishDocument>(
  {
    dishesName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    images: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    // vendorId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "VendorId",
    //   required: false,
    // },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", // Ensure this matches your actual Vendor model name
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    types: {
      type: String,
      required: true,
    }, isDeleted: { type: Boolean, default: false }, // Correctly defined as a boolean

    menu: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Dishes = mongoose.model<DishDocument>("Dishes", dishesSchema);
export type { DishDocument };
