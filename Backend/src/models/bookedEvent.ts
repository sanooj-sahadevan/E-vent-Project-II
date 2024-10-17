
import mongoose, { Document, Schema } from 'mongoose';

interface Booking extends Document {
    vendorId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    totalAmount: number;
    paymentType?: string;
    paymentStatus: string;
    txnId?: string;
    StartingDate: Date;
    EndingDate: Date;
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
        required: false
    },
    category: {
        type: String,
        required: false
    },
    occupancy: {
        type: Number,
        required: false
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
        required: false,        default: "pending"

    },
    txnId: {
        type: String,
        default: null
    },
    StartingDate: {
        type: Date,
        required: false
    },
    EndingDate: {
        type: Date,
        required: false
    }
}, { timestamps: true });

export const bookedModel = mongoose.model<Booking>("Booked", bookingSchema);
