import mongoose from "mongoose";

export interface ReviewsDocument extends Document {
    reviews: string;
    stars: number;
    userId: mongoose.Schema.Types.ObjectId; 
    vendorId: mongoose.Schema.Types.ObjectId;   createdAt: Date;
    vendorVerified:boolean
}