import { Model } from "mongoose";
import UserModel from "../models/userModel";
import AdminModel from "../models/adminModel";
import chatModel from "../models/chatModel";
import VendorModel from "../models/vendorModel";
import { Vendor } from "../interfaces/vendor";
import { Admin } from "../interfaces/admin";
import { Ichat } from "../interfaces/chat";
import { User } from "../interfaces/user";

export class BaseRepository<T > {
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

 

   

    async getAll(){
        try {
            return await this.vendorModel.find().sort({ createdAt: -1 }).exec();
        } catch (error) {
            throw new Error(`Error fetching records from the database: ${error}`);
        }
    }

}

export const baseRepo = new BaseRepository(
    UserModel,
    VendorModel,
    AdminModel,
    chatModel
);
