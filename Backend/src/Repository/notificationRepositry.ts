import UserModel from "../models/userModel";
import { Notification }from "../models/notificationModel"; // Import the Notification model
import { string1To255 } from "aws-sdk/clients/customerprofiles";

async function createNotification(notificationData: { userId: any; vendorId: any; dishId: any; notificationMessage: string; type: any }) {
    return await Notification.create(notificationData);
}

async function getAllUsers() {
    return await UserModel.find();
}

export { createNotification, getAllUsers };
