import jwt from "jsonwebtoken";
import { createVendor, findVendorByEmail, findVendorByIdInDb, updateVendor, chatDB, editVendorRepo, vendorAddressFromDB, findVendorByEmailRepo, createDishes, createAuditorium, findDetailsByvendorId, findFoodVendorIdInDb, findAuditoriumVendorIdInDb, findDishesByIdInDb, findAuditoriumByIdInDb, softDeleteDishRepo, softDeleteAuditoriumRepo, messageDB, } from "../Repository/vendorRepo.js";
import { uploadToS3Bucket } from "../middleware/fileUpload.js";
import { io } from "../index.js";
export const registerVendor = async (vendor) => {
    try {
        const existingVendor = await findVendorByEmail(vendor.email);
        console.log(existingVendor);
        if (existingVendor) {
            if (existingVendor.otpVerified) {
                throw new Error("User already exists");
            }
            else {
                await updateVendor(existingVendor.email, vendor);
                return existingVendor;
            }
        }
        return await createVendor(vendor);
    }
    catch (error) {
        console.error("Error during user registration:", error);
        throw error;
    }
};
export const verifyAndSaveVendor = async (email, otp) => {
    const vendor = await findVendorByEmail(email);
    if (vendor && vendor.otp === otp) {
        vendor.otp = undefined;
        vendor.otpVerified = true;
        await vendor.save();
        return vendor;
    }
    throw new Error("Invalid OTP");
};
export const loginVendor = async (email, password) => {
    const vendor = await findVendorByEmail(email);
    if (!vendor) {
        throw new Error("Invalid Email/Password");
    }
    const vendorToken = jwt.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return { vendor, vendorToken };
};
export const vendorAddress = async () => {
    try {
        return await vendorAddressFromDB();
    }
    catch (error) {
        throw new Error('Failed to fetch vendor addresses');
    }
};
// service/vendorService.ts
export const editVendorService = async (vendorDetails, imageUrl) => {
    try {
        const existingVendor = await findVendorByEmailRepo(vendorDetails.email);
        if (existingVendor) {
            return await editVendorRepo(existingVendor, vendorDetails, imageUrl);
        }
        else {
            return await editVendorRepo(null, vendorDetails, imageUrl);
        }
    }
    catch (error) {
        throw new Error('Failed to update vendor details');
    }
};
export const uploadImage = async function (imageFile) {
    try {
        console.log('first step');
        const uploadedUrl = await uploadToS3Bucket([], imageFile);
        return uploadedUrl;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const findVendorById = async (vendorId) => {
    try {
        const vendor = await findVendorByIdInDb(vendorId);
        if (!vendor) {
            throw new Error(`Error finding vendor`);
        }
        return vendor;
    }
    catch (error) {
        throw new Error(`Error finding vendor: ${error}`);
    }
};
export const findAuditoriumById = async (auditoriumId) => {
    try {
        console.log('controller 2');
        const vendor = await findAuditoriumByIdInDb(auditoriumId);
        if (!vendor) {
            throw new Error(`Error finding vendor`);
        }
        return vendor;
    }
    catch (error) {
        throw new Error(`Error finding vendor: ${error}`);
    }
};
export const findDishesById = async (dishesId) => {
    try {
        const vendor = await findDishesByIdInDb(dishesId);
        if (!vendor) {
            throw new Error(`Error finding vendor`);
        }
        return vendor;
    }
    catch (error) {
        throw new Error(`Error finding vendor: ${error}`);
    }
};
export const uploadDishes = async (vendorId, data, images) => {
    try {
        const dishesData = { vendorId, data, images };
        // Ensure price is a number
        dishesData.data.price = Number(dishesData.data.price);
        const newDish = await createDishes(dishesData);
        return newDish;
    }
    catch (error) {
        console.error("Error in uploadDishes: ", error);
        console.error();
    }
};
export const uploadAuditorium = async (vendorId, data, image) => {
    try {
        const auditoriumData = { vendorId, data, image };
        auditoriumData.data.price = Number(auditoriumData.data.price);
        const newAuditorium = await createAuditorium(auditoriumData);
        return newAuditorium;
    }
    catch (error) {
        console.error("Error in uploadAuditorium: ", error);
        throw error;
    }
};
export const findFoodVendorById = async (vendorId) => {
    try {
        console.log('Service invoked to find dishes for vendor:', vendorId);
        const dishes = await findFoodVendorIdInDb(vendorId);
        return dishes;
    }
    catch (error) {
        throw new Error(`Error finding vendor dishes: ${error}`);
    }
};
export const findAuditoriumVendorById = async (vendorId) => {
    try {
        console.log('Service invoked to find auditorium for vendor:', vendorId);
        const Auditorium = await findAuditoriumVendorIdInDb(vendorId);
        return Auditorium;
    }
    catch (error) {
        throw new Error(`Error finding vendor dishes: ${error}`);
    }
};
export const softDeleteDishService = async (dishId) => {
    try {
        const updatedDish = await softDeleteDishRepo(dishId);
        if (!updatedDish) {
            throw new Error(`Error soft-deleting dish`);
        }
        return updatedDish;
    }
    catch (error) {
        throw new Error(`Error soft-deleting dish: ${error}`);
    }
};
export const softDeleteAuditoriumService = async (auditoriumId) => {
    try {
        const updatedAuditorium = await softDeleteAuditoriumRepo(auditoriumId);
        if (!updatedAuditorium) {
            throw new Error(`Error soft-deleting auditorium`);
        }
        return updatedAuditorium;
    }
    catch (error) {
        throw new Error(`Error soft-deleting auditorium: ${error}`);
    }
};
export const findBookingDetails = async (vendorId) => {
    try {
        const bookingDetails = await findDetailsByvendorId(vendorId);
        if (!bookingDetails) {
            throw new Error(`Error soft-deleting auditorium`);
        }
        return bookingDetails;
    }
    catch (error) {
        throw new Error(`Error soft-deleting auditorium: ${error}`);
    }
};
export const findVendorByEmailService = async (email) => {
    try {
        const vendor = await findVendorByEmail(email);
        return vendor;
    }
    catch (error) {
        console.error(error);
    }
};
export const chatServices = async ({ vendorId }) => {
    try {
        const chats = await chatDB(vendorId);
        return chats;
    }
    catch (error) {
        console.error("Error fetching chats:", error);
        throw error;
    }
};
export const messageService = async ({ chatIds, vendorId, }) => {
    try {
        const unreadCount = await messageDB(chatIds);
        io.to(vendorId).emit("unreadCount", { unreadCount });
        return unreadCount;
    }
    catch (error) {
        console.error("Error fetching unread messages:", error);
        throw error;
    }
};
