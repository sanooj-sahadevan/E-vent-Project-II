import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  chatId: mongoose.Schema.Types.ObjectId; // Reference to chat
  senderId: mongoose.Schema.Types.ObjectId; // Reference to the sender (User or Company)
  senderModel: "User" | "Vendor"; // To differentiate between User and Company
  text: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
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
  },
  { timestamps: true }
);


export const messageModel = mongoose.model<IMessage>("Message", MessageSchema);