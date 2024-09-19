import mongoose, { Schema, Document } from "mongoose";
import { User } from "../models/userModel.js"; // Assuming this is the full User interface
import bcrypt from "bcrypt";
import { VendorModel } from "./vendorRepo.js";

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
  password: { type: String, required: true },
  profileImage: { type: String },
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },
  address: { type: String },
  state: { type: String },
  district: { type: String }, // Added 'district'
  pincode: { type: Number },
  reviews: { type: [String] } // Added 'reviews'
});

// Create the Mongoose model with the appropriate type
const UserModel = mongoose.model<IUserModel>("User", UserSchema);

export default UserModel;


// Function to create a new user
export const createUser = async (user: User) => {
  try {
    console.log('repo');

  const newUser = new UserModel(user);
  return newUser.save();
    
  } catch (error) {
    console.error(error);
    
  }
};

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};



export const findUserById = async (userId: string) => {
  return UserModel.findById(userId);
};




// export const updateUser = async (email: string, update: Partial<User>) => {
//   return UserModel.findOneAndUpdate({ email }, update, { new: true });
// };



export const userEditFromDB = async (userDetails: User): Promise<IUserModel> => { // Ensure it returns IUserModel
  try {
    // Find the user by email
    const existingUser = await UserModel.findOne({ email: userDetails.email });

    if (existingUser) {
      // Update user details
      existingUser.username = userDetails.username;
      existingUser.phone = userDetails.phone;
      existingUser.profileImage = userDetails.profileImage;
      existingUser.address = userDetails.address;
      existingUser.state = userDetails.state;
      existingUser.district = userDetails.district; // Now this works
      existingUser.pincode = userDetails.pincode;
      existingUser.reviews = userDetails.reviews; // Now this works

      // Only update password if provided
      if (userDetails.password) {
        existingUser.password = userDetails.password;
      }

      // Save the updated user
      await existingUser.save();
      return existingUser;
    } else {
      // If user doesn't exist, create a new one
      const newUser = new UserModel(userDetails);
      await newUser.save();
      return newUser;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Database operation failed');
  }
};













 // Import the User type

// Function to update user details in the database
// export const userEditFromDB = async (userDetails: User): Promise<User> => {
//   try {
//     const { id, ...updates } = userDetails; // Assume userDetails contains an id and update fields
//     const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true }); // Update user and return the updated document
//     if (!updatedUser) {
//       throw new Error('User not found');
//     }
//     return updatedUser;
//   } catch (error) {
//     console.error('Error updating user:', error);
//     throw new Error('Failed to update user details');
//   }
// };




export const updateUser = async (email: string, update: Partial<User>) => {
  return UserModel.findOneAndUpdate({ email }, update, { new: true });
};

export const findUserByEmailupdate = async (email: string, password: string) => {
  console.log('Repository: Updating user password');

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  console.log(user.email);

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  await user.save();
  return user; // Return the updated user
};

// import { VendorModel } from '../model/VendorModel.js'; // Import your Mongoose model

export class VendorRepository {
  // Fetch all vendors from the database
  public async getAllVendors(): Promise<any[]> {
    try {
      return await VendorModel.find().sort({ createdAt: -1 }); // Fetch vendors sorted by creation date
    } catch (error) {
      throw new Error('Error fetching vendors from the database');
    }
  }
}


// // export const userEditFromDB = async (userDetails: User): Promise<User> => {
// //   try {
// //     const existingUser = await UserModel.findOne({ email: userDetails.email });

// //     if (existingUser) {
// //       // Update user details
// //       existingUser.username = userDetails.username;
// //       existingUser.phone = userDetails.phone;
// //       existingUser.profileImage = userDetails.profileImage;
// //       existingUser.address = userDetails.address;
// //       existingUser.state = userDetails.state;
// //       existingUser.pincode = userDetails.pincode;

// //       // Only update password if provided
// //       if (userDetails.password) {
// //         existingUser.password = userDetails.password;
// //       }

// //       // Save the updated user
// //       await existingUser.save();
// //       return existingUser;
// //     } else {
// //       // If user doesn't exist, create a new one
// //       const newUser = new UserModel(userDetails);
// //       await newUser.save();
// //       return newUser;
// //     }
// //   } catch (error) {
// //     console.error('Error updating user:', error);
// //     throw new Error('Database operation failed');
// //   }
// // };

