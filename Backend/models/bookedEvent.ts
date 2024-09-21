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
    createdAt: Date;
}

const bookingSchema = new Schema<Booking>({
    dishesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dishes",
        required: true
    },
    auditoriumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auditorium",
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
        required: true
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

export const bookedModel = mongoose.model<Booking>("BookedTrip", bookingSchema);
