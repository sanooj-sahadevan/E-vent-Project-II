import mongoose, { Schema } from "mongoose";
const MessageSchema = new Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "senderModel",
    },
    senderModel: {
        type: String,
        enum: ["User", "Vendor"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
export const messageModel = mongoose.model("Message", MessageSchema);
