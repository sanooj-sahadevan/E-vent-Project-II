import mongoose, { Document, Schema } from 'mongoose';

interface Booking extends Document {
    dishesId?: mongoose.Schema.Types.ObjectId; // Make optional if not always required
    auditoriumId?: mongoose.Schema.Types.ObjectId; // Make optional if not always required
    vendorId?: mongoose.Schema.Types.ObjectId; // Make optional if not always required
    userId: mongoose.Schema.Types.ObjectId; // Required for every booking
    date: Date; // Required for the date of the booking
    category: string; // Required category for the booking
    totalAmount: number; // Required total amount for the booking
    paymentType?: string; // Optional payment type
    paymentStatus?: string; // Optional payment status
    createdAt: Date; // Automatically set when booking is created
    payment_source: string; // Required for source of payment
}

const bookingSchema = new Schema<Booking>({
    dishesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dishes",
        required: false // Adjust based on your requirements
    },
    auditoriumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auditorium",
        required: false // Adjust based on your requirements
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: false // Adjust based on your requirements
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // User ID should be required for every booking
    },
    date: {
        type: Date,
        required: false // Date should be required for every booking
    },
    category: {
        type: String,
        required: false // Category should be required for every booking
    },
    totalAmount: {
        type: Number,
        required: false // Total amount should be required for every booking
    },
    paymentType: {
        type: String,
        default: "online" // Default payment type is online
    },
    paymentStatus: {
        type: String,
        default: "pending" // Default payment status is pending
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current date
    },
    payment_source: {
        type: String,
        required: false // Required for source of payment
    }
});

// Create the Mongoose model
export const bookedModel = mongoose.model<Booking>("Booked", bookingSchema);
export type { Booking };
