import mongoose, { Document, Schema } from 'mongoose';

interface AuditoriumDocument extends Document {
  vendorId: mongoose.Schema.Types.ObjectId;
  auditoriumName: string;
  description?: string;
  types: string;
  price: number;
  category?: string;
  status: string;
  images?: string;  // Changed to array of strings
  capacity: number;   // Changed to Number
}

const auditoriumSchema = new Schema<AuditoriumDocument>(
  {
    auditoriumName: {
      type: String,
      required: true,
    },
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
      ref: "VendorId",
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    capacity: {
      type: Number,  // Changed to Number
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
  },
  { timestamps: true }
);

export const Auditorium = mongoose.model<AuditoriumDocument>("Auditorium", auditoriumSchema);
export type { AuditoriumDocument };
