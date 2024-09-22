import mongoose, { Document, Schema } from 'mongoose';

interface DishDocument extends Document {
  vendorId: mongoose.Schema.Types.ObjectId;
  dishesName: string;
  description?: string;
  menu: string;
  types: string;
  price: number;
  category?: string;
  status: string;
  images?: string
}

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
    },
    menu: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Dishes = mongoose.model<DishDocument>("Dishes", dishesSchema);
export type { DishDocument };
