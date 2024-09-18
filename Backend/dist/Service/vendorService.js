import jwt from "jsonwebtoken";
import { createVendor, findVendorByEmail, findVendorByIdInDb, updateVendor, vendorAddressFromDB, vendorEditFromDB, } from "../Repository/vendorRepo.js";
import { uploadToS3Bucket } from "../middleware/fileUpload.js";
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
        //   const hashedPassword = await bcrypt.hash(vendor.password, 10);
        //   vendor.password = hashedPassword;
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
    // const isPasswordValid = await bcrypt.compare(password, vendor.password);
    // if (!isPasswordValid) {
    //   throw new Error("Invalid Email/Password");
    // }
    console.log('jwt');
    const vendorToken = jwt.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return { vendor, vendorToken };
};
export const vendorAddress = async () => {
    try {
        return await vendorAddressFromDB(); // Fetch from the repository
    }
    catch (error) {
        throw new Error('Failed to fetch vendor addresses'); // Throw error to controller
    }
};
export const editVendor = async (vendorDetails, imageUrl) => {
    try {
        console.log('service');
        // Pass both vendor details and image URL to the repository
        return await vendorEditFromDB(vendorDetails, imageUrl);
    }
    catch (error) {
        throw new Error('Failed to update vendor details');
    }
};
//   import { IMulterFile } from '../utils/type';
// import { uploadToS3Bucket } from '../repositories/s3Repository'; // Adjust the import path as needed
// import { IMulterFile } from '../utils/type';
// import { uploadToS3Bucket } from '../repositories/s3Repository'; // Adjust the import path as needed
export const uploadImage = async function (imageFile) {
    try {
        const uploadedUrl = await uploadToS3Bucket([imageFile], imageFile); // Pass both the array and file
        return uploadedUrl;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const findVendorById = async (vendorId) => {
    try {
        console.log('controller 2');
        const vendor = await findVendorByIdInDb(vendorId);
        return vendor;
    }
    catch (error) {
        throw new Error(`Error finding vendor: ${error}`);
    }
};
