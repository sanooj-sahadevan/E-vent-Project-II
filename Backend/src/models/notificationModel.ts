import { Schema, Document, model, Types } from "mongoose";

interface INotification extends Document {
  userId: Types.ObjectId;
  vendorId: Types.ObjectId;
  notificationMessage: string;
  isRead: boolean;
  type: string;  // Added type field here
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,  // Set to true to ensure a user is always associated
      ref: "users",
    },
    vendorId: {  // Added vendorId field
      type: Types.ObjectId,
      required: true,
      ref: "vendors",  // Assuming you have a vendors collection
    },
    notificationMessage: {
      type: String,
      required: true,  // Made required
    },
    type: {  // Ensure type is defined
      type: String,
      required: true,
      enum: ["follow", "like", "comment", "dish_added"],  // Added dish_added type
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

export default model<INotification>("notifications", NotificationSchema);
export type { INotification };
