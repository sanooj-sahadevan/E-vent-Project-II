import mongoose, { Document, Schema } from 'mongoose';

interface AuditoriumDocument extends Document {
  vendorId: mongoose.Schema.Types.ObjectId;
  auditoriumName: string;
  description?: string;
  types: string;
  price: number;
  category?: string;
  status: string;
  images?: string; 
  capacity: number;  
  isDeleted: boolean;

}

const auditoriumSchema = new Schema<AuditoriumDocument>(
  {
    auditoriumName: {
      type: String,
      required: true,
    }, isDeleted: { type: Boolean, default: false }, // Correctly defined as a boolean

    description: {
      type: String,
      required: false,
    },
    images: {
      type: [String],  // Changed to array of strings
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
      type: Number,  // Changed to Number
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
  },
  { timestamps: true }
);

export const Auditorium = mongoose.model<AuditoriumDocument>("Auditorium", auditoriumSchema);
export type { AuditoriumDocument };
