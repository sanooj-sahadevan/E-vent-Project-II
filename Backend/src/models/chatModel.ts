
import mongoose, { Document, Schema } from "mongoose";
import { Ichat } from "../interfaces/chat";



const ChatSchema = new Schema<Ichat>(
  {
    // members: {
    //   type: [String],
    // },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", // it is reference of company
      required: true,
    },
  },
  { timestamps: true }
);

export const chatModel = mongoose.model<Ichat>("Chat", ChatSchema);
export default chatModel