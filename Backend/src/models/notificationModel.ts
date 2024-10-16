import mongoose, { Schema, Types } from "mongoose";
import { INotification } from "../interfaces/notification";

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

// Export as Notification
export const Notification = mongoose.model("Notification", NotificationSchema);
