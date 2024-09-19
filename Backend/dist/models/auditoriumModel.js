import mongoose, { Schema } from 'mongoose';
const auditoriumSchema = new Schema({
    auditoriumName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    images: {
        type: [String], // Changed to array of strings
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
    capacity: {
        type: Number, // Changed to Number
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    types: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const Auditorium = mongoose.model("Auditorium", auditoriumSchema);
