import mongoose, { Schema, Document } from "mongoose";
import { User } from "../models/userModel.js"; // Assuming this is the full User interface
import bcrypt from "bcrypt";
import { VendorModel } from "./vendorRepo.js";
import { Dishes } from "../models/dishesModel.js";
import { Auditorium } from "../models/auditoriumModel.js";
import { bookedModel } from "../models/bookedEvent.js";
import { chatModel } from "../models/chatModel.js";

// Extend Mongoose's Document interface
interface IUserModel extends Document {
  username: string;
  phone?: number;
  email: string;
  password: string;
  profileImage?: string;
  otp?: string;
  otpVerified?: boolean;
  address?: string;
  state?: string;
  district?: string; // Added 'district'
  pincode?: number;
  reviews?: string[]; // Added 'reviews'
}

// Define the Mongoose schema for the User
const UserSchema = new Schema<IUserModel>({
  username: { type: String, required: true },
  phone: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  profileImage: { type: String },
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },
  address: { type: String },
  state: { type: String },
  district: { type: String }, // Added 'district'
  pincode: { type: Number },
  reviews: { type: [String] } // Added 'reviews'
});

const UserModel = mongoose.model<IUserModel>("User", UserSchema);
export default UserModel;




export const createUser = async (user: User) => {
  try {
    const newUser = new UserModel(user);
    return newUser.save();
  } catch (error) {
    console.error(error);

  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return UserModel.findOne({ email });
  } catch (error) {
    console.error(error);

  }
};


export const findUserById = async (userId: string) => {
  try {
    return UserModel.findById(userId);
  } catch (error) {
    console.error(error);

  }
};


export const userEditFromDB = async (userDetails: User): Promise<IUserModel> => {
  try {
    const existingUser = await UserModel.findOne({ email: userDetails.email });

    if (existingUser) {
      existingUser.username = userDetails.username;
      existingUser.phone = userDetails.phone;
      existingUser.profileImage = userDetails.profileImage;
      existingUser.address = userDetails.address;
      existingUser.state = userDetails.state;
      existingUser.district = userDetails.district;
      existingUser.pincode = userDetails.pincode;
      existingUser.reviews = userDetails.reviews;

      await existingUser.save();
      return existingUser;
    } else {
      const newUser = new UserModel(userDetails);
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Database operation failed');
  }
};


export const updateUser = async (email: string, update: Partial<User>) => {
  try {
    return UserModel.findOneAndUpdate({ email }, update, { new: true });
  } catch (error) {
    console.error(error);
  }
};

export const findUserByEmailupdate = async (email: string, password: string) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    console.log(user.email);
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    return user;
  } catch (error) {
    console.error(error);

  }
};


export class VendorRepository {
  public async getAllVendors(): Promise<any[]> {
    try {
      return await VendorModel.find().sort({ createdAt: -1 }); // Fetch vendors sorted by creation date
    } catch (error) {
      throw new Error('Error fetching vendors from the database');
    }
  }
}

export const fetchfromDBDishes = async (vendorId: string): Promise<any | null> => {
  try {
    console.log('Fetching Dishes for vendor ID:', vendorId);

    const objectId = new mongoose.Types.ObjectId(vendorId);
    console.log(objectId);

    const result = await Auditorium.find(objectId);

    console.log('Fetched Dishes:', result);

    return result;
  } catch (error) {
    console.error('Error fetching Dishes from the database:', error);
    throw new Error('Error fetching Dishes from the database');
  }

};


export const fetchfromDBAuditorium = async (vendorId: string): Promise<any | null> => {
  try {
    console.log('Fetching auditorium for vendor ID:', vendorId);

    const objectId = new mongoose.Types.ObjectId(vendorId);
    console.log(objectId);

    const result = await Auditorium.findById(objectId);

    console.log('Fetched auditorium:', result);

    return result;
  } catch (error) {
    console.error('Error fetching auditorium from the database:', error);
    throw new Error('Error fetching auditorium from the database');
  }
};



export const findVendorByIdInDb = async (vendorId: string, userId: string) => {
  try {
    // Find the vendor by ID
    const vendor = await VendorModel.findById(vendorId);
    if (!vendor) {
      throw new Error("Vendor not found");
    }


    let chat = await chatModel.findOne({ userId, vendorId });

    if (!chat) {
      chat = new chatModel({
        userId,
        vendorId,
      });
      await chat.save();
    }

    return {
      vendor,
      chatId: chat._id
    };
  } catch (error) {
    console.error("Error in repository:", error);
    throw error;
  }
};




export const findFoodVendorIdInDb = async (vendorId: string) => {
  try {
    const objectId = new mongoose.Types.ObjectId(vendorId);
    const result = await Dishes.find({ vendorId: objectId });
    console.log('Result from database:', result);
    if (result.length === 0) {
      console.log('No dishes found for vendor:', vendorId);
      return null;
    }

    return result;
  } catch (error) {
    console.error('Error fetching dishes for vendor:', error);
    throw new Error(`Error fetching dishes: ${error}`);
  }
};

export const findAuditoriumVendorIdInDb = async (vendorId: string) => {

  try {
    const objectId = new mongoose.Types.ObjectId(vendorId);

    const result = await Auditorium.find({ vendorId: objectId });  // Query the Dishes collection
    console.log('Result from database:', result);

    if (result.length === 0) {
      console.log('No dishes found for vendor:', vendorId);
      return null;  // Return null if no dishes found
    }

    return result;  // Return the found dishes
  } catch (error) {
    console.error('Error fetching dishes for vendor:', error);
    throw new Error(`Error fetching dishes: ${error}`);  // Return only the error message
  }
};


export const findAuditoriumByIdInDb = async (auditoriumId: string) => {

  try {
    let result = await Auditorium.findById(auditoriumId);
    console.log(result);
    return result
  } catch (error) {
    console.error(error);

  }
};



export const finddishesByIdInDb = async (dishesId: string) => {
  try {
    let result = await chatModel.findById(dishesId);
    console.log(result);
    return result
  } catch (error) {
    console.error(error);
  }
};







export const getBookingDetail = async (id: string) => {
  try {
    const bookedData = await bookedModel
      .findById(id)
      .populate("tripId")
      .populate("userId");

    if (!bookedData) {
      throw new Error(`Booking with id ${id} not found`);
    }
    return bookedData;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};




export const createBookedTrip = async (
  productinfo: string,
  txnid: string,
  status: string
) => {
  try {

    console.log('save karo');

    const bookedData = await bookedModel.create({
      productinfo,
      txnId: txnid,
      paymentStatus: status,
    });

    return bookedData;
  } catch (error) {
    console.error(error);
    return null;
  }
};



export const savechatDB = async (chat: string) => {
  try {
    console.log('Saving chat to DB');

    const newChat = new chatModel({ message: chat });  // Create a new instance of the Chat model
    return await newChat.save();  // Save the chat in the database
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database operation failed.");  // Handle and throw database-related errors
  }
};