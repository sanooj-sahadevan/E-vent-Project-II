import mongoose, { Schema } from 'mongoose';
const auditoriumSchema = new Schema({
    auditoriumName: {
        type: String,
        required: true,
    }, isDeleted: { type: Boolean, default: false }, // Correctly defined as a boolean
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
        ref: "Vendor",
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    capacity: {
        type: Number, // Changed to Number
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    types: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export const Auditorium = mongoose.model("Auditorium", auditoriumSchema);
