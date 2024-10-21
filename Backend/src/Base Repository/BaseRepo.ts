
// import { Model } from "mongoose";
// import UserModel from "../models/userModel";
// import { AdminModel } from "../models/adminModel";
// import { chatModel } from "../models/chatModel";
// import VendorModel from "../models/vendorModel";
// import { Vendor } from "aws-sdk/clients/directconnect";

// export class BaseRepository<T> {
//     protected UserModel: Model<T>;
//     protected VendorModel: Model<Vendor>;
//     protected AdminModel: Model<T>;
//     protected chatModel: Model<T>;

//     constructor(
//         userModel: Model<T>,
//         vendorModel: Model<Vendor>,
//         adminModel: Model<T>,
//         chatModel: Model<T>
//     ) {
//         this.UserModel = userModel;
//         this.VendorModel = vendorModel;
//         this.AdminModel = adminModel;
//         this.chatModel = chatModel;
//     }

// }

// const BaseRepo = new BaseRepository(UserModel, VendorModel, AdminModel, chatModel)

// export default BaseRepository



import { Model } from "mongoose";
import UserModel from "../models/userModel";
import AdminModel from "../models/adminModel";
import chatModel from "../models/chatModel";
import VendorModel from "../models/vendorModel";
import { Vendor } from "../interfaces/vendor";
import { Admin } from "../interfaces/admin";
import { Ichat } from "../interfaces/chat";
import { User } from "../interfaces/user";

export class BaseRepository<T> {
    protected userModel: Model<User>;
    protected vendorModel: Model<Vendor>;
    protected adminModel: Model<Admin>;
    protected chatModel: Model<Ichat>;

    constructor(
        userModel: Model<User>,
        vendorModel: Model<Vendor>,
        adminModel: Model<Admin>,
        chatModel: Model<Ichat>
    ) {
        this.userModel = userModel;
        this.vendorModel = vendorModel;
        this.adminModel = adminModel;
        this.chatModel = chatModel;
    }


    async getAllVendors() {
        try {
            return await this.vendorModel.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new Error('Error fetching vendors from the database');
        }
    }



}

export const baseRepo = new BaseRepository(
    UserModel,
    VendorModel,
    AdminModel,
    chatModel
);

export default BaseRepository;
