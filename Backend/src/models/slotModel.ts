import mongoose, { Schema, Document } from 'mongoose';
import { ISlot } from '../interfaces/slot';



const slotSchema = new Schema<ISlot>({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'Worker',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
}, { timestamps: true });

export const Slot = mongoose.model<ISlot>('Slot', slotSchema);