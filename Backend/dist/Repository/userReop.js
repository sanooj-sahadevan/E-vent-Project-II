import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { VendorModel } from "./vendorRepo.js";
import { Dishes } from "../models/dishesModel.js";
import { Auditorium } from "../models/auditoriumModel.js";
// Define the Mongoose schema for the User
const UserSchema = new Schema({
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
// Create the Mongoose model with the appropriate type
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
// Function to create a new user
export const createUser = async (user) => {
    try {
        console.log('repo');
        const newUser = new UserModel(user);
        return newUser.save();
    }
    catch (error) {
        console.error(error);
    }
};
export const findUserByEmail = async (email) => {
    return UserModel.findOne({ email });
};
export const findUserById = async (userId) => {
    return UserModel.findById(userId);
};
// export const updateUser = async (email: string, update: Partial<User>) => {
//   return UserModel.findOneAndUpdate({ email }, update, { new: true });
// };
export const userEditFromDB = async (userDetails) => {
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
            existingUser.district = userDetails.district;
            existingUser.pincode = userDetails.pincode;
            existingUser.reviews = userDetails.reviews;
            // Only update password if provided
            // if (userDetails.password) {
            //   existingUser.password = userDetails.password;
            // }
            // Save the updated user
            await existingUser.save();
            return existingUser;
        }
        else {
            // If user doesn't exist, create a new one
            const newUser = new UserModel(userDetails);
            await newUser.save();
            return newUser;
        }
    }
    catch (error) {
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
export const updateUser = async (email, update) => {
    return UserModel.findOneAndUpdate({ email }, update, { new: true });
};
export const findUserByEmailupdate = async (email, password) => {
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
    async getAllVendors() {
        try {
            return await VendorModel.find().sort({ createdAt: -1 }); // Fetch vendors sorted by creation date
        }
        catch (error) {
            throw new Error('Error fetching vendors from the database');
        }
    }
}
export const fetchfromDBDishes = async (vendorId) => {
    try {
        console.log('Fetching Dishes for vendor ID:', vendorId);
        const objectId = new mongoose.Types.ObjectId(vendorId);
        console.log(objectId);
        // `findById` returns a single document or null
        const result = await Auditorium.find(objectId);
        console.log('Fetched Dishes:', result);
        return result; // `result` is either an object or null
    }
    catch (error) {
        console.error('Error fetching Dishes from the database:', error);
        throw new Error('Error fetching Dishes from the database');
    }
};
export const fetchfromDBAuditorium = async (vendorId) => {
    try {
        console.log('Fetching auditorium for vendor ID:', vendorId);
        const objectId = new mongoose.Types.ObjectId(vendorId);
        console.log(objectId);
        // `findById` returns a single document or null
        const result = await Auditorium.findById(objectId);
        console.log('Fetched auditorium:', result);
        return result; // `result` is either an object or null
    }
    catch (error) {
        console.error('Error fetching auditorium from the database:', error);
        throw new Error('Error fetching auditorium from the database');
    }
};
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
export const findVendorByIdInDb = async (vendorId) => {
    console.log('controller 3   repo');
    return await VendorModel.findById(vendorId);
};
export const findFoodVendorIdInDb = async (vendorId) => {
    console.log('Fetching dishes for vendor ID myrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:', vendorId);
    try {
        // Ensure vendorId is an ObjectId
        const objectId = new mongoose.Types.ObjectId(vendorId); // Convert to ObjectId
        const result = await Dishes.find({ vendorId: objectId }); // Query the Dishes collection
        console.log('Result from database:', result);
        // Check if the result is an empty array
        if (result.length === 0) {
            console.log('No dishes found for vendor:', vendorId);
            return null; // Return null if no dishes found
        }
        return result; // Return the found dishes
    }
    catch (error) {
        console.error('Error fetching dishes for vendor:', error);
        throw new Error(`Error fetching dishes: ${error}`); // Return only the error message
    }
};
export const findAuditoriumVendorIdInDb = async (vendorId) => {
    console.log('Fetching dishes for vendor ID:', vendorId);
    try {
        // Ensure vendorId is an ObjectId
        const objectId = new mongoose.Types.ObjectId(vendorId); // Convert to ObjectId
        const result = await Auditorium.find({ vendorId: objectId }); // Query the Dishes collection
        console.log('Result from database:', result);
        // Check if the result is an empty array
        if (result.length === 0) {
            console.log('No dishes found for vendor:', vendorId);
            return null; // Return null if no dishes found
        }
        return result; // Return the found dishes
    }
    catch (error) {
        console.error('Error fetching dishes for vendor:', error);
        throw new Error(`Error fetching dishes: ${error}`); // Return only the error message
    }
};
