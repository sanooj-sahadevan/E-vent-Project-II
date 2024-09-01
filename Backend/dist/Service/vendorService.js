import jwt from "jsonwebtoken";
import { createVendor, findVendorByEmail, updateVendor, } from "../Repository/vendorRepo.js";
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
    const vendorToken = jwt.sign({ vendorId: vendor._id }, 'sanoojsanooj', {
        expiresIn: "1h",
    });
    return { vendor, vendorToken };
};
