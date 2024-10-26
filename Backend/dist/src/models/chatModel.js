import mongoose, { Schema } from "mongoose";
const ChatSchema = new Schema({
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
}, { timestamps: true });
export const chatModel = mongoose.model("Chat", ChatSchema);
