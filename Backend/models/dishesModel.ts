// export interface Dishes {
//     dishName: string;
//     category?: string;
//     menu: string;
//     type: string;
//     profileImage?: string;
//     description?: string;
//     vendorID :string
// }

import mongoose, { Schema, Document } from "mongoose";

// Dishes interface extending Document from Mongoose
export interface IDishes extends Document {
  vendorId: string;
  dishName: string;
  description?: string;
  menu: string;
  type: string;
  price: number;
  category?: string;
  status: string;
  images?: string[];
}

// Dishes Schema
const DishesSchema: Schema = new Schema({
  vendorId: { type: String, required: true },
  dishName: { type: String, required: true },
  description: { type: String },
  menu: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  status: { type: String, required: true },
  images: [{ type: String }],
});

// Export Dishes model
export const DishesModel = mongoose.model<IDishes>("Dishes", DishesSchema);
