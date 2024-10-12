

import mongoose, { Schema } from "mongoose";

const ReviewSchema: Schema = new Schema({
  vendorVerified: { type: Boolean, required: false }, // Required field

  reviews: { type: String, required: true }, // Required field
  stars: { type: Number, required: true },  // Required field
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Required field
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, }, // Required field
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

export const Reviews = mongoose.model("Reviews", ReviewSchema);
