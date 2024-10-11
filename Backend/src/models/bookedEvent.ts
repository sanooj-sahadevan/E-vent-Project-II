
import mongoose, { Document, Schema } from 'mongoose';

interface Booking extends Document {
    vendorId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    totalAmount: number;
    paymentType?: string;
    paymentStatus: string;
    txnId?: string;
    date: Date;
    eventType: string;
    category: string;
    occupancy: number;
    dishesId?: mongoose.Schema.Types.ObjectId;
    auditoriumId?: mongoose.Schema.Types.ObjectId;
}

const bookingSchema = new Schema<Booking>({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
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
    eventType: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    occupancy: {
        type: Number,
        required: false
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        default: "online"
    },
    paymentStatus: {
        type: String,
        required: true
    },
    txnId: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export const bookedModel = mongoose.model<Booking>("Booked", bookingSchema);
