import { loginVendor, registerVendor, 
//   uploadImage,
//   uploadTrip,
verifyAndSaveVendor, } from "../Service/vendorService.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
import { findVendorByEmail } from "../Repository/vendorRepo.js";
export const register = async (req, res) => {
    try {
        const { vendorname, email, phone, password } = req.body;
        // Assign default values to the missing properties
        // const categories = req.body.categories || "defaultCategory";
        // const reviews = req.body.reviews || "No reviews";
        const proceedWithRegistration = async () => {
            try {
                const otp = otpGenerator();
                console.log(otp);
                await registerVendor({
                    vendorname,
                    phone,
                    email,
                    password,
                    otp,
                    // categories,
                    // reviews,
                });
                await sendEmail(email, otp);
                res.status(200).json("OTP sent to email");
            }
            catch (error) {
                res
                    .status(400)
                    .json({ error: "Registration failed: " + error.message });
            }
        };
        proceedWithRegistration();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);
        const vendor = await findVendorByEmail(email);
        console.log(vendor);
        if (!vendor) {
            return res.status(404).json({ error: "vendor not found" });
        }
        if (vendor.otp === otp) {
            await verifyAndSaveVendor(email, otp);
            res.status(200).json("vendor registered successfully");
        }
        else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const { vendor, vendorToken } = await loginVendor(email, password);
        if (vendor) {
            res.cookie("vendorToken", vendorToken);
            res.status(200).json({ vendor, vendorToken });
        }
        else {
            res.status(200).json({ vendor });
        }
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
