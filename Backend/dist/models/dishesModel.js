import mongoose, { Schema } from 'mongoose';
const dishesSchema = new Schema({
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
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VendorId",
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
}, { timestamps: true });
export const Dishes = mongoose.model("Dishes", dishesSchema);
