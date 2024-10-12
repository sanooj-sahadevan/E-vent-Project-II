

import mongoose, { Schema } from "mongoose";

const ReviewSchema: Schema = new Schema({
  vendorVerified: { type: Boolean, required: false }, 

  reviews: { type: String, required: true }, 
  stars: { type: Number, required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, },
}, {
  timestamps: true, 
});

export const Reviews = mongoose.model("Reviews", ReviewSchema);
