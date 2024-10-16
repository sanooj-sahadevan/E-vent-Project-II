import mongoose, { Schema, Types } from "mongoose";
import { INotification } from "../interfaces/notification";

// Define the notification schema
const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "Users",
    },
    vendorId: {
      type: Types.ObjectId,
      ref: "Vendors",
    },
    notificationMessage: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["dish_added", "like", "comment", "dish_added"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Rename the model to avoid conflict
export const NotificationModel = mongoose.model("NotificationModel", NotificationSchema);
