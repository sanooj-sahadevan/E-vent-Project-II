import mongoose, { Document, Schema } from 'mongoose';

interface Booking extends Document {
    dishesId: mongoose.Schema.Types.ObjectId;
    auditoriumId: mongoose.Schema.Types.ObjectId;
    vendorId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    date: Date;
    category: string;
    totalAmount: number;
    paymentType?: string;
    paymentStatus?: string;
    createdAt: Date
}

const bookingSchema = new Schema<Booking>({
    dishesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dishes",
        required: false
    },
    auditoriumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auditorium",
        required: false
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: false
    },
    paymentType: {
        type: String,
        default: "online"
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const bookedModel = mongoose.model<Booking>("Booked", bookingSchema);
export type { Booking };
