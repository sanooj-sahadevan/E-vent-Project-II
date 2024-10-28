import { Types } from "mongoose";


export interface INotification extends Document {

    userId: any
    vendorId: any
    notificationMessage: string;
    isRead: boolean;
    type: string;
}
