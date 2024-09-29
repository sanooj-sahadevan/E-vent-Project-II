// import mongoose, { Document, Schema } from 'mongoose';

// interface UserDetails {
//     firstname: string;
//     lastname: string;
//     email: string;
//     phone: string;
//     city: string;
//     state: string;
//     country: string;
//     zipcode: string;
// }

// interface Booking extends Document {
//     productinfo: string;
//     txnId: string;
//     paymentStatus: string;
//     totalAmount: number;
//     payment_source: string;
//     userDetails: UserDetails;
//     createdAt: Date;
// }

// const bookingSchema = new Schema<Booking>({
//     productinfo: {
//         type: String,
//         required: true,
//     },
//     txnId: {
//         type: String,
//         required: true,
//     },
//     paymentStatus: {
//         type: String,
//         required: true,
//     },
//     totalAmount: {
//         type: Number,
//         required: true,
//     },
//     payment_source: {
//         type: String,
//         required: true,
//     },
//     userDetails: {
//         firstname: { type: String, required: true },
//         lastname: { type: String, required: false },
//         email: { type: String, required: true },
//         phone: { type: String, required: true },
//         city: { type: String, required: false },
//         state: { type: String, required: false },
//         country: { type: String, required: false },
//         zipcode: { type: String, required: false },
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// export const bookedModel = mongoose.model<Booking>("Booked", bookingSchema);
// export type { Booking };

import mongoose, { Document, Schema } from 'mongoose';

interface Booking extends Document {
    vendorId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    totalAmount: number;
    paymentType?: string;
    paymentStatus: string;
    txnId?: string;
    eventDate: Date;
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
        required: true
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
        required: true
    },
    txnId: {
        type: String,
        default: null
    },
    eventDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export const bookedModel = mongoose.model<Booking>("bookedTrip", bookingSchema);
